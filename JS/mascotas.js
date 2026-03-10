
// Arreglo que simula las mascotas registradas (se reemplazará con PHP/MySQL)
let mascotas = [
  { nombre: "Firulais", especie: "Perro", raza: "Labrador", edad: 3, peso: 25.5, observaciones: "Alérgico al pollo" },
  { nombre: "Luna", especie: "Gato", raza: "Siamés", edad: 2, peso: 4.2, observaciones: "Vacunas al día" }
];

/**
 * Carga las tarjetas de mascotas en el contenedor del DOM
 */
function cargarMascotas() {
  let contenedor = document.getElementById("contenedorMascotas");
  contenedor.innerHTML = "";

  if (mascotas.length === 0) {
    contenedor.innerHTML = '<p class="text-muted text-center mt-3">No hay mascotas registradas aún.</p>';
    return;
  }

  for (let i = 0; i < mascotas.length; i++) {
    let m = mascotas[i];
    let emoji = m.especie === "Perro" ? "🐶" : m.especie === "Gato" ? "🐱" : "🐾";
    let card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.id = "card-" + i;
    card.innerHTML =
      '<div class="card card-pethealth h-100">' +
        '<div class="card-header text-center">' +
          '<span style="font-size:2rem">' + emoji + '</span> ' + m.nombre +
        '</div>' +
        '<div class="card-body">' +
          '<p><strong>Especie:</strong> ' + m.especie + '</p>' +
          '<p><strong>Raza:</strong> ' + m.raza + '</p>' +
          '<p><strong>Edad:</strong> ' + m.edad + ' año(s)</p>' +
          '<p><strong>Peso:</strong> ' + m.peso + ' kg</p>' +
          '<p><strong>Observaciones:</strong> ' + m.observaciones + '</p>' +
        '</div>' +
        '<div class="card-footer d-flex gap-2">' +
          '<button class="btn btn-sm btn-outline-primary w-50" onclick="verHistorial(' + i + ')">📋 Historial</button>' +
          '<button class="btn btn-sm btn-outline-danger w-50" onclick="eliminarMascota(' + i + ')">🗑️ Eliminar</button>' +
        '</div>' +
      '</div>';
    contenedor.appendChild(card);
  }
}

/**
 * Agrega una nueva mascota desde el formulario y la muestra en el DOM
 */
function agregarMascota() {
  let nombre = document.getElementById("mNombre").value;
  let especie = document.getElementById("mEspecie").value;
  let raza = document.getElementById("mRaza").value;
  let edad = document.getElementById("mEdad").value;
  let peso = document.getElementById("mPeso").value;
  let observaciones = document.getElementById("mObservaciones").value;
  let valido = true;

  limpiarFormulario("formMascota");

  if (!campoRequerido(nombre)) { mostrarError("mNombre", "El nombre es obligatorio."); valido = false; }
  else { limpiarError("mNombre"); }

  if (!campoRequerido(especie)) { mostrarError("mEspecie", "Seleccione la especie."); valido = false; }
  else { limpiarError("mEspecie"); }

  if (!campoRequerido(raza)) { mostrarError("mRaza", "La raza es obligatoria."); valido = false; }
  else { limpiarError("mRaza"); }

  if (!campoRequerido(edad) || isNaN(edad) || parseInt(edad) < 0) {
    mostrarError("mEdad", "Ingrese una edad válida."); valido = false;
  } else { limpiarError("mEdad"); }

  if (!campoRequerido(peso) || isNaN(peso) || parseFloat(peso) <= 0) {
    mostrarError("mPeso", "Ingrese un peso válido."); valido = false;
  } else { limpiarError("mPeso"); }

  if (valido) {
    mascotas.push({
      nombre: nombre,
      especie: especie,
      raza: raza,
      edad: parseInt(edad),
      peso: parseFloat(peso),
      observaciones: observaciones || "Sin observaciones"
    });
    cargarMascotas();
    document.getElementById("formMascota").reset();
    mostrarAlerta("alertaMascota", "✅ Mascota <strong>" + nombre + "</strong> registrada exitosamente.", "success");

    // Ir a la pestaña de mascotas
    let tabMascotas = document.getElementById("tab-mascotas");
    if (tabMascotas) {
      let bsTab = new bootstrap.Tab(tabMascotas);
      bsTab.show();
    }
  }
}

/**
 * Elimina una mascota del arreglo y actualiza el DOM
 * @param {number} indice - Índice en el arreglo mascotas
 */
function eliminarMascota(indice) {
  let nombre = mascotas[indice].nombre;
  let confirmar = confirm("¿Está seguro de que desea eliminar a " + nombre + "?");
  if (confirmar) {
    mascotas.splice(indice, 1);
    cargarMascotas();
    mostrarAlerta("alertaMascota", "🗑️ Mascota eliminada.", "warning");
  }
}

/**
 * Muestra el modal de historial de salud de una mascota
 * @param {number} indice - Índice de la mascota
 */
function verHistorial(indice) {
  let m = mascotas[indice];
  document.getElementById("modalNombreMascota").textContent = m.nombre;
  let modal = new bootstrap.Modal(document.getElementById("modalHistorial"));
  modal.show();
}
