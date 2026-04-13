

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}



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

    //  VALIDAR USUARIO REAL
    let usuarios = obtenerUsuarios();

    let usuario = usuarios.find(u => 
      u.correo === correo && u.password === contrasena
    );

    if (!usuario) {
      mostrarAlerta("alertaLogin", " Correo o contraseña incorrectos.", "danger");
      return;
    }

   
    let nombre = usuario.nombre;
    guardarSesion(nombre);

    mostrarAlerta("alertaLogin", " Sesión iniciada correctamente. Redirigiendo...", "success");

    setTimeout(function () {
      window.location.href = "../PanelAdmin/dashboard.html";
    }, 1500);
  }
}



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
    mostrarAlerta("alertaRegistro", " Debe aceptar los términos y condiciones.", "warning");
    valido = false;
  }

  if (valido) {

    // GUARDAR USUARIO
    let usuarios = obtenerUsuarios();

    let existe = usuarios.find(u => u.correo === correo);

    if (existe) {
      mostrarAlerta("alertaRegistro", " Este correo ya está registrado.", "danger");
      return;
    }

    let nuevoUsuario = {
      nombre: nombre,
      correo: correo,
      password: contrasena
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    
    guardarSesion(nombre);

    mostrarAlerta("alertaRegistro", " Cuenta creada exitosamente. Redirigiendo...", "success");

    setTimeout(function () {
      window.location.href = "../PanelAdmin/dashboard.html";
    }, 1500);
  }
}
