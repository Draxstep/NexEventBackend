import express from "express";
import {
    crearTipoEntrada,
    obtenerTiposEntrada
} from "../controllers/TipoEntradaController.js";
import { validarCreacionTipoEntrada } from "../middlewares/TipoEntradaValidator.js";

const router = express.Router();

router.get("/", obtenerTiposEntrada);
router.post("/", validarCreacionTipoEntrada, crearTipoEntrada);

export default router;