import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import logger from "./utils/logger.js";
import messageBroker from "./services/MessageBrokerService.js";
import llmService from "./services/LLMService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const SOURCE_QUEUE = process.env.BROKER_SOURCE_QUEUE ?? "payment_events";
const RESULT_QUEUE = process.env.BROKER_RESULT_QUEUE ?? "ai_results";

const startWorker = async () => {
  await messageBroker.consumeEvent(SOURCE_QUEUE, async (eventData) => {
    logger.info("worker.event.received", { source: SOURCE_QUEUE });

    const resolution = await llmService.generateResolution(eventData);

    await messageBroker.publishEvent(RESULT_QUEUE, {
      event: eventData,
      resolution,
      generated_at: new Date().toISOString()
    });
  });
};

startWorker().catch((error) => {
  logger.error("worker.failed", { message: error.message });
  process.exit(1);
});
