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

    async getEventsByPopularity() {
        return await Evento.findAll({
            where: { estado: true }, 
            attributes: [
                'id', 'nombre', 'fecha', 'lugar', 'imagen_url', 'hora',
                [sequelize.fn('COUNT', sequelize.col('EventoInteres.id')), 'total_intereses']
            ],
            include: [
                {
                    model: EventoInteres,
                    attributes: [], 
                    required: false 
                },
                { 
                    model: Categoria, 
                    as: 'Categoria', 
                    attributes: ['id', 'nombre'] 
                },
                { 
                    model: Ciudad, 
                    attributes: ['nombre'] 
                }
            ],
            group: [
                'Evento.id', 'Categoria.id', 'Ciudad.id'
            ],
            order: [
                [sequelize.col('total_intereses'), 'DESC'], 
                ['fecha', 'ASC'] 
            ]
        });
    }
}

export default new ReporteService();