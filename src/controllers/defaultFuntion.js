import md5 from "md5";

export const funtionDefaultConsole=()=>console.log('Funcion por defecto :)', md5('12345789'));

export const sesionExistente = async (peticion, respuesta, next) =>{
    try {
        // sesion debe ser True boolean para realizar la consulta // idSesion es idPersona
        if(peticion.body.sesion =="" || peticion.body.sesion == undefined || peticion.body.sesion !== true){
            console.log('Error de sesion');
            respuesta.json({"Error":"Sesion no existente, error de sesion"});
            return;
        }
        console.log('Sesion valida');
        next();
    } catch (e) {
        // respuestas en caso de errores durante la ejecucion de las peticiones
        console.log('Error: '+e.message);
        respuesta.json({"Error":e.message});
        return;
    }
}