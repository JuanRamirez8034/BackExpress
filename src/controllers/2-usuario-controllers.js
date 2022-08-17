import { conexion } from "../database";
import md5 from "md5";
/**
 * controladores usuario
 */

/**
 * controlador para consultar los datos de inicio de sesion (usuario/correo y contraseña)
 */
export const consultaDatosSesionInicio = async (peticion, respuesta) => {
  try {
    //si los datos estan vacios o no enviados retornar
    if (
      peticion.body.usuario == "" ||
      peticion.body.usuario == undefined ||
      peticion.body.contrasena == "" ||
      peticion.body.contrasena == undefined
    ) {
      console.log("Datos indefinidos o vacios");
      respuesta.json({ Error: "Datos vacios o indefinidos" });
      return;
    }
    // contando la cantidad de usuario con datos similares
    console.log("Realizando consulta datos inicio seseion");
    // encriptando la contraseña para realizar solicitud
    const contrasenaMD5 = md5(peticion.body.contrasena);
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();

    // Consulta en la tabla usuario que consigue usuario repetidos
    const [resultadoConteo] = await objetoConexion.query(
      "SELECT COUNT(idUsuario) AS cantidad FROM usuario WHERE usuario = ? AND contrasena = ?",
      [peticion.body.usuario, contrasenaMD5]
    );
    console.log(resultadoConteo[0].cantidad);
    // si hay usuarios retornar idUsuario
    if (resultadoConteo[0].cantidad == 1) {
      // Consulta en la tabla usuario que consigue el idPersona del usuario
      const [resultado] = await objetoConexion.query(
        "SELECT persona_idPersona FROM usuario WHERE usuario = ? AND contrasena = ?",
        [peticion.body.usuario, contrasenaMD5]
      );
      console.log(resultado[0]);
      respuesta.json(resultado[0]);
    } else {
      console.log("No existe el usuario o los datos están equivocados");
      respuesta.json({
        respuesta: "No existe el usuario o los datos están equivocados",
      });
    }
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

/**
 * controlador para consular datos de usuario (todos exceptos la ontraseña)
 */
export const consultaDatosUsuario = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando consulta que obtiene la información del usuario");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    // Consulta en la tabla usuario que consigue usuario y correo por idPersona
    const [resultado] = await objetoConexion.query(
      "SELECT usuario, correo FROM usuario WHERE persona_idPersona  = ?",
      [idPersona]
    );
    console.log(resultado[0]);
    respuesta.json(resultado[0]);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log(
      "Error durante la consulta para obtener la información del usuario\n" +
        e.message
    );
    respuesta.json({
      "Error durante la consulta para obtener la información del usuario":
        e.message,
    });
  }
};

/**
 * controlador para actualizar datos  usuario/correo
 */
export const actualizarUsuario = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion del usuario");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    // Consulta en la tabla usuario que actualiza usuario y correo por idPersona
    const [resultado] = await objetoConexion.query(
      "UPDATE usuario SET usuario = ?, correo = ? WHERE persona_idPersona = ?",
      [peticion.body.usuario, peticion.body.correo, idPersona]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al actualizar usuario\n" + e.message);
    respuesta.json({ "Error durante la actualizacion del usuario": e.message });
  }
};

/**
 * controlador para actualizar la contraseña del usuario
 */
export const actualizarContrasenaUsuario = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // encriptando la contraseña para realizar solicitud
    const contrasenaMD5 = md5(peticion.body.contrasena);
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    // Consulta en la tabla usuario que actualiza contrasena por idPersona y correo
    const [resultado] = await objetoConexion.query(
      "UPDATE usuario SET contrasena = ? WHERE correo = ? AND persona_idPersona = ?",
      [contrasenaMD5, peticion.body.correo, idPersona]
    );
    if (resultado.affectedRows === 0) {
      console.log(resultado);
      respuesta.json({ actualizacion: false, resultado });
      return;
    }
    console.log(resultado);
    respuesta.json({ actualizacion: true, resultado });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al actualizar\n" + e.message);
    // respuesta.json({"Error durante la actualizacion": e.message});
  }
};

/**
 * controlador para eliminar uasuarios
 */
export const eliminarUsuario = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando eliminacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // encriptando la contraseña para realizar solicitud
    const contrasenaMD5 = md5(peticion.body.contrasena);
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    // Consulta en la tabla usuario que elimina usuario por correo, contrasena y por idPersona 
    const [resultado] = await objetoConexion.query(
      "DELETE FROM usuario WHERE correo = ? AND contrasena = ? AND persona_idPersona =?",
      [peticion.body.correo, contrasenaMD5, idPersona]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
