import express from "express";
import departamentosRoutes from "./DepartamentoRoutes.js";
import categoriasRoutes from "./CategoriaRoutes.js";
import tipoEntradaRoutes from "./TipoEntradaRoutes.js";
import eventosRoutes from "./EventoRoutes.js";
import eventoInteresRoutes from "./EventoInteresRoutes.js";

const router = express.Router();

router.use("/departamentos", departamentosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/tipos-entrada", tipoEntradaRoutes);
router.use("/eventos", eventosRoutes);
router.use("/intereses", eventoInteresRoutes);

export default router;