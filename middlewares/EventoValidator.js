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

    next();
};