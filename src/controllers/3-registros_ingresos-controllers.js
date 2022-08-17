import { conexion } from "../database";

/**
 * controladores ingresos
 */

/**
 * controlador para registrar ingresos, tabla ingresos
 */
export const registraIngreso = async (peticion, respuesta) => {
  try {
    console.log("Registrando ingreso");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    // Consulta en la tabla registros_ingresos que registra ingreso
    const [resultado] = await objetoConexion.query(
      "INSERT INTO registros_ingresos (motivo, monto, fecha, proyecto_idProyecto, persona_idPersona) VALUES (?,?,?,?,?)",
      [
        peticion.body.motivo,
        peticion.body.monto,
        peticion.body.fecha,
        peticion.body.proyecto_idProyecto,
        idPersona,
      ]
    );
    respuesta.json({ registro: true });

    console.log(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante registro Ingreso\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para consultar ingreso, tabla ingreso
 */
export const consultaIngresos = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta ingresos");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    let resultado;

    if (peticion.body.tipo == "Diario") {
      [resultado] = await objetoConexion.query(
        "SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE (DAY(fecha) = DAY(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );
    } else if (peticion.body.tipo == "Mensual") {
      [resultado] = await objetoConexion.query(
        "SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );
    } else if (peticion.body.tipo == "Anual") {
      [resultado] = await objetoConexion.query(
        "SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE (YEAR(fecha) = YEAR(?)) AND persona_idPersona = ? ORDER BY fecha DESC",
        [peticion.body.fecha, idPersona]
      );
    }

    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log(
      "Error durante la consulta de registros de ingresos\n" + e.message
    );
    respuesta.json({
      "Error durante la consulta de registros de ingresos": e.message,
    });
  }
};

/**
 * controlador para consultar ingresos por rangos, tabla ingresos
 */
export const consultaIngresosRango = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta ingresos por rango");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
    const [resultado] = await objetoConexion.query(
      "SELECT motivo, monto, fecha, proyecto_idProyecto, persona_idPersona FROM registros_ingresos WHERE (DATE(fecha) BETWEEN ? AND ?) AND persona_idPersona = ?",
      [peticion.body.fechaInicio, peticion.body.fechaFin, idPersona]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log(
      "Error durante la consulta de registros de ingresos\n" + e.message
    );
    respuesta.json({
      "Error durante la consulta de registros de ingresos": e.message,
    });
  }
};

/**
 * controlador para actualizar ingresos, tabla ingresos
 */
export const actualizarIngreso = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla registros_ingresos que actualiza ingreso
    const [resultado] = await objetoConexion.query(
      "UPDATE registros_ingresos SET motivo =?, monto=?, fecha=? WHERE idIngreso =? AND persona_idPersona =?",
      [
        peticion.body.motivo,
        peticion.body.monto,
        peticion.body.fecha,
        peticion.body.idIngreso,
        idPersona,
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
 * controlador para eliminar ingresos, tabla ingresos
 */
export const eliminarIngreso = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando eliminacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla registros_ingresos que elimina ingreso
    const [resultado] = await objetoConexion.query(
      "DELETE FROM registros_ingresos WHERE idIngreso =? AND persona_idPersona =?",
      [peticion.body.idIngreso, idPersona]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
