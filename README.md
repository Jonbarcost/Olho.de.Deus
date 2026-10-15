# Olho.de.Deus AI Orchestrator

Este repositório está preparado para integrar OpenAI GPT e Anthropic Claude em um ambiente automatizado de colaboração.

## Estrutura

- `src/server.js` — servidor Express
- `src/services/aiOrchestrator.js` — orquestrador de IA
- `.env.example` — variáveis de ambiente
- `README.md` — documentação

## Requisitos

- Node.js 18+
- npm
- Chaves da OpenAI e Anthropic

## Instalação

```bash
npm install
cp .env.example .env
```

Edite o arquivo `.env` com suas chaves.

## Executar

```bash
npm start
```

## Endpoint de teste

```bash
curl -X POST http://localhost:3000/api/ai/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Explique o que é um orquestrador de IA e como GPT e Claude podem se complementar."}'
```

## Como funciona

1. GPT gera uma resposta inicial.
2. Claude revisa e melhora a resposta.
3. O orquestrador compara as saídas e escolhe a melhor versão.
4. A API retorna `draft`, `review` e `final`.

## Variáveis de ambiente

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `PORT` (opcional, padrão 3000)

## Observações

- Nunca commite sua `.env` real.
- Configure `timeout` e `retry` para produção.
- Use logs de custo e latência em ambiente de produção.
