import { Evento } from "../models/Asociaciones.js";

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
        return await Event.findAll({
            include: [{
                attributes: ['id', 'nombre', 'fecha', 'lugar'],
                include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] }],
                 order: [['fecha', 'ASC']]
            }]
        })
    };

    async obtenerEventoPorId (id) {
        const event = await Event.findByPk(id, {
            exclude: ['categoria_id'],
            include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] }]
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