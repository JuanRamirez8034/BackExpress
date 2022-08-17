import { Router } from "express";
/**
 * rutas peticiones 
 */
import {registraRecordatorio, consultaRecordatorio, actualizarRecordatorio, eliminarRecordatorio} from "../controllers/5-recordatorio-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'recordatorios';
/**
 * Rutas
 */
router.post(`/registro`, sesionExistente, registraRecordatorio);
router.post(`/consulta`, sesionExistente, consultaRecordatorio);
router.put(`/actualizar`, sesionExistente, actualizarRecordatorio);
router.delete(`/eliminar`, sesionExistente, eliminarRecordatorio);

// export default router;
module.exports = router;