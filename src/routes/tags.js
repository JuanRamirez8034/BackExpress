import { Router } from "express";
/**
 * rutas peticiones 
 */
import {registraTag, consultaTag, actualizarTag, eliminarTag} from "../controllers/7-tag-controllers";
import {sesionExistente} from "../assets/permisos-peticiones";
const router = Router();
const path = 'tags';
/**
 * Rutas
 */
router.post(`/registro`, sesionExistente, registraTag);
router.get(`/consulta`, sesionExistente, consultaTag);
router.put(`/actualizar`, sesionExistente, actualizarTag);
router.delete(`/eliminar`, sesionExistente, eliminarTag);


// export default router;
module.exports = router;