# PetHealth

**Aplicación web para gestión de salud preventiva de mascotas**

Proyecto Final — SC-502 Ambiente Web Cliente Servidor  
Grupo 9 | Horario LN | Universidad Fidelitas

## Integrantes

| Nombre | Contribuciones |
|---|---|
| Fabian Mora C. | Estructura HTML principal, index.html, navbar |
| Axel Segura A. | CSS3 global, responsive design, variables |
| Edmilson Flores S. | JavaScript: validaciones, DOM, mascotas, eventos |
| Walter Chacón C. | Dashboard, módulo de eventos, reportes, contacto |


## Estructura del proyecto

```
pethealth/
├── index.html              # Página de inicio
├── README.md
├── CSS/
│   └── styles.css          # Estilos globales con variables CSS3
├── JS/
│   ├── utils.js            # Funciones reutilizables (validaciones, alertas)
│   ├── auth.js             # Lógica de autenticación
│   ├── mascotas.js         # Gestión de mascotas (DOM dinámico)
│   └── eventos.js          # Gestión de eventos de salud
├── Auth/
│   ├── login.html          # Inicio de sesión
│   └── registro.html       # Registro de usuario
├── PanelAdmin/
│   └── dashboard.html      # Panel principal con resumen
├── Mascotas/
│   └── mascotas.html       # Listado y registro de mascotas
├── Eventos/
│   └── eventos.html        # Historial y registro de eventos de salud
├── Reportes/
│   └── reportes.html       # Reportes con filtros
├── Informacion/
│   └── informacion.html    # Página informativa y FAQ
├── Contacto/
│   └── contacto.html       # Formulario de contacto
└── img/                    # Imágenes del proyecto
```

## Tecnologías utilizadas

- **HTML5** — Estructura semántica de las páginas
- **CSS3** — Estilos con variables CSS, Flexbox y media queries
- **Bootstrap 5.3** — Componentes UI responsivos (visto en clase Unidad 2.3)
- **JavaScript** — Validaciones, manipulación del DOM, gestión de sesión



## ejecutar

1. Clonar el repositorio
2. Abrir `index.html` en el navegador


## Módulos implementados (Avance 2 )

- Página de inicio con hero y cards de funcionalidades
- Autenticación: Login y Registro con validaciones
- Panel principal (Dashboard) con sidebar y resumen
- Gestión de mascotas (CRUD con DOM dinámico)
- Eventos de salud (vacunas, desparasitaciones, citas)
- Reportes con filtros
- Página informativa con acordeón Bootstrap
- Formulario de contacto con validación

*SC-502 Ambiente Web Cliente Servidor — Universidad Fidelitas 2025*
