import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import sequelize from "./config/database.js"; 
import logger from "./utils/logger.js";
import { initSocket } from "./services/SocketService.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await sequelize.authenticate();
        logger.info("app.database.connected");

        const server = http.createServer(app);
        initSocket(server);

        server.listen(PORT, () => {
            logger.info("app.server.started", { port: PORT });
        });

    } catch (error) {
        logger.error("app.server.failed", { message: error.message, stack: error.stack });
        process.exit(1); 
    }
};

iniciarServidor();