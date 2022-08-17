import { conexion } from "../database";

/**
 * controladores tag
 */

/**
 * controlador para registrar un tag
 */
export const registraTag = async (peticion, respuesta) => {
  try {
    console.log("Registrando tag");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla tag que registra tag
    const [resultado] = await objetoConexion.query(
      "INSERT INTO tag (descripcion) VALUES (?)",
      [peticion.body.descripcion]
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
 * controlador para consultar información de un tag
 */
export const consultaTag = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta tag");
    const idTag = parseInt(peticion.body.idTag);
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla tag que trae los datos del tag 
    const [resultado] = await objetoConexion.query(
      "SELECT * FROM tag WHERE idTag = ?",
      [idTag]
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
 * controlador para actualizar información de un tag
 */
export const actualizarTag = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla tag que actualiza tag
    const [resultado] = await objetoConexion.query(
      "UPDATE tag SET descripcion=? WHERE idTag=?",
      [peticion.body.descripcion, peticion.body.idTag]
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
 * controlador para eliminar información de un tag
 */
export const eliminarTag = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando eliminacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla tag que elimina tag
    const [resultado] = await objetoConexion.query(
      "DELETE FROM tag WHERE idTag =?",
      [peticion.body.idTag]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
