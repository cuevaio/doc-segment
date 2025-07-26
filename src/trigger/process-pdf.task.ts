import { schemaTask, batch, logger } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import type { getScreenshotsTask } from "./get-screenshots.task";
import { generateHtmlTask } from "./generate-html.task";
import type { getMarkdownTask } from "./get-markdown.task";

export const processPdfTask = schemaTask({
  id: "process-pdf",
  schema: z.object({
    url: z.string(),
  }),
  run: async (payload) => {
    const { url } = payload;

    const results = await batch.triggerAndWait<
      typeof getScreenshotsTask | typeof getMarkdownTask
    >([
      { id: "get-screenshots", payload: { url } },
      { id: "get-markdown", payload: { url } },
    ]);

    let screenshots: {
      pageIndex: number;
      url: string;
    }[] = [];
    let markdown: {
      pageIndex: number;
      markdown: string;
    }[] = [];

    for (const result of results.runs) {
      if (result.ok) {
        if (result.taskIdentifier === "get-screenshots") {
          screenshots = result.output;
        } else if (result.taskIdentifier === "get-markdown") {
          markdown = result.output;
        }
      }
    }
    logger.log(JSON.stringify(screenshots, null, 2));
    logger.log(JSON.stringify(markdown, null, 2));

    const html = await generateHtmlTask.triggerAndWait({
      id: url,
      pages: screenshots.map((screenshot) => ({
        pageIndex: screenshot.pageIndex,
        imageUrl: screenshot.url,
        markdown:
          markdown.find((m) => m.pageIndex === screenshot.pageIndex)
            ?.markdown || "",
      })),
    });

    return html;
  },
});
