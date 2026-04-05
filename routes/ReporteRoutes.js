import express from "express";
import {
    obtenerMetricasGenerales,
    obtenerReporteVentasPorEvento,
    getTopMostSoldEvents
} from "../controllers/ReporteController.js";
import { validarEventoIdReporte } from "../middlewares/ReporteValidator.js";

const router = express.Router();

router.get("/metricas-generales", obtenerMetricasGenerales);
router.get("/ventas/evento/:evento_id", validarEventoIdReporte, obtenerReporteVentasPorEvento);
router.get("/top-most-sold-events", getTopMostSoldEvents)

export default router;