export const errorHandler = (err, req, res, _next) => {
    console.error(err.stack); 
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : "Error interno del servidor";

    res.status(statusCode).json({ error: message });
};