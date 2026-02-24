import express from "express";
import {
    crearEvento,
    obtenerEventos
} from "../controllers/EventoController.js";
import { validarCreacionEvento } from "../middlewares/EventoValidator.js";

const router = express.Router();

router.get("/", obtenerEventos);
router.get("/:id", obtenerEventos); 
router.post("/", validarCreacionEvento, crearEvento);
//Aca iria la ruta para el put de actualizar eventos

export default router;