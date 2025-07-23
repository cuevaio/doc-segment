import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(require('node:child_process').execFile);

export async function generatePdfScreenshots(pdfPath: string, outputDir: string = 'screenshots'): Promise<string[]> {
  try {
    // Ensure the output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Check if PDF file exists
    if (!existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }

    console.log(`Converting PDF: ${pdfPath}`);
    console.log(`Output directory: ${outputDir}`);

    const screenshotPaths: string[] = [];
    let pageNum = 1;
    let hasMorePages = true;

    // Convert pages one by one until we run out of pages
    while (hasMorePages && pageNum <= 100) { // Safety limit of 100 pages
      const outputFilename = `page-${pageNum}.png`;
      const outputPath = path.join(outputDir, outputFilename);
      
      const gsArgs = [
        '-dNOPAUSE',
        '-dBATCH',
        '-dSAFER',
        '-sDEVICE=png16m',
        '-r150', // 150 DPI for good quality
        '-dTextAlphaBits=4',
        '-dGraphicsAlphaBits=4',
        `-dFirstPage=${pageNum}`,
        `-dLastPage=${pageNum}`,
        `-sOutputFile=${outputPath}`,
        pdfPath
      ];

      try {
        console.log(`Converting page ${pageNum}...`);
        await execFile('gs', gsArgs);
        
        // Check if the file was actually created
        if (existsSync(outputPath)) {
          screenshotPaths.push(outputPath);
          console.log(`Generated page ${pageNum}: ${outputFilename}`);
          pageNum++;
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        // If Ghostscript fails, it likely means we've reached the end of the document
        console.log(`Reached end of document at page ${pageNum}`);
        hasMorePages = false;
      }
    }

    console.log(`Successfully converted ${screenshotPaths.length} pages`);
    return screenshotPaths;
  } catch (error) {
    console.error('Error generating PDF screenshots:', error);
    throw error;
  }
}

// Function to run the screenshot generation
export async function main() {
  const pdfPath = './Oferta_BBVA.pdf';
  const outputDir = './screenshots';
  
  try {
    const screenshots = await generatePdfScreenshots(pdfPath, outputDir);
    console.log('Generated screenshots:');
    screenshots.forEach((path, index) => {
      console.log(`  Page ${index + 1}: ${path}`);
    });
  } catch (error) {
    console.error('Failed to generate screenshots:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.main) {
  main();
}
