
/**
 * Valida que un campo no esté vacío
 * @param {string} valor - Valor del campo
 * @returns {boolean}
 */
function campoRequerido(valor) {
  return valor.trim().length > 0;
}

/**
 * Valida formato de correo electrónico
 * @param {string} correo
 * @returns {boolean}
 */
function validarCorreo(correo) {
  let expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expresion.test(correo);
}

/**
 * Valida que la contraseña tenga mínimo 6 caracteres
 * @param {string} contrasena
 * @returns {boolean}
 */
function validarContrasena(contrasena) {
  return contrasena.length >= 6;
}

/**
 * Muestra un mensaje de error en un campo de formulario Bootstrap
 * @param {string} idCampo - ID del input
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarError(idCampo, mensaje) {
  let campo = document.getElementById(idCampo);
  campo.classList.add("is-invalid");
  let feedback = campo.nextElementSibling;
  if (feedback && feedback.classList.contains("invalid-feedback")) {
    feedback.textContent = mensaje;
  }
}

/**
 * Limpia el error de un campo
 * @param {string} idCampo
 */
function limpiarError(idCampo) {
  let campo = document.getElementById(idCampo);
  campo.classList.remove("is-invalid");
  campo.classList.add("is-valid");
}

/**
 * Limpia todos los estados de validación del formulario
 * @param {string} idFormulario
 */
function limpiarFormulario(idFormulario) {
  let campos = document.querySelectorAll("#" + idFormulario + " .form-control, #" + idFormulario + " .form-select");
  for (let i = 0; i < campos.length; i++) {
    campos[i].classList.remove("is-invalid", "is-valid");
  }
}

// ---------- Alertas Bootstrap dinámicas ----------

/**
 * Muestra una alerta Bootstrap en el contenedor indicado
 * @param {string} idContenedor - ID del div donde aparecerá
 * @param {string} mensaje - Texto del mensaje
 * @param {string} tipo - 'success' | 'danger' | 'warning' | 'info'
 */
function mostrarAlerta(idContenedor, mensaje, tipo) {
  let contenedor = document.getElementById(idContenedor);
  let alerta = document.createElement("div");
  alerta.className = "alert alert-" + tipo + " alert-dismissible fade show";
  alerta.setAttribute("role", "alert");
  alerta.innerHTML = mensaje + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
  contenedor.innerHTML = "";
  contenedor.appendChild(alerta);
}

// ---------- Sesión simulada ----------

/**
 * Guarda el nombre del usuario en la sesión del navegador
 * @param {string} nombre
 */
function guardarSesion(nombre) {
  sessionStorage.setItem("usuario", nombre);
}

/**
 * Obtiene el nombre del usuario en sesión
 * @returns {string|null}
 */
function obtenerSesion() {
  return sessionStorage.getItem("usuario");
}

/**
 * Cierra la sesión y redirige al inicio
 */
function cerrarSesion() {
  let confirmar = confirm("¿Desea cerrar la sesión?");
  if (confirmar) {
    sessionStorage.clear();
    window.location.href = "../index.html";
  }
}

// ---------- Utilidades DOM ----------

/**
 * Formatea una fecha ISO a formato legible
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string}
 */
function formatearFecha(fecha) {
  if (!fecha) return "—";
  let partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

/**
 * Calcula si una fecha está próxima (dentro de 30 días) o vencida
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} - 'ok' | 'proximo' | 'vencido'
 */
function estadoFecha(fecha) {
  let hoy = new Date();
  let objetivo = new Date(fecha);
  let diferencia = (objetivo - hoy) / (1000 * 60 * 60 * 24);

  if (diferencia < 0) {
    return "vencido";
  } else if (diferencia <= 30) {
    return "proximo";
  } else {
    return "ok";
  }
}
