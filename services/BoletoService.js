import { randomUUID } from "crypto";
import { Boleto, Compra, EventoTipoEntrada, TipoEntrada, Evento } from "../models/Asociaciones.js";

class BoletoService {
    async generarBoletos(compra_id, detallesCompra, options = {}) {
        const { transaction } = options;

        const compra = await Compra.findByPk(compra_id, {
            attributes: ['id'],
            transaction
        });
        if (!compra) {
            const error = new Error("Compra no encontrada.");
            error.code = 'COMPRA_NO_ENCONTRADA';
            throw error;
        }

        if (!Array.isArray(detallesCompra) || detallesCompra.length === 0) {
            const error = new Error("El detalle de compra debe ser un arreglo con al menos un item.");
            error.code = 'DETALLE_COMPRA_INVALIDO';
            throw error;
        }

        const eventoTipoIds = detallesCompra.map(d => Number(d.evento_tipo_id));
        const eventoTipos = await EventoTipoEntrada.findAll({
            where: { id: eventoTipoIds },
            attributes: ['id'],
            transaction
        });

        if (eventoTipos.length !== new Set(eventoTipoIds).size) {
            const error = new Error("Uno o más tipos de entrada del evento no existen.");
            error.code = 'EVENTO_TIPO_NO_ENCONTRADO';
            throw error;
        }

        const boletosParaInsertar = [];

        for (const detalle of detallesCompra) {
            const eventoTipoId = Number(detalle.evento_tipo_id);
            const cantidad = Number(detalle.cantidad);

            if (!Number.isInteger(eventoTipoId) || eventoTipoId <= 0 || !Number.isInteger(cantidad) || cantidad <= 0) {
                const error = new Error("Cada item debe incluir 'evento_tipo_id' y 'cantidad' como enteros positivos.");
                error.code = 'DETALLE_COMPRA_INVALIDO';
                throw error;
            }

            for (let i = 0; i < cantidad; i += 1) {
                boletosParaInsertar.push({
                    compra_id,
                    evento_tipo_id: eventoTipoId,
                    codigo_qr_individual: randomUUID(),
                    estado: 'Válido'
                });
            }
        }

        return await Boleto.bulkCreate(boletosParaInsertar, { transaction });
    }

    async validarAcceso(codigo_qr_individual) {
        const boleto = await Boleto.findOne({
            where: { codigo_qr_individual },
            include: [{
                model: EventoTipoEntrada,
                as: 'EventoTipoEntrada',
                attributes: ['id'],
                include: [
                    {
                        model: TipoEntrada,
                        as: 'TipoEntrada',
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Evento,
                        attributes: ['id', 'nombre']
                    }
                ]
            }]
        });

        if (!boleto) {
            const error = new Error("Boleto no encontrado.");
            error.code = 'BOLETO_NO_ENCONTRADO';
            throw error;
        }

        if (boleto.estado === 'Usado' || boleto.estado === 'Cancelado') {
            const error = new Error("Entrada inválida o ya utilizada.");
            error.code = 'BOLETO_INVALIDO_O_USADO';
            throw error;
        }

        await boleto.update({ estado: 'Usado' });

        return {
            message: 'Acceso permitido. Boleto validado correctamente.',
            boleto: {
                id: boleto.id,
                estado: boleto.estado,
                tipo_entrada: boleto.EventoTipoEntrada?.TipoEntrada,
                evento: boleto.EventoTipoEntrada?.Evento
            }
        };
    }

    async cancelarBoleto(boleto_id) {
        const boleto = await Boleto.findByPk(boleto_id);

        if (!boleto) {
            const error = new Error("Boleto no encontrado.");
            error.code = 'BOLETO_NO_ENCONTRADO';
            throw error;
        }

        if (boleto.estado === 'Usado') {
            const error = new Error("No se puede cancelar un boleto ya usado.");
            error.code = 'BOLETO_NO_CANCELABLE';
            throw error;
        }

        await boleto.update({ estado: 'Cancelado' });
        return boleto;
    }
}

export default new BoletoService();