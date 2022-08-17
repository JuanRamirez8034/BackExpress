import { conexion } from "../database";

/**
 * controladores  recordatorio
 */

/**
 * controlador para registrar recordatorio, tabla recordatorio
 */
export const registraRecordatorio = async (peticion, respuesta) => {
  try {
    console.log("Registrando recordatorio");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla recordatorio que registra recordatorio
    const [resultado] = await objetoConexion.query(
      "INSERT INTO recordatorio (descripcion, fechaInicio, fechaFin, estado, persona_idPersona) VALUES (?,?,?,?,?)",
      [
        peticion.body.descripcion,
        peticion.body.fechaInicio,
        peticion.body.fechaFin,
        peticion.body.estado,
        idPersona,
      ]
    );
    respuesta.json({ registro: true, resultado });
    console.log(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al registrar recordatorio\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para consultar recordatorio, tabla recordatorio
 */
export const consultaRecordatorio = async (peticion, respuesta) => {
  try {
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    console.log("Realizando consulta recordatorio");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla recordatorio que trae los datos de todos los recordatorios de una persona ordenado por fecha asc
    const [resultado] = await objetoConexion.query(
      "SELECT * FROM recordatorio WHERE persona_idPersona = ? ORDER BY fechaFin ASC",
      [idPersona]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta del recordatorio": e.message });
  }
};

/**
 * controlador para actualizar recordatorio, tabla recordatorio
 */
export const actualizarRecordatorio = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla recordatorio que actualiza recordatorio
    const [resultado] = await objetoConexion.query(
      "UPDATE recordatorio SET descripcion=?, fechaInicio=?, fechaFin=?, estado=? WHERE persona_idPersona =? AND idRecordatorio =?",
      [
        peticion.body.descripcion,
        peticion.body.fechaInicio,
        peticion.body.fechaFin,
        peticion.body.estado,
        idPersona,
        peticion.body.idRecordatorio,
      ]
    );
    console.log(resultado);
    respuesta.json({ resultado });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al actualizar\n" + e.message);
    respuesta.json({ "Error durante la actualizacion": e.message });
  }
};

/**
 * controlador para eliminar recordatorio, tabla recordatorio
 */
export const eliminarRecordatorio = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando eliminacion del recordatorio");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    console.log(peticion.body);
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla recordatorio que elimina recordatorio
    const [resultado] = await objetoConexion.query(
      "DELETE FROM recordatorio WHERE idRecordatorio =? AND persona_idPersona =?",
      [peticion.body.idRecordatorio, idPersona]
    );
    if (resultado.affectedRows === 0) {
      respuesta.json({ resultado: false, info: resultado });
      return;
    }
    console.log({ resultado: true, info: resultado });
    respuesta.json({ resultado: true, info: resultado });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar recordatorio": e.message });
  }
};
