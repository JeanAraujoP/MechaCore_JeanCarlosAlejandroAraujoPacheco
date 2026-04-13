USE Guarderia1;

CREATE TABLE TipoDocumento(
	id_TipoDocumento INT NOT NULL AUTO_INCREMENT,
	descripcion VARCHAR(45) NOT NULL,
	PRIMARY KEY (id_TipoDocumento)
);

CREATE TABLE Docente (
	id_Docente INT NOT NULL AUTO_INCREMENT,
	nombre_Docente VARCHAR(45) NOT NULL,
	apellido_Docente VARCHAR (45) NOT NULL,
	telefono_Docente VARCHAR (45) NOT NULL,
	profesion VARCHAR (45) NOT NULL,
	PRIMARY KEY (id_Docente)
);

CREATE TABLE Acudiente(
	id_Acudiente INT NOT NULL AUTO_INCREMENT,
	nombre_Acudiente VARCHAR(45) NOT NULL,
	apellido_Acudiente VARCHAR(45) NOT NULL,
	telefono_Acudiente VARCHAR(45) NOT NULL,
	PRIMARY KEY (id_Acudiente)
);

CREATE TABLE Grupos (
	id_Grupos INT NOT NULL AUTO_INCREMENT,
	cantidad VARCHAR(45) NOT NULL,
	nombreGrupo VARCHAR(45) NOT NULL,
	Acudiente_idAcudiente INT,
	Docente_idDocente INT,
	PRIMARY KEY(id_Grupos),
	CONSTRAINT fk_Grupos_Acudientes
		FOREIGN KEY (Acudiente_idAcudiente)
		REFERENCES Acudiente(id_Acudiente),
	CONSTRAINT fk_Grupos_Docente
		FOREIGN KEY (Docente_idDocente)
		REFERENCES Docente(id_Docente)
);

CREATE TABLE Child (
	id_Child INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(45) NOT NULL,
	apellido VARCHAR(45) NOT NULL,
	codigoUnico VARCHAR (45) NOT NULL,
	grupos_id_Grupos INT,
	PRIMARY KEY(id_Child),
	CONSTRAINT fk_child_grupos
		FOREIGN KEY(grupos_id_Grupos)
		REFERENCES Grupos(id_Grupos)
);

CREATE TABLE Asistencia (
	id_Asistencia INT NOT NULL AUTO_INCREMENT,
	tipoDato VARCHAR (45) NOT NULL,
	fechaAsistencia VARCHAR (45) NOT NULL,
	Child_idChild INT,
	PRIMARY KEY(id_Asistencia),
	CONSTRAINT fk_Asistencia_Child
		FOREIGN KEY (Child_idChild)
		REFERENCES Child (id_Child)
);

create table Estado_Asistencia (
	id_Estado_Asistencia INT NOT NULL AUTO_INCREMENT,
	descripcion VARCHAR(45) NOT NULL,
	Asistencia_idAsistencia INT,
	PRIMARY KEY(id_Estado_Asistencia),
	CONSTRAINT fk_Estado_Asistencia_Asistencia
		FOREIGN KEY (Asistencia_idAsistencia)
		REFERENCES Asistencia(id_Asistencia)
);

CREATE TABLE Registro_Medico (
	id_Registro_Medico INT NOT NULL AUTO_INCREMENT,
	observacionMedica VARCHAR(45) NOT NULL,
	ContactoEmergencia VARCHAR(45) NOT NULL,
	Alergias VARCHAR(45) NOT NULL,
	fecha_RegistroMedico DATE NOT NULL,
	Child_idChild INT,
	PRIMARY KEY (id_Registro_Medico),
	CONSTRAINT fk_Registro_Medico_Child
		FOREIGN KEY (Child_idChild)
		REFERENCES Child(id_Child)
);

CREATE TABLE Actividades (
	id_Actividades INT NOT NULL AUTO_INCREMENT,
	descripcion VARCHAR(45) NOT NULL,
	grupos_id_Grupos INT,
	PRIMARY KEY(id_Actividades),
	CONSTRAINT fk_Actividades_Grupos
		FOREIGN KEY (grupos_id_Grupos)
		REFERENCES Grupos(id_Grupos)
);

CREATE TABLE Ambientes (
	id_Ambientes INT NOT NULL AUTO_INCREMENT,
	numeroAmbientes VARCHAR(45) NOT NULL,
	docenteEncargado VARCHAR(45) NOT NULL,
	grupos_id_Grupos INT,
	PRIMARY KEY(id_Ambientes),
	CONSTRAINT fk_Ambientes_Grupos
		FOREIGN KEY (grupos_id_Grupos)
		REFERENCES Grupos(id_Grupos)
);