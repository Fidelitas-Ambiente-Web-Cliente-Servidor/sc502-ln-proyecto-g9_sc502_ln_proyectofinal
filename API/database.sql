
CREATE DATABASE IF NOT EXISTS pethealth
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pethealth;


-- TABLA: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)  NOT NULL,
    correo      VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL COMMENT 'Hash bcrypt',
    rol         ENUM('usuario','admin') NOT NULL DEFAULT 'usuario',
    activo      TINYINT(1)    NOT NULL DEFAULT 1,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- TABLA: mascotas
CREATE TABLE IF NOT EXISTS mascotas (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT           NOT NULL,
    nombre          VARCHAR(100)  NOT NULL,
    especie         ENUM('Perro','Gato','Ave','Reptil','Otro') NOT NULL DEFAULT 'Otro',
    raza            VARCHAR(100)  NOT NULL DEFAULT 'Sin especificar',
    edad            INT           NOT NULL DEFAULT 0 COMMENT 'Años',
    peso            DECIMAL(5,2)  NOT NULL DEFAULT 0.00 COMMENT 'Kilogramos',
    observaciones   TEXT,
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mascotas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- TABLA: eventos_salud
CREATE TABLE IF NOT EXISTS eventos_salud (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id  INT           NOT NULL,
    tipo        ENUM('Vacuna','Desparasitación','Cita veterinaria','Revisión general') NOT NULL,
    fecha       DATE          NOT NULL,
    descripcion TEXT          NOT NULL,
    estado      ENUM('ok','proximo','vencido') NOT NULL DEFAULT 'ok',
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_eventos_mascota
        FOREIGN KEY (mascota_id) REFERENCES mascotas(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- TABLA: contacto_mensajes
CREATE TABLE IF NOT EXISTS contacto_mensajes (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)  NOT NULL,
    correo      VARCHAR(150)  NOT NULL,
    asunto      VARCHAR(200)  NOT NULL,
    mensaje     TEXT          NOT NULL,
    leido       TINYINT(1)    NOT NULL DEFAULT 0,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- DATOS DE PRUEBA
-- Usuario administrador (contraseña: admin123)
INSERT INTO usuarios (nombre, correo, password, rol) VALUES
('Administrador PetHealth', 'admin@pethealth.com',
 '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGX0b7KT6PLuXJ4k2cPNmhCmVVi', 'admin');

