import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/database.js"; 
import logger from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await sequelize.authenticate();
        logger.info("app.database.connected");

        app.listen(PORT, () => {
            logger.info("app.server.started", { port: PORT });
        });

    } catch (error) {
        logger.error("app.server.failed", { message: error.message, stack: error.stack });
        process.exit(1); 
    }
};

iniciarServidor();