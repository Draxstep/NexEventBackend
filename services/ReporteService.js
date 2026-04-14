import { Compra, Evento, EventoTipoEntrada, TipoEntrada, Usuario, sequelize, Categoria, Ciudad } from "../models/Asociaciones.js";
import { fn, col } from 'sequelize';

class ReporteService {
    async obtenerReporteVentasPorEvento(evento_id) {
        const evento = await Evento.findByPk(evento_id, {
            attributes: ['id', 'nombre']
        });

        if (!evento) {
            const error = new Error("Evento no encontrado.");
            error.code = 'EVENTO_NO_ENCONTRADO';
            throw error;
        }

        const ventasPorTipo = await EventoTipoEntrada.findAll({
            where: { evento_id },
            attributes: [
                'id',
                'tipo_entrada_id',
                'cantidad_vendida',
                'capacidad_total',
                [sequelize.literal('"EventoTipoEntrada"."cantidad_vendida" * "EventoTipoEntrada"."precio"'), 'ganancia']
            ],
            include: [
                {
                    model: TipoEntrada,
                    as: 'TipoEntrada',
                    attributes: ['id', 'nombre']
                }
            ],
            order: [[{ model: TipoEntrada, as: 'TipoEntrada' }, 'nombre', 'ASC']]
        });

        return {
            evento,
            ventas: ventasPorTipo
        };
    }

    async obtenerMetricasGenerales() {
        const [totalGanancias, eventosActivos, eventosPasados, usuariosRegistrados] = await Promise.all([
            Compra.sum('monto_total'),
            Evento.count({ where: { estado: 'Activo' } }),
            Evento.count({ where: { estado: 'Completado' } }),
            Usuario.count()
        ]);

        return {
            total_ganancias: Number(totalGanancias || 0),
            eventos_activos: eventosActivos,
            eventos_pasados: eventosPasados,
            usuarios_registrados: usuariosRegistrados
        };
    }

    async getTopMostSoldEvents() {
        const eventos = await Evento.findAll({
            where: { estado: 'Activo' },
            attributes: [
                'id', 'nombre', 'fecha', 'lugar', 'imagen_url', 'hora',
                [fn('COALESCE', fn('SUM', col('EventoTipoEntradas.cantidad_vendida')), 0), 'total_vendido']
            ],
            include: [
                {
                    model: Categoria,
                    as: 'Categoria',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Ciudad,
                    attributes: ['nombre']
                },
                {
                    model: EventoTipoEntrada,
                    attributes: [],
                    required: false
                }
            ],
            group: [
                'Evento.id',
                'Categoria.id',
                'Ciudad.id'
            ],
            order: [
                [col('total_vendido'), 'DESC'],
                ['fecha', 'ASC']
            ],
            subQuery: false,
            limit: 3
        });

        if (!eventos || eventos.length === 0) {
            const error = new Error("No se encontraron eventos disponibles.");
            error.code = 'EVENTOS_NO_ENCONTRADOS';
            throw error;
        }

        return eventos;
    }
}

export default new ReporteService();