import React, { useState, useCallback } from 'react';
import { FileText } from 'lucide-react';
import { DropZone } from './components/DropZone';
import { StatusCard } from './components/StatusCard';
import { extractTextFromPDF, generateAndDownloadDocx } from './services/conversionService';
import { AppStatus, ConversionState } from './types';

export default function App() {
  const [state, setState] = useState<ConversionState>({
    status: AppStatus.IDLE,
    progress: 0,
    fileName: null,
    errorMessage: null,
  });

  const handleFileSelect = useCallback(async (file: File) => {
    setState({
      status: AppStatus.PROCESSING,
      progress: 0,
      fileName: file.name,
      errorMessage: null,
    });

    try {
      // Step 1: Extract text from PDF
      // We pass a progress callback to update the UI
      const pages = await extractTextFromPDF(file, (progress) => {
        setState(prev => ({ ...prev, progress: Math.min(progress, 90) }));
      });

      // Step 2: Generate Docx
      setState(prev => ({ ...prev, progress: 95 }));
      await generateAndDownloadDocx(pages, file.name);

      // Step 3: Success
      setState(prev => ({ ...prev, status: AppStatus.SUCCESS, progress: 100 }));
      
    } catch (error: any) {
      console.error('Conversion Failed:', error);
      let msg = "Failed to parse the PDF file.";
      
      if (error.name === 'PasswordException') {
        msg = "This PDF is password protected. Please unlock it first.";
      } else if (error.message) {
        msg = error.message;
      }

      setState(prev => ({
        ...prev,
        status: AppStatus.ERROR,
        errorMessage: msg,
      }));
    }
  }, []);

  const handleReset = useCallback(() => {
    setState({
      status: AppStatus.IDLE,
      progress: 0,
      fileName: null,
      errorMessage: null,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              PDF to Word
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Client-side Secure Conversion
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-3xl space-y-12">
          
          {/* Hero Text */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Convert PDF to Editable Word
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Drag and drop your PDF file to instantly convert it to a DOCX document. 
              All processing happens in your browser—your files never leave your device.
            </p>
          </div>

          {/* Interactive Area */}
          <div className="space-y-8">
            {state.status === AppStatus.IDLE && (
              <DropZone onFileSelect={handleFileSelect} />
            )}
            
            {state.status !== AppStatus.IDLE && (
              <StatusCard 
                {...state} 
                onReset={handleReset} 
              />
            )}
          </div>
          
          {/* Features/Footer Note */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-200">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-slate-900">100% Private</h3>
              <p className="text-sm text-slate-500">No server uploads. Files processed locally.</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-slate-900">Fast Extraction</h3>
              <p className="text-sm text-slate-500">Uses PDF.js for rapid text parsing.</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-slate-900">Formatted Output</h3>
              <p className="text-sm text-slate-500">Generates clean .docx files using modern libraries.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}