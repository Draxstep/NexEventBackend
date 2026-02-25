import { EventoInteres, Evento } from '../models/Asociaciones.js';

class EventoInteresService {
    
    async registrarInteres(evento_id) {
        const evento = await Evento.findByPk(evento_id);
        if (!evento) {
            const error = new Error("El evento no existe.");
            error.statusCode = 404;
            throw error;
        }

        return await EventoInteres.create({ evento_id });
    }

    async contarInteresesPorEvento(evento_id) {
        const cantidad = await EventoInteres.count({
            where: { evento_id }
        });
        return cantidad;
    }
}

export default new EventoInteresService();