import express from "express";
import {
    crearEvento,
    obtenerEventos,
    obtenerEventoPorId
} from "../controllers/EventoController.js";
import { validarCreacionEvento } from "../middlewares/EventoValidator.js";

const router = express.Router();

router.get("/", obtenerEventos);
router.get("/:id", obtenerEventoPorId); 
router.post("/", validarCreacionEvento, crearEvento);
//Aca iria la ruta para el put de actualizar eventos

export default router;