import { TipoEntrada } from "../models/Asociaciones.js";

class TipoEntradaService {
    async crear(nombre) {
        try {
            return await TipoEntrada.create({ nombre });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const domainError = new Error("Este tipo de entrada ya existe.");
                domainError.name = 'TipoEntradaDuplicadoError';
                domainError.code = 'TIPO_ENTRADA_DUPLICADO';
                throw domainError;
            }
            throw error;
        }
    }

    async obtenerTodos() {
        return await TipoEntrada.findAll({
            order: [['nombre', 'ASC']]
        });
    }
}

export default new TipoEntradaService();