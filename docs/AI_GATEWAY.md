# AI Gateway Package (`packages/ai-gateway`)

The AI Gateway provides a unified, resilient abstraction layer over multiple LLM providers:

## Supported Providers
- **OpenAI**: `gpt-4o`, `gpt-4o-mini`
- **Google Gemini**: `gemini-1.5-pro`, `gemini-1.5-flash`
- **Anthropic**: `claude-3-5-sonnet`
- **OpenRouter**: `openrouter/auto`
- **NVIDIA NIM**: `nvidia/llama-3.1-405b`
- **Ollama**: Local models (`ollama/llama3`)

## Features
1. **Automatic Model Routing**: Selects optimal model based on request priority, cost budget, latency requirements, and context length.
2. **Provider Failover Cascade**: Automatically falls back through secondary providers when HTTP 429 / 5xx errors occur.
3. **Token & Cost Calculation**: Calculates prompt tokens, completion tokens, and real-time USD cost for every request.
4. **Prompt Versioning & Auto-Promotion**: Tracks prompt performance metrics and auto-promotes high-converting prompt versions.
5. **Streaming**: Server-Sent Events (SSE) and AsyncIterable streams for real-time text generation in UI.
