/**
 * Funciones para validar datos y parametros
*/

/**
 * funcion para validar correos
*/
export const validarCorreo = (correo) => {
    //constructor expresion regular
    const expresion = /^[\w-_.+]+@[\w-_]+\.[a-zA-Z]{2,5}$/i;
    return expresion.test(correo);
}

/**
 * funcion para validar contraseña
*/
export const validarContrasena = (contrasena) => {
    // minimo 7 caracteres
    if (contrasena.length < 7) {
        return { "contrasena": "No contiene min 7 caracteres" };
    }
    //minusculas 1
    let expresion = /[a-z]/;
    let resultado = expresion.test(contrasena);
    if (!resultado) {
        return { "contrasena": "No contiene minúsculas" };
    }
    //mayusculas 1
    expresion = /[A-Z]/;
    resultado = expresion.test(contrasena);
    if (!resultado) {
        return { "contrasena": "No contiene mayúsculas" };
    }
    //numeros 1
    expresion = /[0-9]/;
    resultado = expresion.test(contrasena);
    if (!resultado) {
        return { "contrasena": "No contiene números" };
    }
    //caracter especial 1
    expresion = /[^a-zA-Z0-9\s:;,`\{\}\[\]\'\"\º\<\>]/;
    resultado = expresion.test(contrasena);
    if (!resultado) {
        return { "contrasena": "No contiene caracter especial (-_*+$#.)" };
    }
    //sin espacios
    expresion = /[\s]/;
    resultado = expresion.test(contrasena);
    if (resultado) {
        return { "contrasena": "No puede contener espacios" };
    }
    //todo bien
    return true;
}

/**
 * funcion para validar nombres
*/
export const validarNombreApellido = (nombreApellido) => {
    //constructor expresion regular (solo letras y espacios)
    const expresion = /[^a-zA-Záéíóúäëïöüàèìòù ]/i;
    return (!expresion.test(nombreApellido));
}

/**
 * funcion para validar fechas
*/
export const validarFecha = (fecha) => {
    // expresion formatos permitidos 0000-00-00 0000/00/00 0000.00.00
    const expresion = /^\d{4}([\-/.])(0?[1-9]|1[0-2])\1(3[01]|[12][0-9]|0?[1-9])$/i;
    return expresion.test(fecha);
}

/**
 * funcion para validar datos pasados a traves de un objeto
 * se reutilizan las funciones definidas anteriormente 
*/
export const validarDatosRegistroPersona = (objetoSolicitud = 0) => {

    if (objetoSolicitud.nombrePersona != undefined && !validarNombreApellido(objetoSolicitud.nombrePersona)) {

        return { "result": false, "alerta": "Nombre solo debe contener letras" };
    }

    if (objetoSolicitud.apellidoPersona != undefined && !validarNombreApellido(objetoSolicitud.apellidoPersona)) {

        return { "result": false, "alerta": "Apellido solo debe contener letras" };
    }

    if (objetoSolicitud.fechaNacimiento != undefined && !validarFecha(objetoSolicitud.fechaNacimiento)) {

        return { "result": false, "alerta": "Fecha nacimiento inválida" };
    }
    if (objetoSolicitud.fechaInicio != undefined && !validarFecha(objetoSolicitud.fechaInicio)) {

        return { "result": false, "alerta": "Fecha inicio inválida" };
    }
    if (objetoSolicitud.fechaFin != undefined && !validarFecha(objetoSolicitud.fechaFin)) {

        return { "result": false, "alerta": "Fecha fin inválida" };
    }

    if (objetoSolicitud.correo != undefined && !validarCorreo(objetoSolicitud.correo)) {

        return { "result": false, "alerta": "Formato de correo no válido" };
    }

    if (objetoSolicitud.contrasena != undefined && validarContrasena(objetoSolicitud.contrasena) != true) {

        var resul = validarContrasena(objetoSolicitud.contrasena);
        return { "result": false, "alerta": resul.contrasena };
    }

    return { "result": true };
}