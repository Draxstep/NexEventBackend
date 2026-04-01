import boletoService from "../services/BoletoService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const mapearErrorDominio = (error, res) => {
    if (error.code === 'COMPRA_NO_ENCONTRADA' || error.code === 'BOLETO_NO_ENCONTRADO') {
        return res.status(404).json({ error: error.message });
    }

    if (error.code === 'DETALLE_COMPRA_INVALIDO' || error.code === 'EVENTO_TIPO_NO_ENCONTRADO') {
        return res.status(400).json({ error: error.message });
    }

    if (error.code === 'BOLETO_INVALIDO_O_USADO' || error.code === 'BOLETO_NO_CANCELABLE') {
        return res.status(400).json({ error: error.message });
    }

    return null;
};

export const generarBoletos = asyncHandler(async (req, res) => {
    const { compra_id, detallesCompra } = req.body;

    try {
        const boletos = await boletoService.generarBoletos(Number(compra_id), detallesCompra);
        res.status(201).json({
            message: "Boletos generados correctamente.",
            total_generados: boletos.length,
            boletos
        });
    } catch (error) {
        const response = mapearErrorDominio(error, res);
        if (response) {
            return response;
        }
        throw error;
    }
});

export const validarAcceso = asyncHandler(async (req, res) => {
    const { codigo_qr_individual } = req.body;

    try {
        const resultado = await boletoService.validarAcceso(codigo_qr_individual);
        res.status(200).json(resultado);
    } catch (error) {
        const response = mapearErrorDominio(error, res);
        if (response) {
            return response;
        }
        throw error;
    }
});

export const cancelarBoleto = asyncHandler(async (req, res) => {
    const { boleto_id } = req.params;

    try {
        const boleto = await boletoService.cancelarBoleto(Number(boleto_id));
        res.status(200).json({
            message: "Boleto cancelado correctamente.",
            boleto
        });
    } catch (error) {
        const response = mapearErrorDominio(error, res);
        if (response) {
            return response;
        }
        throw error;
    }
});