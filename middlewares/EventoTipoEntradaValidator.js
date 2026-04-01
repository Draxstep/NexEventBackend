export const validarEventoIdParam = (req, res, next) => {
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

export const validarConfiguracionEntradasEvento = (req, res, next) => {
    const configuracion = Array.isArray(req.body) ? req.body : req.body.configuracion;

    if (!Array.isArray(configuracion) || configuracion.length === 0) {
        return res.status(400).json({
            error: "Datos inválidos.",
            details: "La configuración debe ser un arreglo con al menos un tipo de entrada."
        });
    }

    for (const item of configuracion) {
        const tipoId = Number(item?.tipo_entrada_id);
        const precio = Number(item?.precio);
        const capacidadTotal = Number(item?.capacidad_total);

        if (!Number.isInteger(tipoId) || tipoId <= 0) {
            return res.status(400).json({
                error: "Datos inválidos.",
                details: "Cada elemento debe tener 'tipo_entrada_id' como entero positivo."
            });
        }

        if (!Number.isFinite(precio) || precio < 0) {
            return res.status(400).json({
                error: "Datos inválidos.",
                details: "Cada elemento debe tener 'precio' como número mayor o igual a 0."
            });
        }

        if (!Number.isInteger(capacidadTotal) || capacidadTotal < 0) {
            return res.status(400).json({
                error: "Datos inválidos.",
                details: "Cada elemento debe tener 'capacidad_total' como entero mayor o igual a 0."
            });
        }
    }

    req.body = Array.isArray(req.body) ? configuracion : { ...req.body, configuracion };
    next();
};