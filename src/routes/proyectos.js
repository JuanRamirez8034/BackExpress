import { Router } from "express";
/**
 * rutas peticiones 
 */
import {registraProyecto, consultaProyecto, actualizarProyecto, eliminarProyecto} from "../controllers/8-proyecto-controllers";
import {sesionExistente, datosCorrectos} from "../assets/permisos-peticiones";
const router = Router();
const path = 'proyectos';
/**
 * Rutas
 */
router.post(`/registro`, sesionExistente, registraProyecto);
router.post(`/consulta`, sesionExistente, consultaProyecto);
router.put(`/actualizar`, sesionExistente, actualizarProyecto);
router.delete(`/eliminar`, sesionExistente, eliminarProyecto);


// export default router;
module.exports = router;