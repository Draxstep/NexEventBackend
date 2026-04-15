import express from "express";
import {
    crearEvento,
    obtenerEventos,
    obtenerEventoPorId,
    actualizarEvento,
    cambiarEstadoEvento,
    obtenerEventosActivos,
    obtenerEventosCancelados,
    obtenerEventosCompletados,
    completarEventosPasados
} from "../controllers/EventoController.js";
import { validarCreacionEvento, validarCambioEstadoEvento } from "../middlewares/EventoValidator.js";
import { uploadImagen } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", obtenerEventos); 
router.get("/activos", obtenerEventosActivos); 
router.get("/cancelados", obtenerEventosCancelados); 
router.get("/completados", obtenerEventosCompletados); 
router.patch("/completar-pasados", completarEventosPasados);
router.post("/", uploadImagen.single('imagen'), validarCreacionEvento, crearEvento);
router.get("/:id", obtenerEventoPorId); 
router.put("/:id", uploadImagen.single('imagen'), validarCreacionEvento, actualizarEvento);
router.patch("/:id/estado", validarCambioEstadoEvento, cambiarEstadoEvento); 
export default router;