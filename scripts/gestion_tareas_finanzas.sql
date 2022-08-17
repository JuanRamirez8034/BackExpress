CREATE DATABASE IF NOT EXISTS gestion_tareas_finanzas;

USE gestion_tareas_finanzas;

CREATE TABLE IF NOT EXISTS persona(
    idPersona INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombrePersona VARCHAR(30),
    apellidoPersona VARCHAR(30),
    fechaNacimiento DATE
);

CREATE TABLE IF NOT EXISTS usuario(
    idUsuario INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(30) NOT NULL,
    contrasena VARCHAR(200) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    persona_idPersona INT UNSIGNED NOT NULL,
    CONSTRAINT `fk_usuario_persona`
    FOREIGN KEY (persona_idPersona) REFERENCES persona(idPersona) ON DELETE CASCADE,
    CONSTRAINT uc_usuario_correo Unique(usuario, correo)  
);

CREATE TABLE IF NOT EXISTS proyecto(
    idProyecto INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(500),
    monto FLOAT,
    fechaInicio DATE,
    fechaFin DATE,
    estado ENUM('Activo', 'Terminado', 'Abandonado'),
    persona_idPersona INT UNSIGNED NOT NULL,
    CONSTRAINT `fk_proyecto_persona`
    FOREIGN KEY (persona_idPersona) REFERENCES persona(idPersona) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS actividad(
    idActividad INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(200),
    fechaInicio DATETIME,
    fechaFin DATETIME,
    estado ENUM('Activo', 'Terminado', 'Abandonado'),
    proyecto_idProyecto INT UNSIGNED NOT NULL,
    CONSTRAINT `fk_actividad_proyecto`
    FOREIGN KEY (proyecto_idProyecto) REFERENCES proyecto(idProyecto) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nota(
    idNota INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(50),
    actividad_idActividad INT  UNSIGNED NOT NULL,
    CONSTRAINT `fk_nota_actividad`
    FOREIGN KEY (actividad_idActividad) REFERENCES actividad(idActividad) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recordatorio(
    idRecordatorio INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(50),
    fechaInicio DATETIME,
    fechaFin DATETIME,
    estado ENUM('Activo', 'Terminado', 'Abandonado'),
    persona_idPersona INT UNSIGNED NOT NULL,
    CONSTRAINT `fk_recordatorio_persona`
    FOREIGN KEY (persona_idPersona) REFERENCES persona(idPersona) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tag(
    idTag INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS proyecto_tags(
	id_proyecto_tag INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	tag_idTag INT UNSIGNED NOT NULL,
    proyecto_idProyecto INT UNSIGNED NOT NULL,
    
    CONSTRAINT `fk_proytag_tag`
    FOREIGN KEY (tag_idTag) REFERENCES tag(idTag) ON DELETE CASCADE,
    CONSTRAINT `fk_proytag_proyecto`
    FOREIGN KEY (proyecto_idProyecto) REFERENCES proyecto(idProyecto) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recordatorio_tags(
	id_recordatorio_tags INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	tag_idTag INT UNSIGNED NOT NULL,
    recordatorio_idRecordatorio INT UNSIGNED NOT NULL,
    
    CONSTRAINT `fk_rectag_tag`
    FOREIGN KEY (tag_idTag) REFERENCES tag(idTag) ON DELETE CASCADE,
    CONSTRAINT `fk_rectag_recordatorio`
    FOREIGN KEY (recordatorio_idRecordatorio) REFERENCES recordatorio(idRecordatorio) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS registros_ingresos(
    idIngreso INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    motivo VARCHAR(50),
    monto FLOAT,
    fecha DATETIME,
    proyecto_idProyecto INT UNSIGNED NOT NULL,
    persona_idPersona INT UNSIGNED NOT NULL,
    
    CONSTRAINT `fk_reging_proyecto`
    FOREIGN KEY (proyecto_idProyecto) REFERENCES proyecto(idProyecto),
    
    CONSTRAINT `fk_reging_persona`
    FOREIGN KEY (persona_idPersona) REFERENCES persona(idPersona) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS registros_egresos(
    idEgreso INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    motivo VARCHAR(50),
    monto FLOAT,
    fecha DATETIME,
    persona_idPersona INT UNSIGNED NOT NULL,
    CONSTRAINT `fk_regegre_persona`
    FOREIGN KEY (persona_idPersona) REFERENCES persona(idPersona) ON DELETE CASCADE
);
