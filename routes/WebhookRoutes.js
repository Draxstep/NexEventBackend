import express from 'express';
import { recibirWebhookClerk } from '../controllers/WebHookController.js';

const router = express.Router();

router.post('/clerk', express.raw({ type: 'application/json' }), recibirWebhookClerk);

export default router;