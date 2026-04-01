import { sequelize, Evento, TipoEntrada, EventoTipoEntrada } from "../models/Asociaciones.js";

class EventoTipoEntradaService {
    async configurarEntradasEvento(evento_id, configuracion) {
        const evento = await Evento.findByPk(evento_id);
        if (!evento) {
            const error = new Error("Evento no encontrado.");
            error.code = 'EVENTO_NO_ENCONTRADO';
            throw error;
        }

        if (!Array.isArray(configuracion) || configuracion.length === 0) {
            const error = new Error("La configuración debe ser un arreglo con al menos un tipo de entrada.");
            error.code = 'CONFIGURACION_INVALIDA';
            throw error;
        }

        const tipoIds = configuracion.map(item => Number(item.tipo_entrada_id));
        const tipoIdsUnicos = new Set(tipoIds);

        if (tipoIdsUnicos.size !== tipoIds.length) {
            const error = new Error("La configuración contiene tipos de entrada repetidos.");
            error.code = 'TIPO_ENTRADA_DUPLICADO_CONFIG';
            throw error;
        }

        const tiposExistentes = await TipoEntrada.findAll({
            where: { id: [...tipoIdsUnicos] },
            attributes: ['id']
        });

        if (tiposExistentes.length !== tipoIdsUnicos.size) {
            const error = new Error("Uno o más tipos de entrada no existen.");
            error.code = 'TIPO_ENTRADA_NO_EXISTE';
            throw error;
        }

        const transaction = await sequelize.transaction();

        try {
            const actuales = await EventoTipoEntrada.findAll({
                where: { evento_id },
                transaction
            });

            const actualesPorTipo = new Map(actuales.map(item => [item.tipo_entrada_id, item]));
            const configuracionPorTipo = new Map(configuracion.map(item => [Number(item.tipo_entrada_id), item]));

            for (const [tipoId, nuevoItem] of configuracionPorTipo.entries()) {
                const itemActual = actualesPorTipo.get(tipoId);
                const nuevaCapacidad = Number(nuevoItem.capacidad_total);

                if (itemActual) {
                if (nuevaCapacidad < itemActual.cantidad_vendida) {
                    const error = new Error("La capacidad total no puede ser menor que la cantidad vendida.");
                    error.code = 'CAPACIDAD_MENOR_VENDIDA';
                    throw error;
                }

                await itemActual.update({
                    precio: Number(nuevoItem.precio),
                    capacidad_total: nuevaCapacidad
                }, { transaction });
                    continue;
                }

                await EventoTipoEntrada.create({
                    evento_id,
                    tipo_entrada_id: tipoId,
                    precio: Number(nuevoItem.precio),
                    capacidad_total: Number(nuevoItem.capacidad_total)
                }, { transaction });
            }

            await transaction.commit();
            return this.obtenerDisponibilidad(evento_id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async obtenerDisponibilidad(evento_id) {
        const evento = await Evento.findByPk(evento_id, { attributes: ['id'] });
        if (!evento) {
            const error = new Error("Evento no encontrado.");
            error.code = 'EVENTO_NO_ENCONTRADO';
            throw error;
        }

        const configuraciones = await EventoTipoEntrada.findAll({
            where: { evento_id },
            attributes: ['id', 'tipo_entrada_id', 'precio', 'capacidad_total', 'cantidad_vendida'],
            include: [{
                model: TipoEntrada,
                as: 'TipoEntrada',
                attributes: ['id', 'nombre']
            }],
            order: [[{ model: TipoEntrada, as: 'TipoEntrada' }, 'nombre', 'ASC']]
        });

        return configuraciones.map(item => {
            const data = item.toJSON();
            return {
                id: data.id,
                tipo_entrada_id: data.tipo_entrada_id,
                tipo_entrada: data.TipoEntrada,
                precio: data.precio,
                capacidad_total: data.capacidad_total,
                cantidad_vendida: data.cantidad_vendida,
                asientos_disponibles: data.capacidad_total - data.cantidad_vendida
            };
        });
    }
}

export default new EventoTipoEntradaService();