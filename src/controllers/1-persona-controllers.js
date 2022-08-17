import { conexion } from "../database";
import md5 from "md5";
/**
 * controladores persona
 */

/**
 * controlador para registrar personas
 */
export const registraPersona = async (peticion, respuesta) => {
  // objeto que permite realizar la conexion a la bdd para las consultas posteriores
  const objetoConexion = await conexion();
  // variable para validar registro
  let registro = false;

  //Consultar usuario y correo
  console.log("consulta antes de registrar");

  try {
    // Consulta en la tabla usuario que cuenta si existe un usuario con el mismo usuario o correo
    const [resultado] = await objetoConexion.query(
      `SELECT COUNT(usuario) AS resultado FROM usuario WHERE usuario = ? OR correo = ?`,
      [peticion.body.usuario, peticion.body.correo]
    );
    console.log("Datos similares: " + resultado[0].resultado);

    // Si no hay datos similares resgistro = true
    registro = resultado[0].resultado === 0 ? true : false;
    console.log(registro);
  } catch (e) {
    console.log(
      "Error al consultar datos similares durante el registro\n" + e.message
    );
  }

  //Si no hubieron errores ni datos repetidos en la BDD
  if (registro) {
    try {
      console.log("Registrando persona");
      // Encriptando la contraseña para realizar solicitud
      const contrasenaMD5 = md5(peticion.body.contrasena);

      // Consulta en la tabla persona para registra la persona
      const [resultPersona] = await objetoConexion.query(
        "INSERT INTO persona (nombrePersona, apellidoPersona, fechaNacimiento) VALUES (?,?,?)",
        [
          peticion.body.nombrePersona,
          peticion.body.apellidoPersona,
          peticion.body.fechaNacimiento,
        ]
      );
      console.log("registro persona:\n" + [resultPersona]);

      // Consulta en la tabla usuario para registra el usuario
      const [resultUsuario] = await objetoConexion.query(
        "INSERT INTO usuario (usuario, contrasena, correo, persona_idPersona) VALUES (?,?,?,?)",
        [
          peticion.body.usuario,
          contrasenaMD5,
          peticion.body.correo,
          resultPersona.insertId,
        ]
      );
      console.log("registro usuario:\n" + [resultUsuario]);

      respuesta.json({ registro: true });
    } catch (e) {
      console.log(
        "Error al registrar datos de nuevo usuario y persona\n" + e.message
      );
    }
  } else {
    respuesta.json({ registro: false });
  }
};

/**
 * controlador para consultar datos de persona (solo de tabla persona)
 */
export const consultaDatosPersona = async (peticion, respuesta) => {
  try {
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    console.log("Realizando consulta datos persona");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();

    // Consulta en la tabla persona que trae todos sus datos
    const [resultado] = await objetoConexion.query(
      "SELECT * FROM persona WHERE idPersona = ?",
      [idPersona]
    );
    console.log(resultado[0]);
    respuesta.json(resultado[0]);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

/**
 * controlador para consultar todos los datos de persona (tabla persona y usuario)
 */
export const consultaAllDatosPersona = async (peticion, respuesta) => {
  try {
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);
    console.log("Realizando consulta datos persona");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();

    // Consulta en las tablas persona y usuario que trae todos los datos por idPersona
    const [resultado] = await objetoConexion.query(
      "SELECT p.*, u.usuario, u.correo FROM persona p JOIN usuario u ON p.idPersona = u.persona_idPersona WHERE idPersona = ?",
      [idPersona]
    );

    console.log(resultado[0]);
    respuesta.json(resultado[0]);
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante la consulta\n" + e.message);
    respuesta.json({ "Error durante la consulta": e.message });
  }
};

/**
 * controlador para actualizar actualizar datos persona, tabla persona
 */
export const actualizarPersona = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando actualizacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);

    // Consulta en la tabla persona para actualizar nombrePersona, apellidoPersona y fechaNacimiento
    const [resultado] = await objetoConexion.query(
      "UPDATE persona SET  nombrePersona = ?, apellidoPersona = ?, fechaNacimiento = ? WHERE idPersona = ?",
      [
        peticion.body.nombrePersona,
        peticion.body.apellidoPersona,
        peticion.body.sexo,
        peticion.body.fechaNacimiento,
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
 * controlador para eliminar persona, tabla persona
 */
export const elimiarPersona = async (peticion, respuesta) => {
  try {
    console.log("Ejecutando eliminacion");
    // objeto que permite realizar la conexion a la bdd para las consultas posteriores
    const objetoConexion = await conexion();
    // constante que contiene "ID" de sesion correspondiente a la id de persona que realiza solicitudes
    const idPersona = parseInt(peticion.body.idSession);

    // Consulta en la tabla persona para elimiar persona
    const [resultado] = await objetoConexion.query(
      "DELETE FROM persona WHERE idPersona = ?",
      [idPersona]
    );
    console.log(resultado);
    respuesta.json({ eliminacion: true, resultado });
  } catch (e) {
    // respuestas en caso de errores durante la ejecucion de las peticiones
    console.log("Error durante la eliminacion\n" + e.message);
    respuesta.json({ "Error durante la eliminacion": e.message });
  }
};
