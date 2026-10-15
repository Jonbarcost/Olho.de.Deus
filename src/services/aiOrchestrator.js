const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function sanitizeText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreAnswer(text) {
  const normalized = sanitizeText(text).toLowerCase();

  if (!normalized) return 0;

  let score = normalized.length / 10;

  if (normalized.includes("não sei") || normalized.includes("i don't know")) {
    score -= 30;
  }

  if (normalized.includes("fatos") || normalized.includes("estudo") || normalized.includes("estratégia")) {
    score += 10;
  }

  return score;
}

async function callOpenAI(prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  return sanitizeText(completion.choices?.[0]?.message?.content || "");
}

async function callClaude(prompt) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  return sanitizeText(text);
}

async function orchestratePrompt(prompt) {
  const draft = await callOpenAI(prompt);

  const review = await callClaude(
    `Você é um revisor crítico de respostas. Melhore clareza, precisão e completude sem inventar fatos.\n\nResposta original:\n${draft}`
  );

  const final = scoreAnswer(review) >= scoreAnswer(draft) ? review : draft;

  return {
    draft,
    review,
    final,
    metadata: {
      models: ["gpt-4o-mini", "claude-3-5-sonnet-20241022"],
      strategy: "gpt_generates_then_claude_revises",
    },
  };
}

module.exports = { orchestratePrompt };
