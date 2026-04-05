import { Compra, Evento, EventoTipoEntrada, TipoEntrada, Usuario, sequelize } from "../models/Asociaciones.js";

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
            Evento.count({ where: { estado: true } }),
            Evento.count({ where: { estado: false } }),
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
            where: { estado: true },
            attributes: ['id', 'nombre', 'fecha', 'lugar', 'imagen_url', 'hora'],
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
                    attributes: ['cantidad_vendida', 'precio'],
                    required: false
                }
            ],
            order: [
                ['total_vendido', 'DESC'], 
                ['fecha', 'ASC']
            ],
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