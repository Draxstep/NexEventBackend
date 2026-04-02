import express from "express";
import {
    obtenerMetricasGenerales,
    obtenerReporteVentasPorEvento
} from "../controllers/ReporteController.js";
import { validarEventoIdReporte } from "../middlewares/ReporteValidator.js";

const router = express.Router();

router.get("/metricas-generales", obtenerMetricasGenerales);
router.get("/ventas/evento/:evento_id", validarEventoIdReporte, obtenerReporteVentasPorEvento);

export default router;