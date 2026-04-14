import { v4 as uuidv4 } from "uuid";
import { Boleto, Compra, Evento, EventoTipoEntrada, TipoEntrada, Usuario, sequelize } from "../models/Asociaciones.js";
import boletoService from "./BoletoService.js";

class CompraService {
    async procesarCompra(usuario_id, evento_id, detallesCompra) {
        const usuario = await Usuario.findByPk(usuario_id, { attributes: ['id'] });
        if (!usuario) {
            const error = new Error("Usuario no encontrado.");
            error.code = 'USUARIO_NO_ENCONTRADO';
            throw error;
        }

        if (!Array.isArray(detallesCompra) || detallesCompra.length === 0) {
            const error = new Error("El detalle de compra debe contener al menos un tipo de entrada.");
            error.code = 'DETALLE_COMPRA_INVALIDO';
            throw error;
        }

        const cantidadesPorTipoEntrada = new Map();
        for (const item of detallesCompra) {
            const tipoEntradaId = Number(item?.tipo_entrada_id);
            const cantidad = Number(item?.cantidad);

            if (!Number.isInteger(tipoEntradaId) || tipoEntradaId <= 0 || !Number.isInteger(cantidad) || cantidad <= 0) {
                const error = new Error("Cada item debe incluir 'tipo_entrada_id' y 'cantidad' como enteros positivos.");
                error.code = 'DETALLE_COMPRA_INVALIDO';
                throw error;
            }

            const acumulado = cantidadesPorTipoEntrada.get(tipoEntradaId) || 0;
            cantidadesPorTipoEntrada.set(tipoEntradaId, acumulado + cantidad);
        }

        const transaction = await sequelize.transaction();

        try {
            const evento = await Evento.findOne({
                where: { id: evento_id, estado: 'Activo' },
                attributes: ['id', 'nombre', 'estado'],
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!evento) {
                const error = new Error("El evento no existe o no está activo.");
                error.code = 'EVENTO_NO_DISPONIBLE';
                throw error;
            }

            const tipoEntradaIds = [...cantidadesPorTipoEntrada.keys()];
            const eventoTipos = await EventoTipoEntrada.findAll({
                where: {
                    evento_id,
                    tipo_entrada_id: tipoEntradaIds
                },
                attributes: ['id', 'tipo_entrada_id', 'precio', 'capacidad_total', 'cantidad_vendida'],
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (eventoTipos.length !== tipoEntradaIds.length) {
                const error = new Error("Uno o más tipos de entrada no están disponibles para este evento.");
                error.code = 'TIPO_ENTRADA_NO_DISPONIBLE';
                throw error;
            }

            let montoTotal = 0;
            const detallesParaBoletos = [];

            for (const eventoTipo of eventoTipos) {
                const cantidadSolicitada = cantidadesPorTipoEntrada.get(eventoTipo.tipo_entrada_id) || 0;
                const asientosDisponibles = eventoTipo.capacidad_total - eventoTipo.cantidad_vendida;

                if (asientosDisponibles < cantidadSolicitada) {
                    const error = new Error("No hay capacidad suficiente para completar la compra.");
                    error.code = 'STOCK_INSUFICIENTE';
                    throw error;
                }

                montoTotal += Number(eventoTipo.precio) * cantidadSolicitada;
                detallesParaBoletos.push({
                    evento_tipo_id: eventoTipo.id,
                    cantidad: cantidadSolicitada
                });
            }

            const compra = await Compra.create({
                usuario_id,
                monto_total: montoTotal.toFixed(2),
                codigo_qr_general: uuidv4()
            }, { transaction });

            await boletoService.generarBoletos(compra.id, detallesParaBoletos, { transaction });

            for (const eventoTipo of eventoTipos) {
                const cantidadSolicitada = cantidadesPorTipoEntrada.get(eventoTipo.tipo_entrada_id) || 0;
                await eventoTipo.increment('cantidad_vendida', {
                    by: cantidadSolicitada,
                    transaction
                });
            }

            await transaction.commit();
            return await this.obtenerDetalleCompra(compra.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async obtenerDetalleCompra(compra_id) {
        const compra = await Compra.findByPk(compra_id, {
            include: [
                {
                    model: Usuario,
                    attributes: ['id', 'email', 'nombre']
                },
                {
                    model: Boleto,
                    attributes: ['id', 'codigo_qr_individual', 'estado'],
                    include: [
                        {
                            model: EventoTipoEntrada,
                            as: 'EventoTipoEntrada',
                            attributes: ['id', 'precio'],
                            include: [
                                {
                                    model: TipoEntrada,
                                    as: 'TipoEntrada',
                                    attributes: ['id', 'nombre']
                                },
                                {
                                    model: Evento,
                                    attributes: ['id', 'nombre', 'fecha', 'hora', 'lugar']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!compra) {
            const error = new Error("Compra no encontrada.");
            error.code = 'COMPRA_NO_ENCONTRADA';
            throw error;
        }

        return compra;
    }

    async obtenerHistorialComprasUsuario(usuario_id) {
        const usuario = await Usuario.findByPk(usuario_id, { attributes: ['id'] });
        if (!usuario) {
            const error = new Error("Usuario no encontrado.");
            error.code = 'USUARIO_NO_ENCONTRADO';
            throw error;
        }

        return await Compra.findAll({
            where: { usuario_id },
            attributes: ['id', 'fecha_compra', 'monto_total', 'codigo_qr_general'],
            order: [['fecha_compra', 'DESC']]
        });
    }
}

export default new CompraService();