
function campoRequerido(valor) {
  return valor !== null && valor !== undefined && String(valor).trim() !== '';
}

function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function validarContrasena(pass) {
  return pass && pass.length >= 6;
}


function mostrarError(idCampo, mensaje) {
  let campo = document.getElementById(idCampo);
  if (!campo) return;
  campo.classList.add('is-invalid');
  let feedback = campo.nextElementSibling;
  if (feedback && feedback.classList.contains('invalid-feedback')) {
    feedback.textContent = mensaje;
  }
}

function limpiarError(idCampo) {
  let campo = document.getElementById(idCampo);
  if (!campo) return;
  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');
}

function limpiarFormulario(idForm) {
  let form = document.getElementById(idForm);
  if (!form) return;
  form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
    el.classList.remove('is-invalid', 'is-valid');
  });
}


function mostrarAlerta(idContenedor, mensaje, tipo) {
  let contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;
  contenedor.innerHTML =
    '<div class="alert alert-' + tipo + ' alert-dismissible fade show" role="alert">' +
      mensaje +
      '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
    '</div>';
  setTimeout(() => {
    let alerta = contenedor.querySelector('.alert');
    if (alerta) alerta.classList.remove('show');
  }, 5000);
}


function formatearFecha(fechaISO) {
  if (!fechaISO) return '—';
  let [y, m, d] = fechaISO.split('-');
  return d + '/' + m + '/' + y;
}

function estadoFecha(fechaISO) {
  let hoy   = new Date();
  let fecha = new Date(fechaISO + 'T00:00:00');
  let diff  = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
  if (diff < 0)  return 'vencido';
  if (diff <= 30) return 'proximo';
  return 'ok';
}
