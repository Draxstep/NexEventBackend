import express from "express";
import {
    generarBoletos,
    validarAcceso,
    cancelarBoleto
} from "../controllers/BoletoController.js";
import {
    validarGeneracionBoletos,
    validarCodigoQrBoleto,
    validarBoletoIdParam
} from "../middlewares/BoletoValidator.js";

const router = express.Router();

router.post("/generar", validarGeneracionBoletos, generarBoletos);
router.post("/validar-acceso", validarCodigoQrBoleto, validarAcceso);
router.patch("/:boleto_id/cancelar", validarBoletoIdParam, cancelarBoleto);

export default router;