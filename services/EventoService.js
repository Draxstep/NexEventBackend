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

    //Aca iria metodo para obtener eventos
}

export default new EventoService();