import compraService from "../services/CompraService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const mapearErrorDominio = (error, res) => {
    if (error.code === 'USUARIO_NO_ENCONTRADO' || error.code === 'COMPRA_NO_ENCONTRADA') {
        return res.status(404).json({ error: error.message });
    }

    if (
        error.code === 'DETALLE_COMPRA_INVALIDO' ||
        error.code === 'TIPO_ENTRADA_NO_DISPONIBLE' ||
        error.code === 'EVENTO_NO_DISPONIBLE'
    ) {
        return res.status(400).json({ error: error.message });
    }

    if (error.code === 'STOCK_INSUFICIENTE') {
        return res.status(409).json({ error: error.message });
    }

    return null;
};

export const procesarCompra = asyncHandler(async (req, res) => {
    const { usuario_id, evento_id, detallesCompra } = req.body;

    try {
        const compra = await compraService.procesarCompra(usuario_id, Number(evento_id), detallesCompra);
        res.status(201).json({
            message: "Compra procesada exitosamente.",
            compra
        });
    } catch (error) {
        const response = mapearErrorDominio(error, res);
        if (response) {
            return response;
        }
        throw error;
    }
});

export const obtenerDetalleCompra = asyncHandler(async (req, res) => {
    const { compra_id } = req.params;

    try {
        const compra = await compraService.obtenerDetalleCompra(Number(compra_id));
        res.json(compra);
    } catch (error) {
        const response = mapearErrorDominio(error, res);
        if (response) {
            return response;
        }
        throw error;
    }
});

export const obtenerHistorialComprasUsuario = asyncHandler(async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const historial = await compraService.obtenerHistorialComprasUsuario(usuario_id);
        res.json(historial);
    } catch (error) {
        const response = mapearErrorDominio(error, res);
        if (response) {
            return response;
        }
        throw error;
    }
});