import { Evento, Categoria, Ciudad, Departamento, EventoTipoEntrada } from "../models/Asociaciones.js";

class EventoService {
    async crear(datosEvento) {
        try {
            return await Evento.create(datosEvento);
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                const customError = new Error("Inconsistencia de datos: La categoría o la ciudad seleccionada no existe.");
                customError.statusCode = 400;
                throw customError;
            }
            throw error;
        }
    }

    //Aca iria metodo para actualizar evento
    async actualizarEvento(id, datosEvento) {
        try {
            const evento = await Evento.findByPk(id);
            if (!evento) {
                const error = new Error("Evento no encontrado.");
                error.statusCode = 404;
                throw error;
            }
            return await evento.update(datosEvento);
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                const customError = new Error("Inconsistencia de datos: La categoría o la ciudad seleccionada no existe.");
                customError.statusCode = 400;
                throw customError;
            }
            throw error;
        }
    }

    async obtenerEventos() {
        const eventos = await Evento.findAll({
            attributes: ['id', 'nombre', 'fecha', 'lugar', 'imagen_url', 'estado'],
            order: [['fecha', 'ASC']],
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
                    attributes: ['capacidad_total', 'cantidad_vendida']
                }
            ]
        });

        return eventos.map(evento => {
            const data = evento.toJSON();
            
            const estado_entradas = this.calculateStateTickets(data.EventoTipoEntradas);
            delete data.EventoTipoEntradas;

            return {
                ...data,
                estado_entradas 
            };
        });
    }
    
    async obtenerEventoPorId(id) {
        const event = await Evento.findByPk(id, {
            attributes: {
                exclude: ['categoria_id', 'ciudad_id']
            },
            include: [
                {
                    model: Categoria,
                    as: 'Categoria',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Ciudad,
                    attributes: ['id', 'nombre'],
                    include: [
                        {
                            model: Departamento,
                            attributes: ['id', 'nombre']
                        }
                    ]
                }
            ]
        });

        if (!event) {
            const error = new Error("Evento no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        return event;
    };

    async obtenerEventosActivos() {
        return await Evento.findAll({
            where: { estado: true },
            attributes: ['id', 'nombre', 'fecha', 'lugar', 'imagen_url', 'hora'],
            order: [['fecha', 'ASC']],
            include: [
                { model: Categoria, as: 'Categoria', attributes: ['id', 'nombre'] },
                { model: Ciudad, attributes: ['nombre'] }
            ]
        });
    }

    async cambiarEstado(id) {
        const evento = await Evento.findByPk(id);
        if (!evento) {
            const error = new Error("Evento no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        return await evento.update({ estado: !evento.estado });
    }

    calculateStateTickets (tickets) {
        if (!tickets || tickets.length === 0) {
            return 'UNCONFIGURED';
        }

        const totalCapacity = tickets.reduce((sum, t) => sum + Number(t.capacidad_total), 0);
        const totalSold = tickets.reduce((sum, t) => sum + Number(t.cantidad_vendida), 0);

        if (totalCapacity === 0) {
            return 'UNCONFIGURED';
        } else if (totalSold >= totalCapacity) {
            return 'SOLD_OUT';
        } else {
            return 'AVAILABLE';
        }
    }
}

export default new EventoService();