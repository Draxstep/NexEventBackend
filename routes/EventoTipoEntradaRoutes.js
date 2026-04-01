import express from "express";
import {
    configurarEntradasEvento,
    obtenerDisponibilidadEvento
} from "../controllers/EventoTipoEntradaController.js";
import {
    validarEventoIdParam,
    validarConfiguracionEntradasEvento
} from "../middlewares/EventoTipoEntradaValidator.js";

const router = express.Router();

router.put("/:evento_id", validarEventoIdParam, validarConfiguracionEntradasEvento, configurarEntradasEvento);
router.get("/:evento_id/disponibilidad", validarEventoIdParam, obtenerDisponibilidadEvento);

export default router;