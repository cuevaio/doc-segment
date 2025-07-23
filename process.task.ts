import { Mistral } from "@mistralai/mistralai";
import { pdfToImages } from "./pdf-to-image";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { UTApi } from "uploadthing/server";

export const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const pdfUrl =
	"https://cyh5bzuz7l.ufs.sh/f/KcwiXh6460fnaQYturASrw5TGndP7uBiWAHbcR2gENOJmf9t";

const resp = await mistral.ocr.process({
	model: "mistral-ocr-latest",
	document: {
		type: "document_url",
		documentUrl: pdfUrl,
	},
	includeImageBase64: false,
});
console.log("Mistral OCR done");

const images = await pdfToImages(pdfUrl);

if (!images.success || !images.files || images.files.length === 0) {
	console.error(images.error);
	process.exit(1);
}

const mdImgMap: { pageIndex: number; imageUrl: string; md: string }[] = [];

for (const page of resp.pages) {
	const imageUrl = images.files.find(
		(image) => image.pageIndex === page.index,
	)?.url;

	if (imageUrl && page.markdown) {
		mdImgMap.push({
			pageIndex: page.index,
			imageUrl: imageUrl,
			md: page.markdown,
		});
	}
}

console.log("Images done");

const systemPrompt = await Bun.file("create-html-prompt.md").text();

const result = streamText({
	model: openai("gpt-4.1"),
	maxTokens: 32000,
	messages: [
		{
			role: "system",
			content: systemPrompt,
		},
		{
			role: "user",
			content: [
				{
					type: "text",
					text: "Here is the markdown content for the first page:",
				},
				{
					type: "image",
					image: mdImgMap[0]?.imageUrl || "",
				},
				{
					type: "text",
					text: "Here is the markdown content for the second page:",
				},
				{
					type: "image",
					image: mdImgMap[1]?.imageUrl || "",
				},
			],
		},
		{
			role: "user",
			content: mdImgMap.flatMap((item) => [
				{
					type: "text",
					text: item.md,
				},
				{
					type: "image",
					image: item.imageUrl,
				},
			]),
		},
	],
});

console.log(result.usage);
console.log(JSON.stringify(result.response, null, 2));

const date = Date.now();

const fileName = `output-${date}.html`;

const writer = Bun.file(fileName).writer();

for await (const chunk of result.textStream) {
	process.stdout.write(chunk);
	writer.write(chunk);
}

await writer.end();
console.log(result.finishReason);

console.log("Done creating html");
const utapi = new UTApi();

// biome-ignore lint/style/noNonNullAssertion: file.url is not null
await utapi.deleteFiles(images.files.map((file) => file.url.split("/").pop()!));

console.log("Deleted images");

// segment

const enrichedHtml = await Bun.file(fileName).text();

const segmentSystemPrompt = await Bun.file("segment-html-prompt.md").text();

const segmentResult = streamText({
	model: anthropic("claude-4-sonnet-20250514"),
	messages: [
		{
			role: "system",
			content: segmentSystemPrompt,
		},
		{
			role: "user",
			content: enrichedHtml,
		},
	],
	maxTokens: 64000,
});

const file = Bun.file(`segment-${date}.html`).writer();

for await (const chunk of segmentResult.textStream) {
	file.write(chunk);
	process.stdout.write(chunk);
}

await file.end();
