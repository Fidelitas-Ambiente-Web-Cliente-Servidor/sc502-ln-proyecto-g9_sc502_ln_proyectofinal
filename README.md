# 🐾 PetHealth

**Aplicación web para gestión de salud preventiva de mascotas**

Proyecto Final — SC-502 Ambiente Web Cliente Servidor  
Grupo 9 | Horario LN | Universidad Fidelitas

---

## 👥 Integrantes

| Nombre | Contribuciones |
|---|---|
| Fabian Mora C. | Estructura HTML principal, index.html, navbar, diseño de páginas |
| Axel Segura A. | CSS3 global, responsive design, variables de diseño |
| Edmilson Flores S. | JavaScript: validaciones, DOM, mascotas, eventos, API calls |
| Walter Chacón C. | Dashboard, reportes, PHP backend, base de datos MySQL |

---

## 🗂️ Estructura del proyecto

```
pethealth/
├── index.html                  # Página de inicio (pública)
├── README.md
├── API/                        # ⚙️ Backend PHP + MySQL
│   ├── config.php              # Configuración de conexión BD
│   ├── database.sql            # Script de creación de BD y tablas
│   ├── login.php               # POST: autenticación
│   ├── registro.php            # POST: registro de usuarios
│   ├── sesion.php              # GET: verificar/cerrar sesión
│   ├── mascotas.php            # GET/POST/PUT/DELETE: CRUD mascotas
│   ├── eventos.php             # GET/POST/DELETE: CRUD eventos de salud
│   ├── dashboard.php           # GET: estadísticas del usuario
│   ├── reportes.php            # GET: reportes con filtros
│   └── contacto.php            # POST: formulario de contacto
├── CSS/
│   └── styles.css              # Estilos globales con variables CSS3
├── JS/
│   ├── utils.js                # Validaciones y funciones reutilizables
│   ├── auth.js                 # Autenticación (login/registro/sesión)
│   ├── mascotas.js             # Gestión de mascotas (CRUD con API)
│   ├── eventos.js              # Gestión de eventos (CRUD con API)
│   ├── dashboard.js            # Carga de estadísticas del panel
│   └── reportes.js             # Filtros y carga de reportes
├── Auth/
│   ├── login.html              # Inicio de sesión
│   └── registro.html           # Registro de usuario
├── PanelAdmin/
│   └── dashboard.html          # Panel principal con resumen y stats
├── Mascotas/
│   └── mascotas.html           # Listado y registro de mascotas
├── Eventos/
│   └── eventos.html            # Historial y registro de eventos de salud
├── Reportes/
│   └── reportes.html           # Reportes con filtros
├── Informacion/
│   └── informacion.html        # Página informativa y FAQ
└── Contacto/
    └── contacto.html           # Formulario de contacto
```

---

## 🛠️ Tecnologías utilizadas

- **HTML5** — Estructura semántica
- **CSS3** — Variables CSS, Flexbox, media queries
- **Bootstrap 5.3** — Componentes UI responsivos
- **JavaScript (ES6+)** — Fetch API, async/await, DOM dinámico
- **PHP 8+** — API REST, lógica del servidor, sesiones
- **MySQL** — Base de datos relacional, procedimientos, FK

---

## 🚀 Instalación y ejecución local

### Requisitos previos

- **XAMPP** (recomendado) o WAMP / Laragon
- PHP 8.0 o superior
- MySQL 5.7 o superior
- Navegador web moderno

---

### Paso 1 — Instalar XAMPP

Si no tienes XAMPP instalado:

1. Descarga XAMPP desde: https://www.apachefriends.org/es/index.html
2. Instala con las opciones por defecto (Apache + MySQL + PHP)
3. Abre **XAMPP Control Panel**
4. Inicia **Apache** y **MySQL** (deben quedar en verde ✅)

---

### Paso 2 — Copiar el proyecto

1. Copia la carpeta completa del proyecto a:
   ```
   C:\xampp\htdocs\pethealth\        (Windows)
   /opt/lampp/htdocs/pethealth/      (Linux)
   /Applications/XAMPP/htdocs/pethealth/  (Mac)
   ```

   La estructura debe quedar así:
   ```
   htdocs/
   └── pethealth/
       ├── index.html
       ├── API/
       ├── Auth/
       ├── CSS/
       ...
   ```

---

### Paso 3 — Crear la base de datos

**Opción A — phpMyAdmin (recomendado):**

1. Abre el navegador y ve a: `http://localhost/phpmyadmin`
2. Haz clic en **"SQL"** en la barra superior
3. Pega el contenido completo del archivo `API/database.sql`
4. Haz clic en **"Continuar"** o **"Go"**
5. Verifica que se creó la base de datos `pethealth` con las tablas:
   - `usuarios`
   - `mascotas`
   - `eventos_salud`
   - `contacto_mensajes`

**Opción B — Línea de comandos:**

```bash
mysql -u root -p < API/database.sql
```

---

### Paso 4 — Configurar la conexión

Abre el archivo `API/config.php` y ajusta si es necesario:

```php
define('DB_HOST', 'localhost');   // normalmente no cambia
define('DB_USER', 'root');        // usuario de MySQL (default: root)
define('DB_PASS', '');            // contraseña (default XAMPP: vacía)
define('DB_NAME', 'pethealth');   // nombre de la BD (no cambiar)
```

> ⚠️ Si XAMPP tiene contraseña configurada en MySQL, escríbela en `DB_PASS`.

---

### Paso 5 — Ejecutar la aplicación

1. Abre el navegador
2. Ve a: **`http://localhost/pethealth/`**
3. Deberías ver la página de inicio de PetHealth ✅

---

## 👤 Usuarios de prueba

El script SQL ya incluye dos usuarios de prueba:

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@pethealth.com` | `admin123` | Administrador |
| `demo@pethealth.com` | `usuario123` | Usuario |

---

## 🔒 Flujo de autenticación

```
Usuario -> Login/Registro -> PHP valida -> Sesión PHP -> Acceso al dashboard
```

- Las contraseñas se almacenan con **hash bcrypt** (seguro)
- La sesión se maneja con **PHP Sessions** (`$_SESSION`)
- Las páginas protegidas verifican sesión activa al cargar

---

## 🗃️ Diagrama relacional (simplificado)

```
usuarios (id, nombre, correo, password, rol, activo)
    │
    └──< mascotas (id, usuario_id, nombre, especie, raza, edad, peso, observaciones)
              │
              └──< eventos_salud (id, mascota_id, tipo, fecha, descripcion, estado)

contacto_mensajes (id, nombre, correo, asunto, mensaje, leido)
```

---

## 📋 Módulos implementados

| Módulo | Descripción | Estado |
|---|---|---|
| 🏠 Landing page | Página de inicio con hero y funcionalidades | ✅ |
| 🔐 Autenticación | Login y registro con PHP + MySQL | ✅ |
| 🐾 Mascotas | CRUD completo con datos en BD | ✅ |
| 💉 Eventos | Registro y historial de vacunas/citas | ✅ |
| 📊 Reportes | Filtros por tipo, mascota y fecha | ✅ |
| 🏠 Dashboard | Estadísticas y últimos eventos | ✅ |
| ℹ️ Información | FAQ y descripción del sistema | ✅ |
| 📧 Contacto | Formulario con guardado en BD | ✅ |

---

## ❓ Solución de problemas

**Error: "No se pudo conectar al servidor"**
→ Verificar que Apache y MySQL estén corriendo en XAMPP

**Error: "Access denied for user 'root'"**
→ Revisar la contraseña en `API/config.php`

**Error 404 al abrir la app**
→ Verificar que el proyecto esté en `htdocs/pethealth/` y no en otra carpeta

**La base de datos no se crea**
→ Ejecutar el script SQL manualmente en phpMyAdmin

---

*SC-502 Ambiente Web Cliente Servidor — Universidad Fidelitas 2025*
