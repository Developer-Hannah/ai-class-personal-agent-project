import { tool } from "@langchain/core/tools";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { z } from "zod";
import { logToolCall } from "../logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOADS_DIR = resolve(join(__dirname, "../../uploads"));

export const fileReaderTool = tool(
  async ({ filename }) => {
    const requestedPath = resolve(join(UPLOADS_DIR, filename));

    if (!requestedPath.startsWith(UPLOADS_DIR)) {
      const result = `Error: Access denied. Files must be inside the uploads/ folder.`;
      logToolCall("file_reader", { filename }, result);
      return result;
    }

    let result: string;
    try {
      result = await readFile(requestedPath, "utf-8");
    } catch (e) {
      result = `Error reading file: ${(e as Error).message}`;
    }

    logToolCall("file_reader", { filename }, result);
    return result;
  },
  {
    name: "file_reader",
    description:
      "Reads a text file from the uploads/ folder and returns its contents. " +
      "Use this when the user wants you to analyze a document they have placed " +
      "in the uploads folder — such as a job description, resume draft, offer letter, " +
      "or any other career-related text file. " +
      "Input must be a plain filename (e.g. 'job-description.txt'), not a path.",
    schema: z.object({
      filename: z
        .string()
        .describe(
          "The name of the file to read from the uploads/ folder, e.g. 'job-description.txt'"
        ),
    }),
  }
);
