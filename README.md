# PDF to HTML Converter - Multi-Method Support

A powerful and flexible PDF to HTML converter built with Bun and TypeScript, offering multiple conversion methods for different use cases.

## 🚀 **NEW: Multiple Conversion Methods**

Choose the best method for your specific needs:

- **🔥 High-Fidelity (`pdf2htmlEX`)** - Perfect visual reproduction with fonts and layouts
- **📄 Layout-Preserving (`pdftohtml`)** - Good balance of quality and simplicity  
- **🤖 AI-Powered (`ai`)** - Optimized for scientific papers and academic documents
- **⚡ Text Extraction (`text`)** - Fast conversion focusing on content

## Features

- ✅ **Multiple conversion engines** for different quality needs
- ✅ **Docker integration** for pdf2htmlEX high-fidelity conversion
- ✅ **Homebrew integration** for pdftohtml installation
- ✅ **AI conversion guidance** for academic papers
- ✅ **Automatic fallbacks** if preferred method fails
- ✅ **Professional styling** with dark mode support
- ✅ **Font embedding** and layout preservation
- ✅ **Built with Bun** for maximum performance

## Installation

```bash
bun install
```

## Usage

### Command Line

#### Basic usage (text extraction):
```bash
bun index.ts <pdf-url>
```

#### High-fidelity conversion (requires Docker):
```bash
bun index.ts <pdf-url> pdf2htmlEX
```

#### Layout-preserving conversion (installs via Homebrew):
```bash
bun index.ts <pdf-url> pdftohtml
```

#### AI-powered conversion for scientific papers:
```bash
bun index.ts <pdf-url> ai
```

### Examples

```bash
# Quick text extraction
bun index.ts https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf

# High-fidelity conversion with visual accuracy
bun index.ts https://example.com/scientific-paper.pdf pdf2htmlEX

# Good balance for most documents
bun index.ts https://example.com/document.pdf pdftohtml

# AI optimization for academic papers
bun index.ts https://example.com/research-paper.pdf ai
```

### As a Module

```typescript
import { pdfToHtml, ConversionOptions } from './index.ts';

const options: ConversionOptions = {
  method: 'pdf2htmlEX',
  zoom: 1.5,
  dpi: 300,
  embedFonts: true
};

const outputPath = await pdfToHtml('https://example.com/document.pdf', options);
console.log(`Converted PDF saved to: ${outputPath}`);
```

## Conversion Methods Comparison

| Method | Quality | Speed | Requirements | Best For |
|--------|---------|-------|-------------|----------|
| **text** | ⭐⭐ | ⭐⭐⭐⭐⭐ | None | Quick content extraction |
| **pdftohtml** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Homebrew | General documents |
| **pdf2htmlEX** | ⭐⭐⭐⭐⭐ | ⭐⭐ | Docker | Complex layouts, visual accuracy |
| **ai** | ⭐⭐⭐⭐ | ⭐⭐⭐ | Manual process | Academic/scientific papers |

## Installation Requirements

### For High-Fidelity Conversion (pdf2htmlEX)
```bash
# Install Docker (one-time setup)
# Visit: https://docs.docker.com/get-docker/

# The converter will automatically pull the Docker image when needed
```

### For Layout-Preserving Conversion (pdftohtml)
```bash
# Homebrew will be used automatically to install pdftohtml
# Or install manually:
brew install pdftohtml
```

### For AI Conversion
No additional installation required - the tool provides guidance for using the Allen Institute's online service.

## Configuration Options

```typescript
interface ConversionOptions {
  method: 'text' | 'pdf2htmlEX' | 'pdftohtml' | 'ai';
  outputPath?: string;    // Default: "out.html"
  dpi?: number;          // Default: 150
  zoom?: number;         // Default: 1.3
  embedFonts?: boolean;  // Default: true
  splitPages?: boolean;  // Default: false
}
```

## Output Features

### High-Fidelity (pdf2htmlEX)
- **Pixel-perfect** reproduction of original PDF
- **Vector graphics** preserved as SVG
- **Font embedding** with web font conversion
- **Interactive elements** like links preserved
- **Single HTML file** output
- **Responsive design** for mobile viewing

### Enhanced Text Extraction
- **Responsive Design**: Mobile-friendly layout with maximum 800px width
- **Dark Mode Support**: Automatically adapts to system dark mode preference
- **Metadata Display**: Shows PDF title, author, page count, and conversion timestamp
- **Clean Typography**: Uses system fonts for optimal readability
- **Semantic Structure**: Proper HTML5 structure with header, main, and footer sections

## Examples & Demos

### Scientific Paper (Attention Is All You Need)
Perfect example of complex formatting with mathematical formulas, figures, and academic structure.

**Recommended method**: `ai` or `pdf2htmlEX`

### Magazine Layout
Documents with complex multi-column layouts, images, and varied formatting.

**Recommended method**: `pdf2htmlEX`

### Simple Documents
Text-heavy documents, reports, or simple papers.

**Recommended method**: `pdftohtml` or `text`

## Technical Details

This converter uses:
- **Bun's fetch API** for downloading PDFs from URLs
- **pdf2htmlEX via Docker** for high-fidelity conversion
- **pdftohtml via Homebrew** for layout-preserving conversion
- **pdf-parse library** for text extraction
- **Bun.write()** for efficient file output
- **TypeScript** for type safety and better development experience

The converter intelligently:
- **Auto-detects available tools** and installs missing dependencies
- **Provides automatic fallbacks** if preferred method fails
- **Splits text into paragraphs** based on double line breaks
- **Escapes HTML special characters** for security
- **Handles PDF metadata** gracefully
- **Provides comprehensive error handling**

## Browser Compatibility

The generated HTML works in all modern browsers and includes:
- CSS Grid and Flexbox for layout
- CSS custom properties (variables)
- Media queries for responsive design and dark mode
- Semantic HTML5 elements

## Troubleshooting

### Docker Issues
```bash
# Check if Docker is running
docker version

# Pull the pdf2htmlEX image manually
docker pull dodeeric/pdf2epubex
```

### Homebrew Issues
```bash
# Update Homebrew
brew update

# Install pdftohtml manually
brew install pdftohtml
```

### General Issues
The converter includes automatic fallbacks - if a preferred method fails, it will automatically fall back to text extraction to ensure you always get a result.

## License

MIT License - feel free to use this in your own projects!
