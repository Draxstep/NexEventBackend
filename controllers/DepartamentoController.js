import departamentoService from "../services/DepartamentoService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const crearDepartamento = asyncHandler(async (req, res) => {
    const { nombre } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ error: "El nombre del departamento es obligatorio." });
    }

    const nuevoDepartamento = await departamentoService.crear(nombre);
    res.status(201).json(nuevoDepartamento);
});

export const obtenerDepartamentos = asyncHandler(async (req, res) => {
    const departamentos = await departamentoService.obtenerTodos();
    res.json(departamentos);
});

export const obtenerCiudadesPorDepartamento = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ciudades = await departamentoService.obtenerCiudades(id);
    res.json(ciudades);
});