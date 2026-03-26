import { tool } from "@langchain/core/tools";
import { evaluate } from "mathjs";
import { z } from "zod";
import { logToolCall } from "../logger.js";

export const calculatorTool = tool(
  async ({ expression }) => {
    let result: string;
    try {
      result = String(evaluate(expression));
    } catch (e) {
      result = `Error: ${(e as Error).message}`;
    }
    logToolCall("calculator", { expression }, result);
    return result;
  },
  {
    name: "calculator",
    description:
      "Evaluates mathematical expressions safely. Use this for any arithmetic, " +
      "salary calculations, monthly budget math, cost comparisons, percentage " +
      "calculations, tax estimates, or any other numerical computation. " +
      "Do NOT use web search for simple math — always prefer this tool. " +
      "Input must be a valid math expression string.",
    schema: z.object({
      expression: z
        .string()
        .describe(
          "A mathematical expression to evaluate, e.g. '85000 * 0.72' or '(120000 + 15000) / 12'"
        ),
    }),
  }
);
