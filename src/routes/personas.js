import { Router } from "express";
/**
 * rutas peticiones 
 */
import { registraPersona, consultaDatosPersona, consultaAllDatosPersona, elimiarPersona, actualizarPersona } from "../controllers/1-persona-controllers";
import {sesionExistente, datosCorrectos} from "../assets/permisos-peticiones";
const router = Router();
const path = 'personas';

/**
 * Rutas
 */
router.get(`/`, function(req, res) {
    res.send('Hola mundo')
});
router.post(`/registro`, datosCorrectos, registraPersona);
router.post(`/consulta-datos`, sesionExistente, consultaDatosPersona);
router.post(`/consulta/datos/all`, sesionExistente, consultaAllDatosPersona);
router.put(`/actualizar`,datosCorrectos, sesionExistente, actualizarPersona)
router.delete(`/eliminar`, sesionExistente, elimiarPersona);


// export default router;
module.exports = router;