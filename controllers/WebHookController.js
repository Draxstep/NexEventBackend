import { Webhook } from 'svix';
import usuarioService from '../services/UsuarioService.js';

export const recibirWebhookClerk = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return res.status(500).json({ error: "Falta configurar CLERK_WEBHOOK_SECRET en .env" });
    }

    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: "Faltan los headers de Svix" });
    }

    const payload = req.body.toString('utf8');

    let evt;

    try {
        const wh = new Webhook(WEBHOOK_SECRET);
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error('Error verificando webhook de Clerk:', err.message);
        return res.status(400).json({ error: 'Firma de webhook inválida' });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    try {
        if (eventType === 'user.created' || eventType === 'user.updated') {

            const email = evt.data.email_addresses[0].email_address;
            
            const nombre = `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim();

            await usuarioService.guardarUsuario(id, email, nombre);

        } else if (eventType === 'user.deleted') {
            await usuarioService.eliminarUsuario(id);
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error guardando usuario en BD:', error);
        return res.status(500).json({ error: 'Error interno del servidor al procesar evento' });
    }
};