-- ============================================================
-- PetHealth - Script de Base de Datos MySQL
-- SC-502 Ambiente Web Cliente Servidor | Grupo 9 | Fidelitas
-- ============================================================
-- INSTRUCCIONES:
-- 1. Abrir phpMyAdmin o la consola MySQL
-- 2. Ejecutar este script completo
-- ============================================================

CREATE DATABASE IF NOT EXISTS pethealth
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pethealth;

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)  NOT NULL,
    correo      VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL COMMENT 'Hash bcrypt',
    rol         ENUM('usuario','admin') NOT NULL DEFAULT 'usuario',
    activo      TINYINT(1)    NOT NULL DEFAULT 1,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLA: mascotas
-- ============================================================
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

-- ============================================================
-- TABLA: eventos_salud
-- ============================================================
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

-- ============================================================
-- TABLA: contacto_mensajes
-- ============================================================
CREATE TABLE IF NOT EXISTS contacto_mensajes (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)  NOT NULL,
    correo      VARCHAR(150)  NOT NULL,
    asunto      VARCHAR(200)  NOT NULL,
    mensaje     TEXT          NOT NULL,
    leido       TINYINT(1)    NOT NULL DEFAULT 0,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DATOS DE PRUEBA
-- ============================================================
-- Usuario administrador (contraseña: admin123)
INSERT INTO usuarios (nombre, correo, password, rol) VALUES
('Administrador PetHealth', 'admin@pethealth.com',
 '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGX0b7KT6PLuXJ4k2cPNmhCmVVi', 'admin');

-- Usuario de prueba (contraseña: usuario123)
INSERT INTO usuarios (nombre, correo, password, rol) VALUES
('Usuario Demo', 'demo@pethealth.com',
 '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC2ELlpYGkiWnFVKVhN2', 'usuario');

-- Mascotas de ejemplo para el usuario demo (id=2)
INSERT INTO mascotas (usuario_id, nombre, especie, raza, edad, peso, observaciones) VALUES
(2, 'Firulais', 'Perro', 'Labrador', 3, 25.50, 'Alérgico al pollo'),
(2, 'Luna', 'Gato', 'Siamés', 2, 4.20, 'Vacunas al día');

-- Eventos de ejemplo
INSERT INTO eventos_salud (mascota_id, tipo, fecha, descripcion, estado) VALUES
(1, 'Vacuna', '2025-08-15', 'Vacuna antirrábica anual', 'ok'),
(2, 'Desparasitación', '2025-09-20', 'Tratamiento interno trimestral', 'proximo'),
(1, 'Cita veterinaria', '2025-07-10', 'Revisión general de rutina', 'ok');
