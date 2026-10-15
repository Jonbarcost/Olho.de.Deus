require("dotenv").config();

const express = require("express");
const { orchestratePrompt } = require("./services/aiOrchestrator");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ai-orchestrator" });
});

app.post("/api/ai/orchestrate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !String(prompt).trim()) {
    return res.status(400).json({ error: "O campo 'prompt' é obrigatório." });
  }

  try {
    const result = await orchestratePrompt(prompt);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao orquestrar IA:", error);
    return res.status(500).json({
      error: "Falha ao processar o prompt.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI orchestrator running on http://localhost:${PORT}`);
});
