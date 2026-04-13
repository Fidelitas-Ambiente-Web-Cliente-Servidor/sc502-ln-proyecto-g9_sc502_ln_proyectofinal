-- ============================================================
--  PetHealth – Base de datos MySQL
--  Grupo 9 | SC-502 | Universidad Fidelitas
-- ============================================================

CREATE DATABASE IF NOT EXISTS pethealth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pethealth;

-- ─── USUARIOS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(120)        NOT NULL,
  correo     VARCHAR(180)        NOT NULL UNIQUE,
  password   VARCHAR(255)        NOT NULL,   -- bcrypt hash
  rol        ENUM('usuario','admin') DEFAULT 'usuario',
  creado_en  DATETIME            DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── MASCOTAS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mascotas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT          NOT NULL,
  nombre         VARCHAR(100) NOT NULL,
  especie        VARCHAR(60)  NOT NULL,
  raza           VARCHAR(100) NOT NULL,
  edad           TINYINT UNSIGNED NOT NULL,
  peso           DECIMAL(5,2) NOT NULL,
  observaciones  TEXT,
  creado_en      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── EVENTOS (vacunas / desparasitaciones / etc.) ────────────
CREATE TABLE IF NOT EXISTS eventos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  mascota_id   INT          NOT NULL,
  usuario_id   INT          NOT NULL,
  tipo         VARCHAR(80)  NOT NULL,
  fecha        DATE         NOT NULL,
  descripcion  TEXT,
  estado       ENUM('ok','proximo','vencido') DEFAULT 'ok',
  creado_en    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── DATOS DE EJEMPLO ────────────────────────────────────────
-- Usuario administrador (password: admin123)
INSERT INTO usuarios (nombre, correo, password, rol) VALUES
  ('Administrador', 'admin@pethealth.com',
   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Usuario de prueba (password: usuario123)
INSERT INTO usuarios (nombre, correo, password, rol) VALUES
  ('Usuario Demo', 'demo@pethealth.com',
   '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p368STXNiZPxS4MxmWIfD6', 'usuario');
