import express from "express";
import departamentosRoutes from "./DepartamentoRoutes.js";

const router = express.Router();

router.use("/departamentos", departamentosRoutes);

export default router;