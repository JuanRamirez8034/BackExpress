import { conexion } from "../database";

/**
 * controladores reordatorio_tags
 */

/**
 * controlador para registrar recordatorio tag, tabla recordatorio tag
 */
export const registraRecordatorioTag = async (peticion, respuesta) => {
  try {
    console.log("Registrando relacion recordatorio tgas");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla recordatorio_tags que registra recordatorio_tags
    const [resultado] = await objetoConexion.query(
      "INSERT INTO recordatorio_tags (tag_idTag, recordatorio_idRecordatorio) VALUES (?,?)",
      [peticion.body.tag_idTag, peticion.body.recordatorio_idRecordatorio]
    );
    respuesta.json({ registro: true, resultado });
    console.log(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al registrar relacion recordatorio tags\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para contar recordatorio tag, tabla recordatorio tag
 */
export const consultaRecordatorioTag = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta tag recordatorio");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla recordatorio_tags
    const [resultado] = await objetoConexion.query(
      "SELECT recordatorio_tags.* FROM recordatorio_tags INNER JOIN recordatorio WHERE recordatorio_tags.recordatorio_idRecordatorio = recordatorio.idRecordatorio AND recordatorio.idRecordatorio = ?",
      [peticion.body.idRecordatorio]
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
 * controlador para actualizar recordatorio tag, tabla recordatorio tag
 */
export const actualizarRecordatorioTag = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla recordatorio_tags que actualiza recordatorio_tags
    const [resultado] = await objetoConexion.query(
      "UPDATE recordatorio_tags SET tag_idTag=?, recordatorio_idRecordatorio=? WHERE id_recordatorio_tags=?",
      [
        peticion.body.tag_idTag,
        peticion.body.idRecordatorio,
        peticion.body.idRecordatorioTag,
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

export const eliminarRecordatorioTag = async (peticion, respuesta) => {
  try {
    
    console.log("Ejecutando eliminacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla recordatorio_tags que elimina recordatorio_tags
    const [resultado] = await objetoConexion.query(
      "DELETE FROM recordatorio_tags WHERE id_recordatorio_tags =? AND recordatorio_idRecordatorio =?",
      [peticion.body.idRecordatorioTag, peticion.body.idRecordatorio]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
