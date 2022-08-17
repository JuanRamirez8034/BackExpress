/**
 * Funiones para validar las peticones, si no contiene las caracteristicas apropiadas no puede continuar
*/

import { validarDatosRegistroPersona } from "./validador";

export const sesionExistente = async (peticion, respuesta, next) =>{
    try {
        // sesion debe ser True boolean para realizar la consulta 
        // idSesion es idPersona
        if(peticion.body.sesion =="" || peticion.body.sesion == undefined || peticion.body.sesion !== true){
            console.log('Error de sesion');
            respuesta.json({"Error":"Sesion no existente, error de sesion"});
            return;
        }
        console.log('Sesion valida');
        // si todo va bien, permitir la ejecucion de la otra peticion
        next();
    } catch (e) {
        // respuestas en caso de errores durante la ejecucion de las peticiones
        console.log('Error: '+e.message);
        respuesta.json({"Error":e.message});
        return;
    }
}

export const datosCorrectos = async (peticion, respuesta, next) =>{
    try {
        // retorna true/false --> se le pasa un objeto de elementos
        let result = validarDatosRegistroPersona(peticion.body);
        if(!result.result){
            console.log(result.alerta);
            respuesta.json({"Error":"formato de datos inválido", "alerta":result.alerta});
            return;
        }
        // si todo va bien, permitir la ejecucion de la otra peticion
        next();
    } catch (e) {
        // respuestas en caso de errores durante la ejecucion de las peticiones
        console.log('Error: '+e.message);
        respuesta.json({"Error":e.message});
        return;
    }
}