import { conexion } from "../database";
/**
 * controladores nota
 */

/**
 * controlador para registrar una nota
 */
export const registraNota = async (peticion, respuesta) => {
  try {
    console.log("Registrando nota");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
    const [resultado] = await objetoConexion.query(
      "INSERT INTO nota (descripcion, actividad_idActividad) VALUES (?,?)",
      [peticion.body.descripcion, peticion.body.actividad_idActividad]
    );
    respuesta.json({ registro: true, resultado });
    console.log(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al registrar nota\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para registrar una nota
 */
export const consultaNota = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta Nota");
    const idActividad = parseInt(peticion.body.idActividad);
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
    const [resultado] = await objetoConexion.query(
      "SELECT nota.* FROM nota INNER JOIN actividad WHERE nota.actividad_idActividad = actividad.idActividad AND actividad.idActividad = ?",
      [idActividad]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

/**
 * controlador para actualizar una nota
 */
export const actualizarNota = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
    const [resultado] = await objetoConexion.query(
      "UPDATE nota SET descripcion=? WHERE actividad_idActividad=? AND idNota=?",
      [
        peticion.body.descripcion,
        peticion.body.idActividad,
        peticion.body.idNota,
      ]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al actualizar\n" + e.message);
    respuesta.json({ "Error durante la actualizacion": e.message });
  }
};

/**
 * controlador para eliminar una nota
 */
export const eliminarNota = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando eliminacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    const [resultado] = await objetoConexion.query(
      "DELETE FROM nota WHERE idNota =? AND actividad_idActividad =?",
      [peticion.body.idNota, peticion.body.idActividad]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
