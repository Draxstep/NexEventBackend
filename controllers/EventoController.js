import eventoService from "../services/EventoService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const crearEvento = asyncHandler(async (req, res) => {

    const datosNuevos = req.body;

    const nuevoEvento = await eventoService.crear(datosNuevos);
    
    res.status(201).json({
        message: "Evento agregado correctamente."
    });
});

//Aca iria metodo para obtener eventos

//Aca iria metodo para actualizar un evento