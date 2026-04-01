import eventoTipoEntradaService from "../services/EventoTipoEntradaService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const mapearErrorADominioHttp = (error, res) => {
    if (error.code === 'EVENTO_NO_ENCONTRADO') {
        return res.status(404).json({ error: error.message });
    }

    if (
        error.code === 'CONFIGURACION_INVALIDA' ||
        error.code === 'TIPO_ENTRADA_DUPLICADO_CONFIG' ||
        error.code === 'TIPO_ENTRADA_NO_EXISTE'
    ) {
        return res.status(400).json({ error: error.message });
    }

    if (
        error.code === 'CAPACIDAD_MENOR_VENDIDA' ||
        error.code === 'NO_PUEDE_ELIMINAR_TIPO_CON_VENTAS'
    ) {
        return res.status(409).json({ error: error.message });
    }

    return null;
};

export const configurarEntradasEvento = asyncHandler(async (req, res) => {
    const { evento_id } = req.params;
    const configuracion = Array.isArray(req.body) ? req.body : req.body.configuracion;

    try {
        const resultado = await eventoTipoEntradaService.configurarEntradasEvento(Number(evento_id), configuracion);

        res.status(200).json({
            message: "Entradas del evento configuradas correctamente.",
            configuracion: resultado
        });
    } catch (error) {
        const response = mapearErrorADominioHttp(error, res);
        if (response) {
            return response;
        }
        throw error;
    }
});

export const obtenerDisponibilidadEvento = asyncHandler(async (req, res) => {
    const { evento_id } = req.params;

    try {
        const disponibilidad = await eventoTipoEntradaService.obtenerDisponibilidad(Number(evento_id));
        res.json(disponibilidad);
    } catch (error) {
        const response = mapearErrorADominioHttp(error, res);
        if (response) {
            return response;
        }
        throw error;
    }
});