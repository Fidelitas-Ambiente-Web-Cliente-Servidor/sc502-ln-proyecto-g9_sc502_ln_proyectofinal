
/**
 * Maneja el inicio de sesión del usuario
 * Valida correo y contraseña antes de redirigir
 */
function handleLogin() {
  let correo = document.getElementById("loginCorreo").value;
  let contrasena = document.getElementById("loginContrasena").value;
  let valido = true;

  limpiarFormulario("formLogin");

  if (!campoRequerido(correo)) {
    mostrarError("loginCorreo", "El correo es obligatorio.");
    valido = false;
  } else if (!validarCorreo(correo)) {
    mostrarError("loginCorreo", "Ingrese un correo válido (ejemplo@correo.com).");
    valido = false;
  } else {
    limpiarError("loginCorreo");
  }

  if (!campoRequerido(contrasena)) {
    mostrarError("loginContrasena", "La contraseña es obligatoria.");
    valido = false;
  } else if (!validarContrasena(contrasena)) {
    mostrarError("loginContrasena", "La contraseña debe tener al menos 6 caracteres.");
    valido = false;
  } else {
    limpiarError("loginContrasena");
  }

  if (valido) {
    // Simular nombre desde correo
    let nombre = correo.split("@")[0];
    guardarSesion(nombre);
    mostrarAlerta("alertaLogin", "✅ Sesión iniciada correctamente. Redirigiendo...", "success");
    setTimeout(function () {
      window.location.href = "../PanelAdmin/dashboard.html";
    }, 1500);
  }
}

/**
 * Maneja el registro de un nuevo usuario
 * Valida todos los campos del formulario de registro
 */
function handleRegistro() {
  let nombre = document.getElementById("regNombre").value;
  let correo = document.getElementById("regCorreo").value;
  let contrasena = document.getElementById("regContrasena").value;
  let confirmar = document.getElementById("regConfirmar").value;
  let terminos = document.getElementById("regTerminos").checked;
  let valido = true;

  limpiarFormulario("formRegistro");

  if (!campoRequerido(nombre)) {
    mostrarError("regNombre", "El nombre completo es obligatorio.");
    valido = false;
  } else {
    limpiarError("regNombre");
  }

  if (!campoRequerido(correo)) {
    mostrarError("regCorreo", "El correo es obligatorio.");
    valido = false;
  } else if (!validarCorreo(correo)) {
    mostrarError("regCorreo", "Ingrese un correo válido.");
    valido = false;
  } else {
    limpiarError("regCorreo");
  }

  if (!validarContrasena(contrasena)) {
    mostrarError("regContrasena", "La contraseña debe tener al menos 6 caracteres.");
    valido = false;
  } else {
    limpiarError("regContrasena");
  }

  if (contrasena !== confirmar) {
    mostrarError("regConfirmar", "Las contraseñas no coinciden.");
    valido = false;
  } else if (campoRequerido(confirmar)) {
    limpiarError("regConfirmar");
  }

  if (!terminos) {
    mostrarAlerta("alertaRegistro", "⚠️ Debe aceptar los términos y condiciones.", "warning");
    valido = false;
  }

  if (valido) {
    guardarSesion(nombre);
    mostrarAlerta("alertaRegistro", "✅ Cuenta creada exitosamente. Redirigiendo...", "success");
    setTimeout(function () {
      window.location.href = "../PanelAdmin/dashboard.html";
    }, 1500);
  }
}
