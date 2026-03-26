-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS parkingplus DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE parkingplus;

-- Tabla Perfil de Usuario
CREATE TABLE IF NOT EXISTS PERFIL_USUARIO (
  id INT NOT NULL AUTO_INCREMENT,
  perfil VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Insertar roles por defecto
INSERT INTO PERFIL_USUARIO (perfil) VALUES ('Administrador'), ('Coadministrador'), ('Operador');

-- Tabla Usuario
CREATE TABLE IF NOT EXISTS USUARIO (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  tipo_documento VARCHAR(45) NOT NULL,
  numero_documento VARCHAR(45) NOT NULL,
  primer_nombre VARCHAR(255) NOT NULL,
  segundo_nombre VARCHAR(255) DEFAULT NULL,
  primer_apellido VARCHAR(255) NOT NULL,
  segundo_apellido VARCHAR(45) DEFAULT NULL,
  direccion_correo VARCHAR(255) NOT NULL UNIQUE,
  numero_celular VARCHAR(45) NOT NULL,
  foto_perfil VARCHAR(255) DEFAULT NULL,
  estado VARCHAR(45) NOT NULL DEFAULT 'Activo',
  clave VARCHAR(255) NOT NULL,
  PERFIL_USUARIO_id INT NOT NULL,
  PRIMARY KEY (id_usuario),
  CONSTRAINT fk_usuario_perfil FOREIGN KEY (PERFIL_USUARIO_id) REFERENCES PERFIL_USUARIO (id)
) ENGINE=InnoDB;

-- Tabla Cliente
CREATE TABLE IF NOT EXISTS CLIENTE (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  documento VARCHAR(45) NOT NULL UNIQUE,
  correo VARCHAR(255),
  telefono VARCHAR(45),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Tabla Vehículo
CREATE TABLE IF NOT EXISTS VEHICULO (
  id INT NOT NULL AUTO_INCREMENT,
  placa VARCHAR(45) NOT NULL UNIQUE,
  color VARCHAR(45) DEFAULT NULL,
  modelo VARCHAR(45) DEFAULT NULL,
  marca VARCHAR(45) DEFAULT NULL,
  tipo VARCHAR(45) DEFAULT NULL, -- Carro, Moto, etc.
  cliente_id INT DEFAULT NULL, -- Para clientes frecuentes
  PRIMARY KEY (id),
  CONSTRAINT fk_vehiculo_cliente FOREIGN KEY (cliente_id) REFERENCES CLIENTE (id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabla Celda
CREATE TABLE IF NOT EXISTS CELDA (
  id INT NOT NULL AUTO_INCREMENT,
  numero VARCHAR(10) NOT NULL UNIQUE,
  tipo VARCHAR(45) DEFAULT NULL, -- Carro, Moto
  estado VARCHAR(45) DEFAULT 'Disponible', -- Disponible, Ocupada, Mantenimiento
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Insertar algunas celdas de ejemplo
INSERT INTO CELDA (numero, tipo) VALUES ('C1', 'Carro'), ('C2', 'Carro'), ('M1', 'Moto'), ('M2', 'Moto');

-- Tabla Registro de Ingreso/Salida (Historial)
CREATE TABLE IF NOT EXISTS REGISTRO_PARQUEO (
  id INT NOT NULL AUTO_INCREMENT,
  VEHICULO_id INT NOT NULL,
  CELDA_id INT NOT NULL,
  fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_salida DATETIME DEFAULT NULL,
  estado VARCHAR(45) DEFAULT 'Dentro', -- Dentro, Fuera
  PRIMARY KEY (id),
  CONSTRAINT fk_registro_vehiculo FOREIGN KEY (VEHICULO_id) REFERENCES VEHICULO (id),
  CONSTRAINT fk_registro_celda FOREIGN KEY (CELDA_id) REFERENCES CELDA (id)
) ENGINE=InnoDB;

-- Tabla Novedad
CREATE TABLE IF NOT EXISTS NOVEDAD (
  id INT NOT NULL AUTO_INCREMENT,
  descripcion TEXT NOT NULL,
  fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  REGISTRO_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_novedad_registro FOREIGN KEY (REGISTRO_id) REFERENCES REGISTRO_PARQUEO (id)
) ENGINE=InnoDB;

-- Tabla Pico y Placa
CREATE TABLE IF NOT EXISTS PICO_PLACA (
  id INT NOT NULL AUTO_INCREMENT,
  tipo_vehiculo VARCHAR(45) NOT NULL,
  dia_semana TINYINT NOT NULL, -- 1 (Lunes) a 7 (Domingo)
  digitos VARCHAR(10) NOT NULL, -- Ej: "1,2"
  PRIMARY KEY (id)
) ENGINE=InnoDB;
