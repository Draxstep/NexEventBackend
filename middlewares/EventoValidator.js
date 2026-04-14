const ESTADOS_VALIDOS_EVENTO = ['Activo', 'Completado', 'Cancelado'];

const validarEstadoEvento = (estado) => {
    return typeof estado === 'string' && ESTADOS_VALIDOS_EVENTO.includes(estado.trim());
};

export const validarCreacionEvento = (req, res, next) => {
    const { nombre, fecha, lugar, hora, categoria_id, ciudad_id } = req.body;

    if (!nombre || !fecha || !lugar || !hora || !categoria_id || !ciudad_id) {
        return res.status(400).json({ 
            error: "Faltan datos obligatorios", 
            details: "nombre, fecha, lugar, hora, categoria_id y ciudad_id son requeridos." 
        });
    }

    if (nombre.length > 100) {
        return res.status(400).json({ 
            error: "Nombre demasiado largo", 
            details: "El nombre del evento no puede superar los 100 caracteres." 
        });
    }

    const fechaActual = new Date().toISOString().split('T')[0];
    
    if (fecha < fechaActual) {
        return res.status(400).json({ 
            error: "Fecha inválida", 
            details: "La fecha del evento debe ser igual o posterior a la fecha actual." 
        });
    }

    if (req.body.imagen_url) {
        const urlToLower = req.body.imagen_url.toLowerCase();
        if (!urlToLower.endsWith('.jpg') && !urlToLower.endsWith('.png')) {
            return res.status(400).json({ error: "La imagen debe ser formato JPG o PNG." });
        }
    }

    if (req.body.estado !== undefined) {
        if (!validarEstadoEvento(req.body.estado)) {
            return res.status(400).json({
                error: "Estado inválido",
                details: "El estado debe ser uno de: Activo, Completado o Cancelado."
            });
        }
        req.body.estado = req.body.estado.trim();
    }

    next();
};

export const validarCambioEstadoEvento = (req, res, next) => {
    const { estado } = req.body;

    if (estado === undefined) {
        return res.status(400).json({
            error: "Falta el estado",
            details: "Debe enviar el campo 'estado' con valor Activo, Completado o Cancelado."
        });
    }

    if (!validarEstadoEvento(estado)) {
        return res.status(400).json({
            error: "Estado inválido",
            details: "El estado debe ser uno de: Activo, Completado o Cancelado."
        });
    }

    req.body.estado = estado.trim();
    next();
};