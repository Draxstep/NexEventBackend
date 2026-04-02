export const validarEventoIdReporte = (req, res, next) => {
    const { evento_id } = req.params;
    const eventoId = Number(evento_id);

    if (!Number.isInteger(eventoId) || eventoId <= 0) {
        return res.status(400).json({
            error: "Parámetro inválido.",
            details: "'evento_id' debe ser un número entero positivo."
        });
    }

    req.params.evento_id = eventoId;
    next();
};