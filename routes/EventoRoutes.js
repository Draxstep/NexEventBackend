import express from "express";
import {
    crearEvento,
    obtenerEventos,
    obtenerEventoPorId,
    actualizarEvento
} from "../controllers/EventoController.js";
import { validarCreacionEvento } from "../middlewares/EventoValidator.js";

const router = express.Router();

router.post("/", validarCreacionEvento, crearEvento);
router.get("/", obtenerEventos);
router.get("/:id", obtenerEventoPorId); 
router.put("/:id", validarCreacionEvento, actualizarEvento);

export default router;