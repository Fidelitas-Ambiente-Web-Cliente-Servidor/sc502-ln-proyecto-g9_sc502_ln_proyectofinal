// ============================================================
//  PetHealth – utils.js  (actualizado para API PHP)
//  Las funciones de validación UI no cambian.
//  Solo se actualiza cerrarSesion() para llamar al backend.
// ============================================================

function campoRequerido(valor) {
  return valor.trim().length > 0;
}

function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function validarContrasena(contrasena) {
  return contrasena.length >= 6;
}

function mostrarError(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  campo.classList.add('is-invalid');
  const feedback = campo.nextElementSibling;
  if (feedback && feedback.classList.contains('invalid-feedback')) {
    feedback.textContent = mensaje;
  }
}

function limpiarError(idCampo) {
  const campo = document.getElementById(idCampo);
  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');
}

function limpiarFormulario(idFormulario) {
  document.querySelectorAll(`#${idFormulario} .form-control, #${idFormulario} .form-select`)
    .forEach(c => c.classList.remove('is-invalid', 'is-valid'));
}

function mostrarAlerta(idContenedor, mensaje, tipo) {
  const contenedor = document.getElementById(idContenedor);
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
  alerta.setAttribute('role', 'alert');
  alerta.innerHTML = mensaje + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
  contenedor.innerHTML = '';
  contenedor.appendChild(alerta);
}

// ── Sesión (solo para mostrar nombre en UI) ──────────────────

function obtenerSesion() {
  return sessionStorage.getItem('usuario');
}

/** Llama al backend para destruir la sesión PHP y limpia sessionStorage */
async function cerrarSesion() {
  if (!confirm('¿Desea cerrar la sesión?')) return;
  try {
    await fetch('../api/auth.php?accion=logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (_) { /* ignorar errores de red, igual limpiamos el front */ }
  sessionStorage.clear();
  window.location.href = '../index.html';
}

// ── Formato de fecha ─────────────────────────────────────────

function formatearFecha(fecha) {
  if (!fecha) return '—';
  // La API retorna formato YYYY-MM-DD
  const partes = fecha.substring(0, 10).split('-');
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function estadoFecha(fecha) {
  const hoy      = new Date();
  const objetivo = new Date(fecha);
  const diff     = (objetivo - hoy) / (1000 * 60 * 60 * 24);
  if (diff < 0)      return 'vencido';
  if (diff <= 30)    return 'proximo';
  return 'ok';
}
