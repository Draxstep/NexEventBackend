import express from "express";
import departamentosRoutes from "./DepartamentoRoutes.js";
import categoriasRoutes from "./CategoriaRoutes.js";
import eventosRoutes from "./EventoRoutes.js";

const router = express.Router();

router.use("/departamentos", departamentosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/eventos", eventosRoutes);

export default router;