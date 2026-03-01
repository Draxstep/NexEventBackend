import { Usuario } from '../models/Asociaciones.js';

class UsuarioService {
    async guardarUsuario(id, email, nombre) {
        const [usuario] = await Usuario.upsert({
            id,
            email,
            nombre
        });
        return usuario;
    }

    async eliminarUsuario(id) {
        return await Usuario.destroy({
            where: { id }
        });
    }
}

export default new UsuarioService();