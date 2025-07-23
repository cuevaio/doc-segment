import { pdf } from "pdf-to-img";
import { UTApi, UTFile } from "uploadthing/server";

const utapi = new UTApi();

/**
 * Downloads a PDF from a URL and converts it to images, then uploads to UploadThing
 * @param url The URL of the PDF to download
 * @param scale The scale factor for image quality (defaults to 3)
 */
export async function pdfToImages(url: string, scale: number = 3) {
	try {
		console.log(`Downloading PDF from: ${url}`);

		// Download the PDF
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Failed to download PDF: ${response.status} ${response.statusText}`,
			);
		}

		const pdfBuffer = await response.arrayBuffer();
		const pdfData = new Uint8Array(pdfBuffer);

		console.log("Converting PDF to images...");

		// Convert PDF to images
		const document = await pdf(pdfData, { scale });

		let counter = 1;
		const filesToUpload: UTFile[] = [];

		// Prepare all images for upload
		for await (const image of document) {
			const filename = `page-${counter}.png`;
			const customId = `page-${counter}-${Date.now()}`;

			const file = new UTFile([image], filename, { customId });
			filesToUpload.push(file);

			console.log(`Prepared: ${filename} for upload`);
			counter++;
		}

		console.log(`\nUploading ${filesToUpload.length} images to UploadThing...`);

		// Upload all files to UploadThing
		const uploadResponse = await utapi.uploadFiles(filesToUpload);

		const files: {
			pageIndex: number;
			url: string;
		}[] = [];

		for (const file of uploadResponse) {
			const pageIndex = file.data?.customId?.split("-")[1];
			const url = file.data?.ufsUrl;
			if (pageIndex && url) {
				files.push({
					pageIndex: parseInt(pageIndex),
					url: url,
				});
			}
		}

		return {
			success: true,
			files: files,
		};
	} catch (error) {
		console.error("Error converting PDF to images:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
