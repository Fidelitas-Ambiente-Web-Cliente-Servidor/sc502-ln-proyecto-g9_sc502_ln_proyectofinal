// ============================================================
//  PetHealth – auth.js  (versión API PHP)
//  Reemplaza el uso de localStorage por llamadas fetch() al backend
// ============================================================

const API_BASE = '../api'; // ajuste si el backend está en otra ruta

// ── LOGIN ────────────────────────────────────────────────────
async function handleLogin() {
  const correo    = document.getElementById('loginCorreo').value;
  const contrasena = document.getElementById('loginContrasena').value;
  let valido = true;

  limpiarFormulario('formLogin');

  if (!campoRequerido(correo)) {
    mostrarError('loginCorreo', 'El correo es obligatorio.');
    valido = false;
  } else if (!validarCorreo(correo)) {
    mostrarError('loginCorreo', 'Ingrese un correo válido (ejemplo@correo.com).');
    valido = false;
  } else {
    limpiarError('loginCorreo');
  }

  if (!campoRequerido(contrasena)) {
    mostrarError('loginContrasena', 'La contraseña es obligatoria.');
    valido = false;
  } else if (!validarContrasena(contrasena)) {
    mostrarError('loginContrasena', 'La contraseña debe tener al menos 6 caracteres.');
    valido = false;
  } else {
    limpiarError('loginContrasena');
  }

  if (!valido) return;

  try {
    const res  = await fetch(`${API_BASE}/auth.php?accion=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',                  // envía la cookie de sesión PHP
      body: JSON.stringify({ correo, contrasena }),
    });
    const data = await res.json();

    if (!data.ok) {
      mostrarAlerta('alertaLogin', '⚠️ ' + data.mensaje, 'danger');
      return;
    }

    // Guardar solo nombre para mostrarlo en la UI (sesión real está en el servidor)
    sessionStorage.setItem('usuario', data.usuario.nombre);
    sessionStorage.setItem('rol', data.usuario.rol);

    mostrarAlerta('alertaLogin', '✅ Sesión iniciada. Redirigiendo...', 'success');
    setTimeout(() => { window.location.href = '../PanelAdmin/dashboard.html'; }, 1500);

  } catch (err) {
    mostrarAlerta('alertaLogin', '❌ Error de conexión con el servidor.', 'danger');
    console.error(err);
  }
}

// ── REGISTRO ─────────────────────────────────────────────────
async function handleRegistro() {
  const nombre    = document.getElementById('regNombre').value;
  const correo    = document.getElementById('regCorreo').value;
  const contrasena = document.getElementById('regContrasena').value;
  const confirmar  = document.getElementById('regConfirmar').value;
  const terminos   = document.getElementById('regTerminos').checked;
  let valido = true;

  limpiarFormulario('formRegistro');

  if (!campoRequerido(nombre))   { mostrarError('regNombre',    'El nombre completo es obligatorio.'); valido = false; }
  else                             { limpiarError('regNombre'); }

  if (!campoRequerido(correo))   { mostrarError('regCorreo',    'El correo es obligatorio.');         valido = false; }
  else if (!validarCorreo(correo)){ mostrarError('regCorreo',   'Ingrese un correo válido.');         valido = false; }
  else                             { limpiarError('regCorreo'); }

  if (!validarContrasena(contrasena)) { mostrarError('regContrasena', 'Mínimo 6 caracteres.'); valido = false; }
  else                                 { limpiarError('regContrasena'); }

  if (contrasena !== confirmar)  { mostrarError('regConfirmar', 'Las contraseñas no coinciden.');     valido = false; }
  else if (campoRequerido(confirmar)) { limpiarError('regConfirmar'); }

  if (!terminos) {
    mostrarAlerta('alertaRegistro', '⚠️ Debe aceptar los términos y condiciones.', 'warning');
    valido = false;
  }

  if (!valido) return;

  try {
    const res  = await fetch(`${API_BASE}/auth.php?accion=registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, correo, contrasena }),
    });
    const data = await res.json();

    if (!data.ok) {
      mostrarAlerta('alertaRegistro', '⚠️ ' + data.mensaje, 'danger');
      return;
    }

    sessionStorage.setItem('usuario', data.usuario.nombre);
    sessionStorage.setItem('rol', data.usuario.rol);

    mostrarAlerta('alertaRegistro', '✅ Cuenta creada. Redirigiendo...', 'success');
    setTimeout(() => { window.location.href = '../PanelAdmin/dashboard.html'; }, 1500);

  } catch (err) {
    mostrarAlerta('alertaRegistro', '❌ Error de conexión con el servidor.', 'danger');
    console.error(err);
  }
}
