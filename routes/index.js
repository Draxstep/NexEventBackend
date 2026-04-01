import express from "express";
import departamentosRoutes from "./DepartamentoRoutes.js";
import categoriasRoutes from "./CategoriaRoutes.js";
import tipoEntradaRoutes from "./TipoEntradaRoutes.js";
import eventosRoutes from "./EventoRoutes.js";
import eventoInteresRoutes from "./EventoInteresRoutes.js";
import eventoTipoEntradaRoutes from "./EventoTipoEntradaRoutes.js";
import boletoRoutes from "./BoletoRoutes.js";
import compraRoutes from "./CompraRoutes.js";

const router = express.Router();

router.use("/departamentos", departamentosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/tipos-entrada", tipoEntradaRoutes);
router.use("/eventos", eventosRoutes);
router.use("/intereses", eventoInteresRoutes);
router.use("/evento-tipos-entrada", eventoTipoEntradaRoutes);
router.use("/boletos", boletoRoutes);
router.use("/compras", compraRoutes);

export default router;