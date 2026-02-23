import categoriaService from "../services/CategoriaService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const crearCategoria = asyncHandler(async (req, res) => {
    const { nombre } = req.body;

    if(!nombre) {
        return res.status(400).json({ error: "El nombre de la categoria es obligatorio."});
    }

    const nuevaCategoria = await categoriaService.crear(nombre);
    res.status(201).json(nuevaCategoria);
});

export const obtenerCategorias = asyncHandler(async (req, res) => {
    const categorias = await categoriaService.obtenerTodos();
    res.json(categorias);
});