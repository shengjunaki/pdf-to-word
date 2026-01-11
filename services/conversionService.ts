import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import saveAs from 'file-saver';
import { ExtractedPage } from '../types';

// Configure the worker for PDF.js
// using unpkg to fetch the specific version's minified module worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Extracts text from a PDF file.
 * We attempt to group text items by their Y-coordinate to reconstruct lines.
 */
export const extractTextFromPDF = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<ExtractedPage[]> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the PDF document
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDocument = await loadingTask.promise;
  
  const numPages = pdfDocument.numPages;
  const extractedPages: ExtractedPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    
    // Simple logic to reconstruct lines based on vertical position
    // We group items that are roughly on the same Y coordinate
    const lineMap = new Map<number, string[]>();
    
    textContent.items.forEach((item: any) => {
      // transform[5] is the y-coordinate in the PDF coordinate system
      // We round it to group slightly misaligned text on the same line
      const y = Math.round(item.transform[5]); 
      if (!lineMap.has(y)) {
        lineMap.set(y, []);
      }
      lineMap.get(y)?.push(item.str);
    });

    // Sort lines by Y coordinate (PDF Y is usually bottom-up, so we reverse for top-down)
    const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);
    
    const lines = sortedY.map(y => {
      // Join text items in the line
      return lineMap.get(y)?.join(' ') || '';
    });

    extractedPages.push({
      pageNumber: i,
      lines: lines
    });

    onProgress(Math.round((i / numPages) * 100));
  }

  return extractedPages;
};

/**
 * Generates a DOCX file from extracted text lines and triggers a download.
 */
export const generateAndDownloadDocx = async (
  pages: ExtractedPage[], 
  originalFileName: string
): Promise<void> => {
  const docChildren: Paragraph[] = [];

  pages.forEach((page, index) => {
    // Add a page break for subsequent pages
    if (index > 0) {
        docChildren.push(new Paragraph({
            children: [],
            pageBreakBefore: true
        }));
    }

    page.lines.forEach(line => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              font: "Calibri",
              size: 24, // 12pt
            }),
          ],
          spacing: {
            after: 200, // Standard paragraph spacing
          }
        })
      );
    });
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: docChildren,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const newFileName = originalFileName.replace(/\.pdf$/i, '') + '.docx';
  saveAs(blob, newFileName);
};