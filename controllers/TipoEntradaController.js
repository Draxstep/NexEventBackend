import tipoEntradaService from "../services/TipoEntradaService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const crearTipoEntrada = asyncHandler(async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: "El nombre del tipo de entrada es obligatorio." });
    }

    try {
        const nuevoTipoEntrada = await tipoEntradaService.crear(nombre);
        return res.status(201).json(nuevoTipoEntrada);
    } catch (error) {
        if (error.code === 'TIPO_ENTRADA_DUPLICADO') {
            return res.status(409).json({ error: error.message });
        }
        throw error;
    }
});

export const obtenerTiposEntrada = asyncHandler(async (req, res) => {
    const tiposEntrada = await tipoEntradaService.obtenerTodos();
    res.json(tiposEntrada);
});