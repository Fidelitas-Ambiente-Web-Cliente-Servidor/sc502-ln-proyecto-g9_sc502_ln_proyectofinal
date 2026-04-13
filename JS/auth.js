

const API_BASE = '../API';

// ── LOGIN
async function handleLogin() {
  let correo     = document.getElementById('loginCorreo').value.trim();
  let contrasena = document.getElementById('loginContrasena').value;
  let valido     = true;

  limpiarFormulario('formLogin');

  if (!campoRequerido(correo)) {
    mostrarError('loginCorreo', 'El correo es obligatorio.'); valido = false;
  } else if (!validarCorreo(correo)) {
    mostrarError('loginCorreo', 'Ingrese un correo válido (ejemplo@correo.com).'); valido = false;
  }
  if (!campoRequerido(contrasena)) {
    mostrarError('loginContrasena', 'La contraseña es obligatoria.'); valido = false;
  } else if (!validarContrasena(contrasena)) {
    mostrarError('loginContrasena', 'La contraseña debe tener al menos 6 caracteres.'); valido = false;
  }
  if (!valido) return;

  let btn = document.querySelector('#formLogin button[type=button]');
  if (btn) { btn.disabled = true; btn.textContent = 'Ingresando...'; }

  try {
    const resp = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password: contrasena }),
      credentials: 'same-origin'
    });
    const data = await resp.json();
    if (data.exito) {
      sessionStorage.setItem('usuario', data.usuario.nombre);
      sessionStorage.setItem('usuario_id', data.usuario.id);
      mostrarAlerta('alertaLogin', '✅ Sesión iniciada. Redirigiendo...', 'success');
      setTimeout(() => { window.location.href = '../PanelAdmin/dashboard.html'; }, 1200);
    } else {
      mostrarAlerta('alertaLogin', '❌ ' + data.mensaje, 'danger');
    }
  } catch (err) {
    mostrarAlerta('alertaLogin', '⚠️ Error de conexión. Verifique que XAMPP/WAMP esté activo.', 'warning');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Ingresar'; }
  }
}

// ── REGISTRO 
async function handleRegistro() {
  let nombre     = document.getElementById('regNombre').value.trim();
  let correo     = document.getElementById('regCorreo').value.trim();
  let contrasena = document.getElementById('regContrasena').value;
  let confirmar  = document.getElementById('regConfirmar').value;
  let terminos   = document.getElementById('regTerminos').checked;
  let valido     = true;

  limpiarFormulario('formRegistro');

  if (!campoRequerido(nombre)) { mostrarError('regNombre', 'El nombre es obligatorio.'); valido = false; }
  if (!campoRequerido(correo)) { mostrarError('regCorreo', 'El correo es obligatorio.'); valido = false; }
  else if (!validarCorreo(correo)) { mostrarError('regCorreo', 'Ingrese un correo válido.'); valido = false; }
  if (!validarContrasena(contrasena)) { mostrarError('regContrasena', 'Mínimo 6 caracteres.'); valido = false; }
  if (contrasena !== confirmar) { mostrarError('regConfirmar', 'Las contraseñas no coinciden.'); valido = false; }
  if (!terminos) { mostrarAlerta('alertaRegistro', '⚠️ Debe aceptar los términos.', 'warning'); valido = false; }
  if (!valido) return;

  let btn = document.querySelector('#formRegistro button[type=button]');
  if (btn) { btn.disabled = true; btn.textContent = 'Creando cuenta...'; }

  try {
    const resp = await fetch(`${API_BASE}/registro.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, password: contrasena }),
      credentials: 'same-origin'
    });
    const data = await resp.json();
    if (data.exito) {
      sessionStorage.setItem('usuario', data.usuario.nombre);
      sessionStorage.setItem('usuario_id', data.usuario.id);
      mostrarAlerta('alertaRegistro', '✅ Cuenta creada. Redirigiendo...', 'success');
      setTimeout(() => { window.location.href = '../PanelAdmin/dashboard.html'; }, 1500);
    } else {
      mostrarAlerta('alertaRegistro', '❌ ' + data.mensaje, 'danger');
    }
  } catch (err) {
    mostrarAlerta('alertaRegistro', '⚠️ Error de conexión. Verifique que XAMPP/WAMP esté activo.', 'warning');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Crear mi cuenta'; }
  }
}

// ── CERRAR SESIÓN 
function cerrarSesion() {
  fetch(`${API_BASE}/sesion.php?accion=logout`, { credentials: 'same-origin' })
    .finally(() => { sessionStorage.clear(); window.location.href = '../Auth/login.html'; });
}

// ── VERIFICAR SESIÓN
async function verificarSesion() {
  try {
    const resp = await fetch(`${API_BASE}/sesion.php`, { credentials: 'same-origin' });
    const data = await resp.json();
    if (!data.autenticado) {
      window.location.href = '../Auth/login.html';
      return false;
    }
    let el = document.getElementById('nombreUsuario');
    if (el) el.textContent = '👤 ' + data.usuario.nombre;
    sessionStorage.setItem('usuario', data.usuario.nombre);
    sessionStorage.setItem('usuario_id', data.usuario.id);
    return true;
  } catch (err) {
    console.warn('Sin servidor PHP - modo demo');
    let u = sessionStorage.getItem('usuario');
    let el = document.getElementById('nombreUsuario');
    if (el && u) el.textContent = '👤 ' + u;
    return false;
  }
}

function guardarSesion(nombre) { sessionStorage.setItem('usuario', nombre); }
