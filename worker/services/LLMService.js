import logger from "../utils/logger.js";

class LLMService {
  async generateResolution(eventData) {
    const apiKey = process.env.LLM_API_KEY;
    const baseUrl = process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1";
    const model = process.env.LLM_MODEL ?? "llama-3.1-8b-instant";

    if (!apiKey) {
      throw new Error("Falta LLM_API_KEY en el worker.");
    }

    const { type, errorCode, details } = eventData ?? {};

    let systemPrompt;
    let userPrompt;

    if (type === "ERROR") {
      systemPrompt = "Eres un agente de retencion empatico, breve y persuasivo.";
      userPrompt = "Crea un mensaje simple para el usuario, sin mencionar temas tecnicos ni codigos. "
        + "Explica que no se pudo completar el pago y ofrece una alternativa clara para continuar. "
        + "Incluye el motivo. "
        + "Objetivo: que el usuario no abandone. Mantenerlo en 1 o 2 frases. "
        + `Contexto para inspirarte: ${JSON.stringify({ motivo: details?.motivo, errorCode })}`;
    } else if (type === "TIMEOUT") {
      systemPrompt = "Eres un agente de recuperacion de ventas, breve y directo.";
      userPrompt = "Crea un mensaje simple, sin tecnicismos. "
        + "DEBES incluir exactamente esta premisa: 'tu lugar esta reservado por 5 minutos mas, intenta con este enlace alternativo'. "
        + "Agrega una frase breve de apoyo para que el usuario continue.";
    } else if (type === "SUCCESS") {
      systemPrompt = "Eres un agente de confirmacion entusiasta, cercano y claro.";
      userPrompt = "Confirma que la compra fue exitosa y celebra al usuario. "
        + "Debe sonar como compra finalizada, no como invitacion a comprar. "
        + "Incluye una recomendacion breve para el ingreso o preparacion basada en el contexto del evento. "
        + "Mensaje corto (1 o 2 frases), sin listas ni tecnicismos. "
        + `Detalles del evento: ${JSON.stringify(details ?? {})}`;
    } else {
      throw new Error("Tipo de evento no soportado para el LLM.");
    }

    logger.info("worker.llm.request", {
      type,
      details,
      errorCode,
      systemPrompt,
      userPrompt
    });

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
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
