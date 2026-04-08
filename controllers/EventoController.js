import eventoService from "../services/EventoService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ImgDbService from "../services/ImgDbService.js";

export const crearEvento = asyncHandler(async (req, res) => {
    
    const datosNuevos = req.body;
    if (req.file){
        const urlImage = await ImgDbService.subirImagen(req.file.buffer);
        datosNuevos.imagen_url = urlImage;
    

    const nuevoEvento = await eventoService.crear(datosNuevos);
    res.status(201).json({
        message: "Evento agregado correctamente.",
        evento: nuevoEvento
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

    if (req.file) {
        const urlImage = await ImgDbService.subirImagen(req.file.buffer);
        datosActualizados.imagen_url = urlImage;
    }

    const eventoActualizado = await eventoService.actualizarEvento(id, datosActualizados);
    
    res.status(200).json({ 
        message: "Evento actualizado correctamente.",
        evento: eventoActualizado
    });
});

export const obtenerEventosActivos = asyncHandler(async (req, res) => {
    const eventos = await eventoService.obtenerEventosActivos();
    res.json(eventos);
});

export const cambiarEstadoEvento = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const eventoActualizado = await eventoService.cambiarEstado(id);
    res.json({
        message: eventoActualizado.estado ? "Evento activado." : "Evento inactivado.",
        evento: eventoActualizado
    });
});