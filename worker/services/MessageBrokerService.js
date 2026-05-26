import amqplib from "amqplib";
import logger from "../utils/logger.js";

class MessageBrokerService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.url = process.env.BROKER_URL
      ?? process.env.RABBITMQ_URL
      ?? "amqp://nexevent:nexevent@localhost:5672";
    this.prefetch = Number(process.env.BROKER_PREFETCH ?? 10);
  }

  async getChannel() {
    if (this.channel) {
      return this.channel;
    }

    if (!this.connection) {
      this.connection = await amqplib.connect(this.url);
      this.connection.on("error", (error) => {
        logger.error("worker.broker.connection.error", { message: error.message });
      });
      this.connection.on("close", () => {
        logger.warn("worker.broker.connection.closed");
        this.connection = null;
        this.channel = null;
      });
    }

    this.channel = await this.connection.createChannel();
    await this.channel.prefetch(this.prefetch);
    return this.channel;
  }

  async publishEvent(queue, payload) {
    const channel = await this.getChannel();
    await channel.assertQueue(queue, { durable: true });

    const message = Buffer.from(JSON.stringify(payload));
    channel.sendToQueue(queue, message, { persistent: true });
    logger.info("worker.broker.publish", { queue });
  }

  async consumeEvent(queue, callback) {
    const channel = await this.getChannel();
    await channel.assertQueue(queue, { durable: true });

    await channel.consume(queue, async (message) => {
      if (!message) {
        return;
      }

      try {
        const payload = JSON.parse(message.content.toString());
        await callback(payload);
        channel.ack(message);
      } catch (error) {
        logger.error("worker.broker.consume.error", {
          queue,
          message: error.message
        });
        channel.nack(message, false, false);
      }
    });

    logger.info("worker.broker.consume.start", { queue });
  }
}

export default new MessageBrokerService();
