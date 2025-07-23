import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

const enrichedHtml = await Bun.file("enriched.html").text();
const systemPrompt = await Bun.file("segment-html-prompt.md").text();

const result = streamText({
	model: anthropic("claude-4-sonnet-20250514"),
	messages: [
		{
			role: "system",
			content: systemPrompt,
		},
		{
			role: "user",
			content: enrichedHtml,
		},
	],
	maxTokens: 64000,
});

const file = Bun.file("segment.html").writer();

for await (const chunk of result.textStream) {
	file.write(chunk);
	process.stdout.write(chunk);
}

await file.end();
