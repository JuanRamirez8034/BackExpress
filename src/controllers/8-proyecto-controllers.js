import { conexion } from "../database";

/**
 * controladores proyecto
 */

/**
 * controlador para registrar un proyecto
 */
export const registraProyecto = async (peticion, respuesta) => {
  try {
    console.log("Registrando proyecto");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla proyecto que registra proyecto
    const [resultado] = await objetoConexion.query(
      "INSERT INTO proyecto (descripcion, monto, fechaInicio, fechaFin, estado, persona_idPersona) VALUES (?,?,?,?,?,?)",
      [
        peticion.body.descripcion,
        peticion.body.monto,
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
    console.log("Error al registrar proyecto\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para consultar un proyecto
 */
export const consultaProyecto = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta Proyecto");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla proyecto que trae todos los datos de un proyecto por idPersona y ordenado por fechaFin
    const [resultado] = await objetoConexion.query(
      "SELECT * FROM proyecto WHERE proyecto.persona_idPersona = ? ORDER BY proyecto.fechaFin ASC",
      [idPersona]
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
 * Controlador para actualizar un proyecto
 */
export const actualizarProyecto = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion del proyecto");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla proyecto que actualiza proyecto
    const [resultado] = await objetoConexion.query(
      "UPDATE proyecto SET descripcion=?, monto=?, fechaInicio=?, fechaFin=?, estado=? WHERE persona_idPersona =? AND idProyecto=?",
      [
        peticion.body.descripcion,
        peticion.body.monto,
        peticion.body.fechaInicio,
        peticion.body.fechaFin,
        peticion.body.estado,
        idPersona,
        peticion.body.idProyecto,
      ]
    );
    console.log(resultado);
    respuesta.json({ resultado: true, info: resultado });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al actualizar\n" + e.message);
    respuesta.json({
      "Error durante la actualizacion del proyecto": e.message,
    });
  }
};

/**
 * controlador para eliminar un proyecto
 */
export const eliminarProyecto = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando eliminacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);

    try {
      // Primero se elimina el ingreso existe de ese idProyecto (si es que existe)
      const [resultadoIngreso] = await objetoConexion.query(
        "DELETE FROM registros_ingresos WHERE proyecto_idProyecto =? AND persona_idPersona =?",
        [peticion.body.idProyecto, idPersona]
      );
    } catch (e) {
      console.log("Error al eliminar Ingreso del Proyecto\n" + e.message);
    }

    // Luego...
    // Consulta en la tabla proyecto que elimina proyecto
    const [resultado] = await objetoConexion.query(
      "DELETE FROM proyecto WHERE idProyecto =? AND persona_idPersona =?",
      [peticion.body.idProyecto, idPersona]
    );

    console.log(resultado);
    respuesta.json({ resultado: true, info: resultado });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
