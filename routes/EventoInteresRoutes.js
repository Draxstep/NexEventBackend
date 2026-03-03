import express from 'express';
import { 
    registrarInteres, 
    obtenerConteoIntereses,
    isUserInterested
} from '../controllers/EventoInteresController.js';

const router = express.Router();

router.post('/', registrarInteres);
router.get('/evento/:evento_id/conteo', obtenerConteoIntereses);
router.get('/evento/:evento_id/verificar/:usuario_id', isUserInterested);

export default router;