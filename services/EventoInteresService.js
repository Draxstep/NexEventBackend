import { EventoInteres, Evento } from '../models/Asociaciones.js';
import Ciudad from '../models/Ciudad.js';

class EventoInteresService {

    async registrarInteres(evento_id, usuario_id) {
        const evento = await Evento.findByPk(evento_id);
        if (!evento) {
            const error = new Error("El evento no existe.");
            error.statusCode = 404;
            throw error;
        }

        return await EventoInteres.create({ evento_id, usuario_id });
    }

    async contarInteresesPorEvento(evento_id) {
        const cantidad = await EventoInteres.count({
            where: { evento_id }
        });
        return cantidad;
    }

    async verificarInteres(evento_id, usuario_id) {
        if (!usuario_id) {
            throw new Error("El ID del usuario es obligatorio para verificar el interés.");
        }

        const existe = await EventoInteres.findOne({
            where: {
                evento_id,
                usuario_id
            }
        });

        return !!existe;
    }

    async eliminarInteres(evento_id, usuario_id) {
        if (!this.verificarInteres(evento_id, usuario_id)) {
            throw new Error("El interés no existe.");
        }
        return await EventoInteres.destroy({
            where: {
                evento_id,
                usuario_id
            }
        });
    }

    async obtenerEventosInteresadosPorUsuario(usuario_id) {
        const intereses = await EventoInteres.findAll({
            where: { usuario_id },
            include: {
                model: Evento,
                attributes: ['id', 'nombre', 'fecha', 'hora', 'lugar', 'imagen_url'],
                include: {
                    model: Ciudad,
                    attributes: ['nombre']
                }
            }
        });

        return intereses.map(i => {
            const evento = i.Evento.toJSON();

            return {
                ...evento,
                ciudad: evento.Ciudad?.nombre || 'Sin ciudad'
            };
        });
    }
}

export default new EventoInteresService();