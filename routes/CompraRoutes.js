import express from "express";
import {
    procesarCompra,
    obtenerDetalleCompra,
    obtenerHistorialComprasUsuario
} from "../controllers/CompraController.js";
import {
    validarProcesarCompra,
    validarCompraIdParam,
    validarUsuarioIdParam
} from "../middlewares/CompraValidator.js";

const router = express.Router();

router.post("/", validarProcesarCompra, procesarCompra);
router.get("/usuario/:usuario_id/historial", validarUsuarioIdParam, obtenerHistorialComprasUsuario);
router.get("/:compra_id", validarCompraIdParam, obtenerDetalleCompra);

export default router;