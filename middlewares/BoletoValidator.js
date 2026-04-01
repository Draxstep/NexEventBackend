export const validarGeneracionBoletos = (req, res, next) => {
    const { compra_id, detallesCompra } = req.body;

    const compraId = Number(compra_id);
    if (!Number.isInteger(compraId) || compraId <= 0) {
        return res.status(400).json({
            error: "Datos inválidos.",
            details: "El campo 'compra_id' debe ser un entero positivo."
        });
    }

    if (!Array.isArray(detallesCompra) || detallesCompra.length === 0) {
        return res.status(400).json({
            error: "Datos inválidos.",
            details: "El campo 'detallesCompra' debe ser un arreglo con al menos un elemento."
        });
    }

    for (const item of detallesCompra) {
        const eventoTipoId = Number(item?.evento_tipo_id);
        const cantidad = Number(item?.cantidad);

        if (!Number.isInteger(eventoTipoId) || eventoTipoId <= 0) {
            return res.status(400).json({
                error: "Datos inválidos.",
                details: "Cada item debe tener 'evento_tipo_id' como entero positivo."
            });
        }

        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            return res.status(400).json({
                error: "Datos inválidos.",
                details: "Cada item debe tener 'cantidad' como entero positivo."
            });
        }
    }

    req.body.compra_id = compraId;
    next();
};

export const validarCodigoQrBoleto = (req, res, next) => {
    const { codigo_qr_individual } = req.body;

    if (!codigo_qr_individual || typeof codigo_qr_individual !== 'string' || codigo_qr_individual.trim().length === 0) {
        return res.status(400).json({
            error: "Datos inválidos.",
            details: "El campo 'codigo_qr_individual' es obligatorio y debe ser texto válido."
        });
    }

    req.body.codigo_qr_individual = codigo_qr_individual.trim();
    next();
};

export const validarBoletoIdParam = (req, res, next) => {
    const { boleto_id } = req.params;
    const boletoId = Number(boleto_id);

    if (!Number.isInteger(boletoId) || boletoId <= 0) {
        return res.status(400).json({
            error: "Parámetro inválido.",
            details: "'boleto_id' debe ser un entero positivo."
        });
    }

    req.params.boleto_id = boletoId;
    next();
};