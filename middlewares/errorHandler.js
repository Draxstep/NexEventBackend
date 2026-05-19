import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.error("request.error", {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        method: req.method,
        path: req.originalUrl
    });
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : "Error interno del servidor";

    res.status(statusCode).json({ error: message });
};