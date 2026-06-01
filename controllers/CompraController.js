import compraService from "../services/CompraService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSocket } from "../services/SocketService.js";
import messageBroker from "../services/MessageBrokerService.js";
import logger from "../utils/logger.js";

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

    if (error.code === 'PAGO_INVALIDO') {
        return res.status(400).json({ error: error.message });
    }

    if (error.code === 'PAGO_RECHAZADO') {
        return res.status(402).json({ error: error.message });
    }

    if (error.code === 'PAGO_SERVICIO_NO_DISPONIBLE') {
        return res.status(503).json({ error: error.message });
    }

    if (error.code === 'STOCK_INSUFICIENTE') {
        return res.status(409).json({ error: error.message });
    }

    return null;
};

export const procesarCompra = asyncHandler(async (req, res) => {
    const { usuario_id, evento_id, detallesCompra, pago } = req.body;
    const io = getSocket();
    const queue = process.env.BROKER_SOURCE_QUEUE ?? "payment_events";

    const emitGatewayReceived = () => {
        io.emit("payment.status", {
            status: "GATEWAY_RECEIVED",
            message: "Respuesta recibida, analizando..."
        });
    };

    const buildSuccessDetails = (resultado, requestDetails) => {
        if (requestDetails?.evento || requestDetails?.fecha || requestDetails?.ciudad || requestDetails?.hora || requestDetails?.lugar) {
            return requestDetails;
        }

        const primerBoleto = resultado?.compra?.Boletos?.[0];
        const evento = primerBoleto?.EventoTipoEntrada?.Evento;

        return {
            evento: evento?.nombre,
            fecha: evento?.fecha,
            hora: evento?.hora,
            lugar: evento?.lugar
        };
    };

    io.emit("payment.status", {
        status: "PROCESSING",
        message: "Enviando la petición a la pasarela..."
    });

    try {
        const resultado = await compraService.procesarCompra(usuario_id, Number(evento_id), detallesCompra, pago);

        emitGatewayReceived();
        try {
            await messageBroker.publishEvent(queue, {
                type: "SUCCESS",
                details: buildSuccessDetails(resultado, req.body?.details)
            });
        } catch (publishError) {
            logger.error("broker.publish.error", {
                message: publishError.message,
                queue
            });
        }

        res.status(201).json({
            message: "Compra procesada exitosamente.",
            compra: resultado.compra,
            pago: resultado.pago
        });
    } catch (error) {
        const paymentErrorCodes = new Set([
            "PAGO_INVALIDO",
            "PAGO_RECHAZADO",
            "PAGO_SERVICIO_NO_DISPONIBLE"
        ]);

        if (paymentErrorCodes.has(error.code)) {
            const type = error.code === "PAGO_SERVICIO_NO_DISPONIBLE" ? "TIMEOUT" : "ERROR";
            emitGatewayReceived();
            try {
                await messageBroker.publishEvent(queue, {
                    type,
                    errorCode: error.code,
                    details: {
                        usuario_id,
                        evento_id: Number(evento_id),
                        motivo: error.message
                    }
                });
            } catch (publishError) {
                logger.error("broker.publish.error", {
                    message: publishError.message,
                    queue
                });
            }
        }

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
