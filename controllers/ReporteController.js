import reporteService from "../services/ReporteService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const mapearErrorDominio = (error, res) => {
    if (error.code === 'EVENTO_NO_ENCONTRADO') {
        return res.status(404).json({ error: error.message });
    }

    return null;
};

export const obtenerReporteVentasPorEvento = asyncHandler(async (req, res) => {
    const { evento_id } = req.params;

    try {
        const reporte = await reporteService.obtenerReporteVentasPorEvento(Number(evento_id));
        res.json(reporte);
    } catch (error) {
        const response = mapearErrorDominio(error, res);
        if (response) {
            return response;
        }
        throw error;
    }
});

export const obtenerMetricasGenerales = asyncHandler(async (req, res) => {
    const metricas = await reporteService.obtenerMetricasGenerales();
    res.json(metricas);
});

export const getTopMostSoldEvents = asyncHandler(async(req, res) => {
    const events = await reporteService.getTopMostSoldEvents();
    res.json(events);
})