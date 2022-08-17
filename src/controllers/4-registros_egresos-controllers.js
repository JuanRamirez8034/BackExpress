import { conexion } from "../database";

/**
 * controladores egresos
 */

/**
 * controlador para registrar egresos, tabla egresos
 */
export const registraEgreso = async (peticion, respuesta) => {
  try {
    console.log("Registrando egreso");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla registros_egresos que registra egresos
    const [resultado] = await objetoConexion.query(
      "INSERT INTO registros_egresos (motivo, monto, fecha, persona_idPersona) VALUES (?,?,?,?)",
      [
        peticion.body.motivo,
        peticion.body.monto,
        peticion.body.fecha,
        peticion.body.persona_idPersona,
      ]
    );
    console.log(resultado);
    respuesta.json({ registro: true, resultado });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante registro Egreso\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para consultar saldo, tabla egreso y tabla ingreso
 */
export const consultaSaldo = async (peticion, respuesta, next) => {
  try {
    console.log("Consultando saldo");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // Consulta en la tabla registros_egresos que consulta saldo
    const [resultado] = await objetoConexion.query(
      "SELECT (IFNULL(SUM(monto),0)-(SELECT IFNULL(SUM(monto),0) FROM registros_egresos WHERE persona_idPersona = ?)) AS saldo FROM registros_ingresos WHERE persona_idPersona = ?",
      [peticion.body.persona_idPersona, peticion.body.persona_idPersona]
    );
    // Si saldo es igual a null
    if (resultado[0].saldo === null) {
      console.log("El saldo es null");
      const mensaje = `El saldo es insuficiente ${resultado[0].saldo}`;
      respuesta.json({ registro: false, resultado: mensaje });
      return;
    }
    // Si saldo es menor o igual a 0
    if (resultado[0].saldo <= 0) {
      console.log("Saldo insuficiente");
      const mensaje = `El saldo es insuficiente ${resultado[0].saldo}`;
      respuesta.json({ registro: false, resultado: mensaje });
      return;
    }
    // Si saldo menos monto es menor 0
    if (resultado[0].saldo - peticion.body.monto < 0) {
      console.log("Saldo insuficiente ingrese un egreso menor");
      const mensaje = `El saldo es insuficiente ${resultado[0].saldo}`;
      respuesta.json({ registro: false, resultado: mensaje });
      return;
    }
    next();
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante consulta de saldo\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para consultar egreso, tabla egreso
 */
export const consultaEgresos = async (peticion, respuesta) => {
  try {
    const fechaFin_2 = new Date(peticion.body.rangoFin);
    fechaFin_2.setDate(fechaFin_2.getDate()+1);
    let resultado = [];
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    console.log("Realizando consulta egresos");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // si no hay rango de fechas se consultan todos los ingresos
    if (
      peticion.body.rangoInicio == undefined ||
      peticion.body.rangoFin == undefined
    ) {
      // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
      resultado = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE persona_idPersona = ?",
        [idPersona]
      );
    } else {
      // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
      resultado = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE persona_idPersona = ? AND fecha BETWEEN ? AND ?",
        [idPersona, peticion.body.rangoInicio, fechaFin_2.toISOString().slice(0,10)]
      );
    }
    console.log(resultado[0]);
    respuesta.json(resultado[0]);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

/**
 * controlador para actualizar egreso, tabla egreso
 */
export const actualizarEgreso = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla registros_egresos que actualiza egreso
    const [resultado] = await objetoConexion.query(
      "UPDATE registros_egresos SET motivo=?, monto=?, fecha=? WHERE persona_idPersona =? AND idEgreso =?",
      [
        peticion.body.motivo,
        peticion.body.monto,
        peticion.body.fecha,
        idPersona,
        peticion.body.idEgreso,
      ]
    );
    console.log(resultado);
    respuesta.json( resultado );
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al actualizar\n" + e.message);
    respuesta.json({ "Error durante la actualizacion": e.message });
  }
};

/**
 * controlador para eliminar egreso, tabla egreso
 */
export const eliminarEgreso = async (peticion, respuesta) => {
  try {
    
    console.log("Ejecutando eliminacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSesion);
    // Consulta en la tabla registros_egresos que elimina egreso
    const [resultado] = await objetoConexion.query(
      "DELETE FROM registros_egresos WHERE idEgreso =? AND persona_idPersona =?",
      [peticion.body.idEgreso, idPersona]
    );
    console.log(resultado);
    respuesta.json(resultado);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al eliminar\n" + e.message);
    respuesta.json({ "Error al eliminar": e.message });
  }
};
