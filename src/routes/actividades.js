import { Router } from "express";
/**
 * rutas peticiones 
 */
import {registraActividad, consultaActividad, actualizarActividad, eliminarActividad} from "../controllers/10-actividad-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'actividades';
/**
 * Rutas
 */
router.post(`/registro`, sesionExistente, registraActividad);
router.post(`/consulta`, sesionExistente, consultaActividad);
router.put(`/actualizar`, sesionExistente, actualizarActividad);
router.delete(`/eliminar`, sesionExistente, eliminarActividad);

// export default router;
module.exports = router;