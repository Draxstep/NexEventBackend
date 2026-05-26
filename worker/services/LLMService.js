import logger from "../utils/logger.js";

class LLMService {
  async generateResolution(eventData) {
    const apiKey = process.env.LLM_API_KEY;
    const baseUrl = process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1";
    const model = process.env.LLM_MODEL ?? "llama-3.1-8b-instant";

    if (!apiKey) {
      throw new Error("Falta LLM_API_KEY en el worker.");
    }

    const prompt = `Eres un asistente amable. Repite el evento recibido de forma clara. Evento: ${JSON.stringify(eventData)}`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Eres un asistente que responde en espanol." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      logger.error("worker.llm.error", { status: response.status, detail });
      throw new Error("Fallo al consultar el LLM.");
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Respuesta del LLM vacia.");
    }

    return content;
  }
}

export default new LLMService();
