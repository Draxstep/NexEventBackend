import { Evento, Categoria, Ciudad, Departamento } from "../models/Asociaciones.js";

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

    async obtenerEventos (){
        return await Evento.findAll({

            attributes: ['id', 'nombre', 'fecha', 'lugar', 'imagen_url'], 
            order: [['fecha', 'ASC']], 
            
            include: [
                { 
                    model: Categoria, 
                    attributes: ['id', 'nombre'] 
                },
                {
                    model: Ciudad,
                    attributes: ['nombre'] 
                }
            ]
        });
    };

    async obtenerEventoPorId (id) {
        const event = await Evento.findByPk(id, {
            attributes: { 
                exclude: ['categoria_id', 'ciudad_id'] 
            },
            include: [
                { 
                    model: Categoria, 
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
}

export default new EventoService();