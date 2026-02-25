import express from "express";
import {
    crearEvento,
    obtenerEventos,
    obtenerEventoPorId,
    actualizarEvento,
    cambiarEstadoEvento,
    obtenerEventosActivos
} from "../controllers/EventoController.js";
import { validarCreacionEvento } from "../middlewares/EventoValidator.js";

const router = express.Router();

router.get("/", obtenerEventos); 
router.get("/activos", obtenerEventosActivos); 
router.post("/", validarCreacionEvento, crearEvento);
router.get("/:id", obtenerEventoPorId); 
router.put("/:id", validarCreacionEvento, actualizarEvento);
router.patch("/:id/estado", cambiarEstadoEvento); 

export default router;