import { Categoria } from "../models/Asociaciones.js";

class CategoriaService {
    async crear(nombre) {
        try {
            return await Categoria.create({ nombre });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const customError = new Error ("Esta categoria ya existe.");
                customError.statusCode = 409;
                throw customError;
            }
            throw error;
        }
    }

    async obtenerTodos() {
        return await Categoria.findAll({
            order: [['nombre', 'ASC']]
        });
    }

}

export default new CategoriaService();