import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const unstyledHtml = await Bun.file("unstyled.html").text();
const systemPrompt = await Bun.file("enrich-html-prompt.md").text();

const result = await generateText({
	model: openai("gpt-4.1"),
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
					text: unstyledHtml,
				},
				{
					type: "image",
					image:
						"https://cyh5bzuz7l.ufs.sh/f/KcwiXh6460fnQYYTk8yeqUDkChSRT2l3PsWVvwxdiJj5yBgo",
				},
				{
					type: "image",
					image:
						"https://cyh5bzuz7l.ufs.sh/f/KcwiXh6460fnzcFdxADYtv8W0rd42igo9Xnb31CUYxPfZDhH",
				},
				{
					type: "image",
					image:
						"https://cyh5bzuz7l.ufs.sh/f/KcwiXh6460fnNxvHsRyrKg3Cvu8Lb5Bp4iM6qRtsaA7QoxT1",
				},
				{
					type: "image",
					image:
						"https://cyh5bzuz7l.ufs.sh/f/KcwiXh6460fnA0x9dJELnOjtq9cfxGm12kbohpvKwPe3Cd4s",
				},
			],
		},
	],
});

await Bun.write("enriched.html", result.text);

console.log(result.text);
