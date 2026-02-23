import express from "express";
import {
    crearEvento
} from "../controllers/EventoController.js";
import { validarCreacionEvento } from "../middlewares/EventoValidator.js";

const router = express.Router();

//Aca iria la ruta para el get de obtener eventos
router.post("/", validarCreacionEvento, crearEvento);
//Aca iria la ruta para el put de actualizar eventos

export default router;