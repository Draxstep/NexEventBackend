import eventoInteresService from '../services/EventoInteresService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const registrarInteres = asyncHandler(async (req, res) => {
    console.log("BODY:", req.body);
    const { evento_id, usuario_id } = req.body || {};

    if (!evento_id || !usuario_id) {
        return res.status(400).json({ error: "El ID del evento y del usuario son obligatorios." });
    }

    const nuevoInteres = await eventoInteresService.registrarInteres(evento_id, usuario_id);
    
    res.status(201).json({
        message: "Interés registrado exitosamente.",
        interes: nuevoInteres
    });
});

export const obtenerConteoIntereses = asyncHandler(async (req, res) => {
    const { evento_id } = req.params;
    
    const cantidad = await eventoInteresService.contarInteresesPorEvento(evento_id);
    
    res.json({
        evento_id: parseInt(evento_id),
        total_interesados: cantidad
    });
});

export const isUserInterested = asyncHandler(async (req, res) => {
    console.log("BODY:", req.params);
    const { evento_id, usuario_id } = req.params || {};
    
    const isInterested = await eventoInteresService.verificarInteres(evento_id, usuario_id);
    
    res.json({
        evento_id: parseInt(evento_id),
        interesado: isInterested
    });
});