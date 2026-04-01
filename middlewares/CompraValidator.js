export const validarProcesarCompra = (req, res, next) => {
    const { usuario_id, evento_id, detallesCompra } = req.body;

    if (!usuario_id || typeof usuario_id !== 'string' || usuario_id.trim().length === 0) {
        return res.status(400).json({
            error: "Datos inválidos.",
            details: "El campo 'usuario_id' es obligatorio y debe ser texto válido."
        });
    }

    const eventoId = Number(evento_id);
    if (!Number.isInteger(eventoId) || eventoId <= 0) {
        return res.status(400).json({
            error: "Datos inválidos.",
            details: "El campo 'evento_id' debe ser un entero positivo."
        });
    }

    if (!Array.isArray(detallesCompra) || detallesCompra.length === 0) {
        return res.status(400).json({
            error: "Datos inválidos.",
            details: "El campo 'detallesCompra' debe ser un arreglo con al menos un elemento."
        });
    }

    for (const item of detallesCompra) {
        const tipoEntradaId = Number(item?.tipo_entrada_id);
        const cantidad = Number(item?.cantidad);

        if (!Number.isInteger(tipoEntradaId) || tipoEntradaId <= 0) {
            return res.status(400).json({
                error: "Datos inválidos.",
                details: "Cada item debe tener 'tipo_entrada_id' como entero positivo."
            });
        }

        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            return res.status(400).json({
                error: "Datos inválidos.",
                details: "Cada item debe tener 'cantidad' como entero positivo."
            });
        }
    }

    req.body.usuario_id = usuario_id.trim();
    req.body.evento_id = eventoId;
    next();
};

export const validarCompraIdParam = (req, res, next) => {
    const { compra_id } = req.params;
    const compraId = Number(compra_id);

    if (!Number.isInteger(compraId) || compraId <= 0) {
        return res.status(400).json({
            error: "Parámetro inválido.",
            details: "'compra_id' debe ser un entero positivo."
        });
    }

    req.params.compra_id = compraId;
    next();
};

export const validarUsuarioIdParam = (req, res, next) => {
    const { usuario_id } = req.params;

    if (!usuario_id || typeof usuario_id !== 'string' || usuario_id.trim().length === 0) {
        return res.status(400).json({
            error: "Parámetro inválido.",
            details: "'usuario_id' debe ser texto válido."
        });
    }

    req.params.usuario_id = usuario_id.trim();
    next();
};