import { conexion } from "../database";
const date = require("date-and-time");
/**
 * controladores de consulta de tablas varias
 */

/**
 * controlador para consultar lista de las tareas diarias (actividades y recordatorios activos)
 */
export const consultaTareasDiarias = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta diaria");

    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();

    let resultado = [];
    let resultado2 = [];

    //Recordatorios
    try {
      [resultado] = await objetoConexion.query(
        "SELECT r.idRecordatorio, r.descripcion, r.fechaInicio, r.fechaFin, r.estado, r.persona_idPersona FROM recordatorio r WHERE r.estado = 1 AND r.persona_idPersona = ? ORDER BY r.fechaFin ASC",
        [idPersona]
      );
    } catch (e) {
      console.log("Error durante la consulta de Recordatorios\n" + e.message);
    }

    //Actividades
    try {
      [resultado2] = await objetoConexion.query(
        "SELECT a.idActividad, a.descripcion, a.fechaInicio, a.fechaFin, a.estado, a.proyecto_idProyecto, p.idProyecto, p.persona_idPersona FROM actividad a JOIN proyecto p ON a.proyecto_idProyecto = p.idProyecto WHERE a.estado = 1 AND persona_idPersona = ? ORDER BY a.fechaFin ASC",
        [idPersona]
      );
    } catch (e) {
      console.log("Error durante la consulta de Actividades\n" + e.message);
    }

    //Juntar ambos arrays en arrayTareas
    var arrayTareas = resultado.concat(resultado2);

    //Ordenar objetos del array por fechaFin
    arrayTareas.sort(function compare(a, b) {
      var dateA = new Date(a.fechaFin);
      var dateB = new Date(b.fechaFin);
      return dateA - dateB;
    });

    // Formatear campos fechaFin/fechaInicio por 'YYYY-MM-DD HH:mm:ss'
    for (let i = 0; i < arrayTareas.length; i++) {
      let fin = arrayTareas[i]["fechaFin"];
      const finNuevo = date.format(fin, "YYYY-MM-DD HH:mm");

      let inicio = arrayTareas[i]["fechaInicio"];
      const inicioNuevo = date.format(inicio, "YYYY-MM-DD HH:mm");

      arrayTareas[i]["fechaFin"] = finNuevo;
      arrayTareas[i]["fechaInicio"] = inicioNuevo;
    }

    respuesta.json(arrayTareas);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

/**
 * controlador para actualizar estado de las tareas diarias (actividades y recordatorios)
 */
export const actualizarEstadoTareasDiarias = async (peticion, respuesta) => {
  try {
    console.log(`Realizando actualización de ${peticion.body.tipo}`);
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    console.log(peticion.body);
    if (peticion.body.tipo == "Recordatorio") {
      // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
      const [resultado] = await objetoConexion.query(
        "UPDATE recordatorio SET estado=? WHERE idRecordatorio=?",
        [peticion.body.estado, peticion.body.id]
      );
      console.log("R\n" + JSON.stringify(resultado));
    }

    if (peticion.body.tipo == "Actividad") {
      // sentencia sql correspondiente para alguna accion asosciada a el "CRUD" de la tabla en manejo
      const [resultado] = await objetoConexion.query(
        "UPDATE actividad SET estado=? WHERE idActividad=?",
        [peticion.body.estado, peticion.body.id]
      );
      console.log("A\n" + JSON.stringify(resultado));
    }

    console.log({ registro: true });
    respuesta.json({ registro: true });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al actualizar estado de tareas\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para consultar los movimientos (ingresos y egresos)
 */
export const consultaMovimientos = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta movimientos");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    let resultado, resultadoIngresos, resultadoEgresos;

    // Si la consulta es de tipo "Diario"
    if (peticion.body.tipo == "Diario") {
      // Consulta en la tabla registros_ingresos por día y idPersona
      [resultadoIngresos] = await objetoConexion.query(
        "SELECT * FROM registros_ingresos WHERE (DAY(fecha) = DAY(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );

      // Consulta en la tabla registros_egresos por día y idPersona
      [resultadoEgresos] = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE (DAY(fecha) = DAY(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );
    } // Si la consulta es de tipo "Mensual"
    else if (peticion.body.tipo == "Mensual") {
      // Consulta en la tabla registros_ingresos por mes y idPersona
      [resultadoIngresos] = await objetoConexion.query(
        "SELECT * FROM registros_ingresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );

      // Consulta en la tabla registros_egresos por mes y idPersona
      [resultadoEgresos] = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
        [peticion.body.fecha, idPersona]
      );
    } // Si la consulta es de tipo "Anual"
    else if (peticion.body.tipo == "Anual") {
      // Consulta en la tabla registros_ingresos por año y idPersona
      [resultadoIngresos] = await objetoConexion.query(
        "SELECT * FROM registros_ingresos WHERE (YEAR(fecha) = YEAR(?)) AND persona_idPersona = ? ORDER BY fecha DESC",
        [peticion.body.fecha, idPersona]
      );

      // Consulta en la tabla registros_egresos por año y idPersona
      [resultadoEgresos] = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE (YEAR(fecha) = YEAR(?)) AND persona_idPersona = ? ORDER BY fecha DESC",
        [peticion.body.fecha, idPersona]
      );
    } // Si la consulta es de tipo "Rango"
    else if (peticion.body.tipo == "Rango") {
      // Consulta en la tabla registros_ingresos entre dos fechas por idPersona
      [resultadoIngresos] = await objetoConexion.query(
        "SELECT * FROM registros_ingresos WHERE (fecha BETWEEN ? AND ? ) AND persona_idPersona = ?",
        [peticion.body.fechaInicio, peticion.body.fechaFin, idPersona]
      );

      // Consulta en la tabla registros_egresos entre dos fechas por idPersona
      [resultadoEgresos] = await objetoConexion.query(
        "SELECT * FROM registros_egresos WHERE (fecha BETWEEN ? AND ? ) AND persona_idPersona = ?",
        [peticion.body.fechaInicio, peticion.body.fechaFin, idPersona]
      );
    }

    // Concatenación de los resltados ingresos y egresos
    resultado = resultadoIngresos.concat(resultadoEgresos);

    //Ordenar objetos del array por fecha
    resultado.sort(function compare(a, b) {
      var dateA = new Date(a.fecha);
      var dateB = new Date(b.fecha);
      return dateA - dateB;
    });

    // formateando fechas con una funcion robada <3<3
    for (let i = 0; i < resultado.length; i++) {
      let fecha = resultado[i]["fecha"];
      const fechaNueva = date.format(fecha, "YYYY/MM/DD HH:mm");
      resultado[i]["fecha"] = fechaNueva;
    }

    //console.log(resultado);
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
 * controlador para consultar el total de los movimientos (ingresos y egresos)
 */
export const consultaMontoTotalMovimientos = async (peticion, respuesta) => {
  try {
    console.log("Realizando consulta monto total movimientos");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    const [egresos] = await objetoConexion.query(
      "SELECT round(SUM(monto),2) AS totalEgresos FROM registros_egresos WHERE persona_idPersona = ?",
      [idPersona]
    );
    const [ingresos] = await objetoConexion.query(
      "SELECT round(SUM(monto),2) AS totalIngresos FROM registros_ingresos WHERE persona_idPersona = ?",
      [idPersona]
    );
    const [egresosMes] = await objetoConexion.query(
      "SELECT round(SUM(monto),2) AS totalEgresos FROM registros_egresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
      [peticion.body.fecha, idPersona]
    );
    const [ingresosMes] = await objetoConexion.query(
      "SELECT round(SUM(monto),2) AS totalIngresos FROM registros_ingresos WHERE (MONTH(fecha) = MONTH(?)) AND persona_idPersona = ?",
      [peticion.body.fecha, idPersona]
    );
    const saldo = (ingresos[0].totalIngresos - egresos[0].totalEgresos).toFixed(
      2
    );
    let ahorro = ((saldo / 100) * 10).toFixed(2);
    if (ahorro <= 0) {
      ahorro = 0;
    }
    respuesta.json({
      totalEgresos: egresosMes[0].totalEgresos,
      totalIngresos: ingresosMes[0].totalIngresos,
      saldo: saldo,
      ahorro: ahorro,
    });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log(
      "Error durante la consulta de totales de ingresos\n" + e.message
    );
    respuesta.json({
      "Error durante la consulta de totales de ingresos": e.message,
    });
  }
};

/**
 * controlador para actualizar toda la infomacóformación mostrada en la sección de Perfil (persona y usuario)
 */
export const actualizarPerfil = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion del Perfil");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    let resultado;

    // Usuario
    try {
      // Consulta en la tabla usuario para actualizar correo y usuario por idPersona
      [resultado] = await objetoConexion.query(
        "UPDATE usuario SET usuario.usuario = ?, usuario.correo = ? WHERE usuario.persona_idPersona = ?",
        [peticion.body.usuario, peticion.body.correo, idPersona]
      );
    } catch (e) {
      // Errores de la consulta
      console.log(
        "Error al actualizar el perfil en la tabla usuario\n" + e.message
      );
      respuesta.json({
        "Error durante la actualizacion del perfil en la tabla usuario":
          e.message,
      });
    }

    // Persona
    try {
      // Consulta en la tabla usuario para actualizar nombre de la Persona por idPersona
      [resultado] = await objetoConexion.query(
        "UPDATE persona SET persona.nombrePersona = ? WHERE persona.idPersona = ?",
        [peticion.body.nombrePersona, idPersona]
      );
    } catch (e) {
      // Errores de la consulta
      console.log(
        "Error al actualizar el perfil en la tabla persona\n" + e.message
      );
      respuesta.json({
        "Error durante la actualizacion del perfil en la tabla persona":
          e.message,
      });
    }

    console.log(resultado);
    respuesta.json({ resultado: true });
  } catch (e) {
    console.log("Error al actualizar el perfil\n" + e.message);
    respuesta.json({ resultado: false, error: e.message });
  }
};

/**
 * controlador para actualizar un proyecto terminado
 */
export const actualizarProyectoTerminado = async (
  peticion,
  respuesta,
  next
) => {
  try {
    console.log(`Realizando consulta de actividades`);

    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    console.log(peticion.body);

    // Consulta en la tabla actividad contar todas las actividades con estado "activo" de un proyecto
    const [numActividTerminada] = await objetoConexion.query(
      "SELECT COUNT(*) AS noTerminadas FROM actividad WHERE proyecto_idProyecto = ? AND estado = ?",
      [peticion.body.idProyecto, "Activo"]
    );
    console.log(numActividTerminada[0]);

    // Si hay actividades activas...
    if (numActividTerminada[0].noTerminadas !== 0) {
      // Consulta en la tabla proyecto para actualizar estado a "Activo" de un proyecto
      const [proyectoActivo] = await objetoConexion.query(
        "UPDATE proyecto SET estado = ? WHERE idProyecto = ?",
        ["Activo", peticion.body.idProyecto]
      );

      // Consulta para eliminar ingresos en la tabla registros_ingresos
      const [eliminarIngreso] = await objetoConexion.query(
        "DELETE FROM registros_ingresos WHERE proyecto_idProyecto = ?",
        [peticion.body.idProyecto]
      );

      respuesta.json({
        registro: false,
        noTerminadas: numActividTerminada[0].noTerminadas,
      });

      //retornar y salir del controlador
      return;
    }

    // Si no hay actividades activas...
    // Consulta en la tabla proyecto para actualizar estado a "Terminado" de un proyecto
    const [actualizaProyecto] = await objetoConexion.query(
      "UPDATE proyecto SET estado = ? WHERE idProyecto = ?",
      ["Terminado", peticion.body.idProyecto]
    );
    console.log("Filas actualizadas: " + actualizaProyecto.affectedRows);

    //si no se pudo actualizar el estado retornar
    if (actualizaProyecto.affectedRows === 0) {
      respuesta.json({
        actualizarProyect: false,
        resultado: actualizaProyecto,
      });
      return;
    }

    next();
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error actualizar estado de proyecto\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};

/**
 * controlador para registrar el ingreso de un proyecto terminado (Función hermana de actualizarProyectoTerminado)
 */
export const registroIngresoProyecto = async (peticion, respuesta) => {
  try {
    console.log(`Realizando consulta de descripcion`);
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    const idProyecto = parseInt(peticion.body.idProyecto);
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    console.log(peticion.body);

    // Consulta si existe un ingreso con este idProyecto
    const [ingresoSimilar] = await objetoConexion.query(
      "SELECT COUNT(*) AS similar FROM registros_ingresos WHERE proyecto_idProyecto = ?",
      [idProyecto]
    );

    // Si existe un ingreso con esta idProyecto
    if (ingresoSimilar[0].similar !== 0) {
      console.log("Existe un ingreso para este proyecto");
      respuesta.json({ registro: false });
      //retornar y salir del controlador
      return;
    }

    // Consulta para registrar un ingreso en la tabla registros_ingresos
    const [resultado] = await objetoConexion.query(
      "INSERT INTO registros_ingresos (motivo, monto, fecha, proyecto_idProyecto, persona_idPersona) VALUES ( (SELECT proyecto.descripcion FROM proyecto WHERE proyecto.idProyecto = ?), (SELECT proyecto.monto FROM proyecto WHERE proyecto.idProyecto = ?), ?, ?, ?)",
      [idProyecto, idProyecto, peticion.body.fecha, idProyecto, idPersona]
    );
    console.log("Registro exitoso de ingreso de proyecto");

    respuesta.json({ registro: true, resultado: resultado });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error al registrar ingreso de proyecto\n" + e.message);
    respuesta.json({ "tipo de Error": e.message });
  }
};
