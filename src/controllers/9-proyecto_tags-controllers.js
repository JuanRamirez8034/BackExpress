import { conexion } from "../database";

/**
 * controladores proyecto_tags
 */

/**
 * controlador para registrar un tag de proyecto
 */
export const registraProyectoTag = async (peticion, respuesta) => {
  let idTag = undefined;
  try {
    console.log("Registrando tag");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
    const [resultado] = await objetoConexion.query(
      "INSERT INTO tag (descripcion) VALUES (?)",
      [peticion.body.descripcion]
    );
    console.log(resultado);
    idTag = resultado.insertId;
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al registrar recordatorio\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
    return;
  }
  try {
    console.log("Registrando relacion tag de proyecto");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
    const [resultado] = await objetoConexion.query(
      "INSERT INTO proyecto_tags (tag_idTag, proyecto_idProyecto) VALUES (?,?)",
      [idTag, peticion.body.proyecto_idProyecto]
    );
    respuesta.json({ registro: true, resultado });
    console.log(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al registrar relacion tag de proyecto\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para consultar un tag de proyecto
 */
export const consultaProyectoTag = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta tags proyecto");
    const idProyecto = parseInt(peticion.body.idProyecto);
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
    const [resultado] = await objetoConexion.query(
      "SELECT proyecto_tags.tag_idTag, proyecto_tags.proyecto_idProyecto , tag.descripcion FROM proyecto_tags INNER JOIN tag ON tag.idTag = proyecto_tags.tag_idTag INNER JOIN proyecto WHERE proyecto_tags.proyecto_idProyecto = proyecto.idProyecto AND proyecto.idProyecto = ?",
      [idProyecto]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante la consulta\n");
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

/**
 * controlador para actualizar un tag de proyecto
 */
export const actualizarProyectoTag = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
    const [resultado] = await objetoConexion.query(
      "UPDATE proyecto_tags SET tag_idTag=?, proyecto_idProyecto=? WHERE id_proyecto_tag=?",
      [
        peticion.body.idTag,
        peticion.body.idProyecto,
        peticion.body.idProyectoTag,
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
 * controlador para eliminar un tag de proyecto
 */
export const eliminarProyectoTag = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando eliminacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    const [resultado] = await objetoConexion.query(
      "DELETE FROM proyecto_tags WHERE id_proyecto_tag =? AND proyecto_idProyecto",
      [peticion.body.idProyectoTag, peticion.body.idProyecto]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
