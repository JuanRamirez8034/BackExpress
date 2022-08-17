import { Router } from "express";
/**
 * rutas peticiones 
 */
import {registraNota, consultaNota, actualizarNota, eliminarNota} from "../controllers/11-nota-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'notas';
/**
 * Rutas
 */
router.post(`/registro`, sesionExistente, registraNota);
router.get(`/consulta`, sesionExistente, consultaNota);
router.put(`/actualizar`, sesionExistente, actualizarNota);
router.delete(`/eliminar`, sesionExistente, eliminarNota)


module.exports = router;
//export default router;