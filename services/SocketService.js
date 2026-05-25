import { Server } from "socket.io";
import logger from "../utils/logger.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000"
];

let ioInstance = null;

export const initSocket = (httpServer) => {
  if (ioInstance) {
    return ioInstance;
  }

  ioInstance = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true
    }
  });

  ioInstance.on("connection", (socket) => {
    logger.info("ws.client.connected", { id: socket.id });
    socket.on("disconnect", () => {
      logger.info("ws.client.disconnected", { id: socket.id });
    });
  });

  return ioInstance;
};

export const getSocket = () => {
  if (!ioInstance) {
    throw new Error("Socket.io no inicializado.");
  }

  return ioInstance;
};
