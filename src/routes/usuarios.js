import { Router } from "express";
/**
 * rutas peticiones 
 */
import {consultaDatosSesionInicio, consultaDatosUsuario, actualizarUsuario, actualizarContrasenaUsuario,eliminarUsuario} from "../controllers/2-usuario-controllers";
import {sesionExistente, datosCorrectos} from "../assets/permisos-peticiones";
const router = Router();
const path = 'usuarios';
/**
 * Rutas
 */

router.post(`/consulta-inicio-sesion`, consultaDatosSesionInicio);
router.post(`/consulta/id`, sesionExistente, consultaDatosUsuario);
router.put(`/actualizar`, datosCorrectos, sesionExistente,
 actualizarUsuario);
router.post(`/actualizar-contrasena`, actualizarContrasenaUsuario);
router.delete(`/eliminar`, sesionExistente, eliminarUsuario);


// export default router;
module.exports = router;