# PDF 转 Word 转换器

一个安全、现代的纯前端 Web 应用，可在浏览器中直接将 PDF 文档转换为可编辑的 Word (`.docx`) 文件。

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ 主要功能

*   **🔒 100% 隐私保护**: 所有处理均在本地浏览器中完成。您的文件**绝不会**上传到任何服务器。
*   **⚡ 前端高性能**: 利用 Web Workers (通过 PDF.js) 高效解析文档，不会阻塞用户界面。
*   **🖱️ 拖拽上传**: 直观的界面，支持轻松拖拽上传文件。
*   **📄 格式化提取**: 智能文本提取，尝试重建 Word 文档的行和段落。
*   **🎨 现代 UI**: 使用 Tailwind CSS 构建的整洁、响应式设计。

## 🛠️ 技术栈

该项目使用现代 Web 标准构建，得益于 ES Modules，**无需构建步骤** (如 webpack/vite 等) 即可直接运行。

*   **核心库**: React 19
*   **样式**: Tailwind CSS (通过 CDN)
*   **PDF 引擎**: [PDF.js](https://mozilla.github.io/pdf.js/) (Mozilla)
*   **Word 生成**: [docx.js](https://docx.js.org/)
*   **图标**: Lucide React
*   **模块管理**: 通过 [esm.sh](https://esm.sh) 分发的 ESM

## 🚀 如何运行

由于本项目直接使用 ES Modules，受浏览器关于 `file://` 协议的安全策略 (CORS) 限制，您**不能**简单地双击 `index.html` 文件打开。必须通过本地 HTTP 服务器运行。

### 方法 1: VS Code (推荐)
1. 安装 **Live Server** 扩展插件。
2. 右键点击 `index.html`。
3. 选择 **"Open with Live Server"**。

### 方法 2: Node.js
如果您已安装 Node.js：
```bash
npx serve .
```

### 方法 3: Python
如果您已安装 Python：
```bash
# Python 3
python -m http.server 8000
```
然后在浏览器中打开 `http://localhost:8000`。

## ⚠️ 局限性

*   **仅限文本型 PDF**: 此工具最适合原生数字 PDF。不支持扫描件 PDF (图片)，因为本项目不包含 OCR (光学字符识别) 引擎。
*   **排版布局**: 复杂的布局（如多栏、复杂表格）在提取过程中会被线性化，以确保内容的可编辑性，因此视觉还原度可能与原 PDF 有所差异。

## 📂 项目结构

*   `index.html`: 入口文件及 Import Maps 配置。
*   `App.tsx`: 主应用组件。
*   `services/conversionService.ts`: 解析 PDF 和生成 DOCX 的核心逻辑。
*   `components/`: UI 组件 (DropZone, StatusCard)。
*   `types.ts`: TypeScript 接口定义和状态定义。

---

*注：本项目依赖外部 CDN (esm.sh, unpkg, cdnjs)。运行通过时请确保您的网络环境可以访问这些服务。*