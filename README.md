# PetHealth – Backend PHP + MySQL
### Grupo 9 | SC-502 | Universidad Fidelitas

---

## Estructura de archivos generados

```
backend/
├── database.sql          ← Ejecute esto primero en MySQL
├── config/
│   ├── db.php            ← Credenciales de conexión
│   └── helpers.php       ← Funciones de utilidad (responder, sesión)
├── api/
│   ├── auth.php          ← Login / Registro / Logout / Verificar sesión
│   ├── mascotas.php      ← CRUD de mascotas
│   └── eventos.php       ← CRUD de eventos
└── JS/                   ← Archivos JS actualizados (reemplazar los originales)
    ├── auth.js
    ├── mascotas.js
    ├── eventos.js
    └── utils.js
```

---

## Instalación paso a paso

### 1. Base de datos
```sql
-- En phpMyAdmin o la terminal MySQL:
SOURCE /ruta/a/backend/database.sql;
```

### 2. Configurar conexión
Edite `config/db.php` con sus credenciales:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');      // su usuario MySQL
define('DB_PASS', '');          // su contraseña
define('DB_NAME', 'pethealth');
```

### 3. Copiar archivos al proyecto
```
proyecto/
├── api/              ← carpeta nueva (copiar backend/api/)
├── config/           ← carpeta nueva (copiar backend/config/)
├── JS/
│   ├── auth.js       ← reemplazar con backend/JS/auth.js
│   ├── mascotas.js   ← reemplazar con backend/JS/mascotas.js
│   ├── eventos.js    ← reemplazar con backend/JS/eventos.js
│   └── utils.js      ← reemplazar con backend/JS/utils.js
└── (resto del proyecto sin cambios)
```

### 4. Servidor
El proyecto necesita un servidor con PHP 7.4+ y MySQL. Opciones:
- **XAMPP / WAMP / MAMP** (local)
- **Laragon** (recomendado para Windows)
- Hosting compartido con PHP y MySQL

> **Importante:** Abra el proyecto desde `http://localhost/pethealth/` y **no** desde `file://`. Las cookies de sesión PHP requieren HTTP.

---

## Credenciales de prueba

| Rol     | Correo              | Contraseña  |
|---------|---------------------|-------------|
| Admin   | admin@pethealth.com | admin123    |
| Usuario | demo@pethealth.com  | usuario123  |

---

## Endpoints de la API

### Auth (`api/auth.php`)
| Método | Parámetro       | Descripción          |
|--------|-----------------|----------------------|
| POST   | ?accion=login   | Iniciar sesión       |
| POST   | ?accion=registro| Crear cuenta         |
| POST   | ?accion=logout  | Cerrar sesión        |
| GET    | ?accion=sesion  | Verificar sesión     |

### Mascotas (`api/mascotas.php`)
| Método | Query     | Descripción         |
|--------|-----------|---------------------|
| GET    | —         | Listar mis mascotas |
| POST   | —         | Crear mascota       |
| PUT    | ?id={n}   | Actualizar mascota  |
| DELETE | ?id={n}   | Eliminar mascota    |

### Eventos (`api/eventos.php`)
| Método | Query     | Descripción        |
|--------|-----------|--------------------|
| GET    | —         | Listar mis eventos |
| POST   | —         | Crear evento       |
| PUT    | ?id={n}   | Actualizar evento  |
| DELETE | ?id={n}   | Eliminar evento    |

---

## Cambios respecto al frontend original

- `localStorage` → **MySQL** (persistencia real en servidor)
- `sessionStorage` → **PHP Sessions** (autenticación segura)
- Contraseñas hasheadas con **bcrypt** (`password_hash`)
- Cada usuario solo ve **sus propias** mascotas y eventos
- El estado de los eventos (ok/próximo/vencido) se calcula **en el servidor**
