export const validarCreacionTipoEntrada = (req, res, next) => {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        return res.status(400).json({
            error: "Datos inválidos",
            details: "El campo 'nombre' es obligatorio y debe ser un texto válido."
        });
    }

    req.body.nombre = nombre.trim();

    next();
};