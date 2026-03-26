import { tool } from "@langchain/core/tools";
import { evaluate } from "mathjs";
import { z } from "zod";

export const calculatorTool = tool(
  async ({ expression }) => {
    try {
      const result = evaluate(expression);
      return String(result);
    } catch (e) {
      return `Error: ${(e as Error).message}`;
    }
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
