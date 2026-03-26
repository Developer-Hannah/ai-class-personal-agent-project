import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initVectorStore } from "./vectorStore.js";
import { createAgent } from "./agent.js";
import { initMemory } from "./memory.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(join(__dirname, "../public")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  const vectorStore = await initVectorStore();
  const agent = createAgent(vectorStore);
  initMemory(agent);
  console.log("Agent ready.");
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
