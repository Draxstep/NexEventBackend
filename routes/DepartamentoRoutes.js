import express from "express";
import { 
    crearDepartamento, 
    obtenerDepartamentos, 
    obtenerCiudadesPorDepartamento 
} from "../controllers/DepartamentoController.js";
import { validarCreacionDepartamento } from "../middlewares/DepartamentoValidator.js";

const router = express.Router();

router.get("/", obtenerDepartamentos); 
router.post("/", validarCreacionDepartamento, crearDepartamento); 
router.get("/:id/ciudades", obtenerCiudadesPorDepartamento);

export default router;