import { Router } from "express";
/**
 * rutas peticiones 
 */
import {registraProyectoTag, consultaProyectoTag, actualizarProyectoTag, eliminarProyectoTag} from "../controllers/9-proyecto_tags-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'proyecto-tags';
/**
 * Rutas
 */
router.post(`/registro`, sesionExistente, registraProyectoTag);
router.get(`/consulta`, sesionExistente, consultaProyectoTag);
router.put(`/actualizar`, sesionExistente, actualizarProyectoTag);
router.delete(`/eliminar`, sesionExistente, eliminarProyectoTag);


// export default router;
module.exports = router;