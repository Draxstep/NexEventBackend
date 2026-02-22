import { Departamento, Ciudad } from "../models/Asociaciones.js";

class DepartamentoService {
    async crear(nombre) {
        try {
            return await Departamento.create({ nombre });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const customError = new Error("Este departamento ya está registrado.");
                customError.statusCode = 409;
                throw customError;
            }
            throw error;
        }
    }

    async obtenerTodos() {
        return await Departamento.findAll({
            order: [['nombre', 'ASC']]
        });
    }

    async obtenerCiudades(departamentoId) {
        return await Ciudad.findAll({
            where: { departamento_id: departamentoId },
            order: [['nombre', 'ASC']]
        });
    }
}

export default new DepartamentoService();