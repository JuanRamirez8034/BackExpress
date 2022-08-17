import { Router } from "express";
/**
 * rutas peticiones 
 */
import {registraRecordatorioTag, consultaRecordatorioTag, actualizarRecordatorioTag, eliminarRecordatorioTag} from "../controllers/6-recordatorio_tag-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'recordatorio-tags';
/**
 * Rutas
 */
router.post(`/registro`, sesionExistente, registraRecordatorioTag);
router.get(`/consulta`, sesionExistente, consultaRecordatorioTag);
router.put(`/actualizar`, sesionExistente, actualizarRecordatorioTag);
router.delete(`/eliminar`, sesionExistente, eliminarRecordatorioTag);


// export default router;
module.exports = router;