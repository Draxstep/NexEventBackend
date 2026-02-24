import eventoService from "../services/EventoService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const crearEvento = asyncHandler(async (req, res) => {
    const datosNuevos = req.body;
    const nuevoEvento = await eventoService.crear(datosNuevos);
    res.status(201).json({
        message: "Evento agregado correctamente."
    });
});

export const obtenerEventos = asyncHandler(async (req, res) => {
    const eventos = await eventoService.obtenerEventos();
    res.json(eventos);
});

export const obtenerEventoPorId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const evento = await eventoService.obtenerEventoPorId(id);
    res.json(evento);
});

export const actualizarEvento = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body; 
    const eventoActualizado = await eventoService.actualizarEvento(id, datosActualizados);
    res.status(201).json({
        message: "Evento actualizado correctamente.",
        evento: eventoActualizado
    });
});