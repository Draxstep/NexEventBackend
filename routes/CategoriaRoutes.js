import express from "express";
import {
    crearCategoria,
    obtenerCategorias
} from "../controllers/CategoriaController.js";
import { validarCreacionCategoria } from "../middlewares/CategoriaValidator.js";

const router = express.Router();

router.get("/", obtenerCategorias);
router.post("/", validarCreacionCategoria, crearCategoria);

export default router;