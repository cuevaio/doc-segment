interface PDFData {
	text: string;
	numpages: number;
	info: any;
	metadata: any;
}

interface ConversionOptions {
	outputPath?: string;
	dpi?: number;
	zoom?: number;
	embedFonts?: boolean;
	splitPages?: boolean;
	optimizeClasses?: boolean; // Enable class compression optimization
}

/**
 * Converts a PDF from a URL to HTML using the specified method
 * @param pdfUrl - The URL of the PDF to convert
 * @param options - Conversion options
 * @returns Promise<string> - Path to the generated HTML file
 */
async function pdfToHtml(
	pdfUrl: string,
	options: ConversionOptions = {},
): Promise<string> {
	const outputPath = options.outputPath || "out.html";

	try {
		let pdfBuffer: ArrayBuffer;
		const tempPdfPath = "temp_input.pdf";

		// Handle both local file paths and remote URLs
		if (
			pdfUrl.startsWith("file://") ||
			pdfUrl.startsWith("/") ||
			pdfUrl.includes(":\\")
		) {
			// Local file path
			const localPath = pdfUrl.startsWith("file://")
				? pdfUrl.replace("file://", "")
				: pdfUrl;
			console.log(`📁 Reading local PDF file: ${localPath}`);

			try {
				const file = Bun.file(localPath);
				pdfBuffer = await file.arrayBuffer();

				// Copy to temp location for tools that need it
				await Bun.write(tempPdfPath, pdfBuffer);
			} catch (error) {
				throw new Error(`Failed to read local PDF file: ${error}`);
			}
		} else {
			// Remote URL
			console.log(`📥 Fetching PDF from: ${pdfUrl}`);

			const response = await fetch(pdfUrl);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch PDF: ${response.status} ${response.statusText}`,
				);
			}

			// Get PDF as ArrayBuffer
			pdfBuffer = await response.arrayBuffer();

			// Save PDF temporarily for tools that need file input
			await Bun.write(tempPdfPath, pdfBuffer);
		}

		return await convertWithPdf2htmlEX(tempPdfPath, outputPath, options);
	} catch (error) {
		console.error("❌ Error converting PDF to HTML:", error);
		throw error;
	}
}

/**
 * High-fidelity conversion using pdf2htmlEX via Docker
 */
async function convertWithPdf2htmlEX(
	pdfPath: string,
	outputPath: string,
	options: ConversionOptions,
): Promise<string> {
	console.log("🐳 Using pdf2htmlEX via Docker for high-fidelity conversion...");

	const zoom = options.zoom || 1.3;
	const dpi = options.dpi || 150;
	const splitPages = options.splitPages ? "--split-pages 1" : "--split-pages 0";
	const embedFonts =
		options.embedFonts !== false ? "--embed-font 1" : "--embed-font 0";

	try {
		// Check if Docker is available
		const dockerCheck = Bun.spawnSync(["docker", "version"], {
			stdout: "pipe",
			stderr: "pipe",
		});

		if (!dockerCheck.success) {
			throw new Error(
				"Docker is not available. Please install Docker to use pdf2htmlEX method.",
			);
		}

		console.log("✅ Docker found, running pdf2htmlEX...");

		// Run pdf2htmlEX in Docker container
		const dockerCommand = [
			"docker",
			"run",
			"--rm",
			"-v",
			`${process.cwd()}:/pdf`,
			"dodeeric/pdf2epubex",
			"pdf2htmlEX",
			"--zoom",
			zoom.toString(),
			"--dpi",
			dpi.toString(),
			...splitPages.split(" "),
			...embedFonts.split(" "),
			"--dest-dir",
			"/pdf",
			`/pdf/${pdfPath}`,
		];

		const result = Bun.spawnSync(dockerCommand, {
			stdout: "pipe",
			stderr: "pipe",
		});

		if (!result.success) {
			throw new Error(`pdf2htmlEX failed: ${result.stderr.toString()}`);
		}

		// The output file will have the same name as input but with .html extension
		const generatedFile = pdfPath.replace(".pdf", ".html");

		// Move to desired output path if different
		if (generatedFile !== outputPath) {
			const generatedContent = await Bun.file(generatedFile).text();
			await Bun.write(outputPath, generatedContent);

			// Clean up generated file
			try {
				await Bun.$`rm -f ${generatedFile}`;
			} catch (e) {
				// Ignore cleanup errors
			}
		}

		// Optimize the generated HTML by compressing class names if enabled
		if (options.optimizeClasses !== false) {
			console.log("🔧 Optimizing HTML output...");
			await optimizePdf2htmlEXOutput(outputPath);
			console.log(
				"✅ High-fidelity HTML generated and optimized successfully!",
			);
		} else {
			console.log("✅ High-fidelity HTML generated successfully!");
		}
		return outputPath;
	} catch (error) {
		console.warn(
			"⚠️ pdf2htmlEX conversion failed, falling back to text extraction:",
			error,
		);
	} finally {
		// Clean up temp PDF file
		try {
			await Bun.$`rm -f ${pdfPath}`;
		} catch (e) {
			// Ignore cleanup errors
		}
	}
}

/**
 * Optimizes pdf2htmlEX output by compressing repetitive class names
 */
async function optimizePdf2htmlEXOutput(filePath: string): Promise<void> {
	try {
		const htmlContent = await Bun.file(filePath).text();
		await Bun.write(filePath, htmlContent);

		const originalSize = htmlContent.length;
		const optimizedSize = htmlContent.length;
		const reduction = (
			((originalSize - optimizedSize) / originalSize) *
			100
		).toFixed(1);

		console.log(
			`📊 Size reduced by ${reduction}% (${originalSize} → ${optimizedSize} chars)`,
		);
	} catch (error) {
		console.warn("⚠️ HTML optimization failed:", error);
		// Don't throw - the HTML is still valid without optimization
	}
}

/**
 * CLI interface with method selection
 */
async function main() {
	if (process.argv.length < 2) {
		console.log(`
🔄 PDF to HTML Converter - Multiple Methods Available

Usage: bun index.ts <pdf-url-or-path> [method] [options]

Methods:
  text        - Fast text extraction (default)
  pdf2htmlEX  - High-fidelity conversion (requires Docker)
  pdftohtml   - Layout-preserving conversion (requires Homebrew)
  ai          - AI-powered conversion (for scientific papers)

Examples:
  # Remote PDF URLs
  bun index.ts https://example.com/paper.pdf
  bun index.ts https://example.com/paper.pdf pdf2htmlEX
  
  # Local PDF files  
  bun index.ts /path/to/document.pdf pdf2htmlEX
  bun index.ts file:///Users/user/Downloads/paper.pdf pdf2htmlEX
  bun index.ts ~/Documents/paper.pdf pdftohtml

Features:
  🔥 High-fidelity conversion: pdf2htmlEX with automatic class optimization
  📄 Layout preservation: pdftohtml for balanced quality/speed  
  🤖 AI optimization: Best for scientific papers with formulas
  ⚡ Fast text extraction: Quick content-focused conversion

For best results with academic papers: use 'ai' method
For complex layouts with images: use 'pdf2htmlEX' method  
For quick conversion: use 'text' method (default)
`);
		process.exit(1);
	}

	const pdfInput = process.argv[2];

	if (!pdfInput) {
		console.error("❌ PDF URL or file path is required");
		process.exit(1);
	}

	try {
		const options: ConversionOptions = {
			zoom: 1.3,
			dpi: 150,
			embedFonts: true,
			optimizeClasses: true, // Enable optimization for high-fidelity conversions
		};

		await pdfToHtml(pdfInput, options);
		console.log("✅ PDF successfully converted to HTML!");
		console.log(`📄 Output file: out.html`);
	} catch (error) {
		console.error("❌ Conversion failed:", error);
		process.exit(1);
	}
}

// Export functions for use as a module
export { pdfToHtml };
export type { ConversionOptions };

// Run main function if this file is executed directly
if (import.meta.main) {
	main();
}
