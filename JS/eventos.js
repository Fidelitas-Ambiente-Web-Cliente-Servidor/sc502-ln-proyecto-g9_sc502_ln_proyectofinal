
let eventos = [
  { mascota: "Firulais", tipo: "Vacuna", fecha: "2025-08-15", descripcion: "Vacuna antirrábica", estado: "ok" },
  { mascota: "Luna", tipo: "Desparasitación", fecha: "2025-03-20", descripcion: "Tratamiento interno", estado: "proximo" }
];

/**
 * Carga los eventos en la tabla del DOM
 */
function cargarEventos() {
  let tbody = document.getElementById("tablaEventosBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (eventos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay eventos registrados.</td></tr>';
    return;
  }

  for (let i = 0; i < eventos.length; i++) {
    let e = eventos[i];
    let estadoHTML = "";
    if (e.estado === "ok") {
      estadoHTML = '<span class="badge-ok">✅ Al día</span>';
    } else if (e.estado === "proximo") {
      estadoHTML = '<span class="badge-warning">⚠️ Próximo</span>';
    } else {
      estadoHTML = '<span class="badge-danger">❌ Vencido</span>';
    }

    let fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + e.mascota + "</td>" +
      "<td>" + e.tipo + "</td>" +
      "<td>" + formatearFecha(e.fecha) + "</td>" +
      "<td>" + e.descripcion + "</td>" +
      "<td>" + estadoHTML + "</td>";
    tbody.appendChild(fila);
  }
}

/**
 * Registra un nuevo evento de salud desde el formulario
 */
function agregarEvento() {
  let mascota = document.getElementById("evMascota").value;
  let tipo = document.getElementById("evTipo").value;
  let fecha = document.getElementById("evFecha").value;
  let descripcion = document.getElementById("evDescripcion").value;
  let valido = true;

  limpiarFormulario("formEvento");

  if (!campoRequerido(mascota)) { mostrarError("evMascota", "Seleccione una mascota."); valido = false; }
  else { limpiarError("evMascota"); }

  if (!campoRequerido(tipo)) { mostrarError("evTipo", "Seleccione el tipo de evento."); valido = false; }
  else { limpiarError("evTipo"); }

  if (!campoRequerido(fecha)) { mostrarError("evFecha", "La fecha es obligatoria."); valido = false; }
  else { limpiarError("evFecha"); }

  if (!campoRequerido(descripcion)) { mostrarError("evDescripcion", "La descripción es obligatoria."); valido = false; }
  else { limpiarError("evDescripcion"); }

  if (valido) {
    let estado = estadoFecha(fecha);
    eventos.push({ mascota: mascota, tipo: tipo, fecha: fecha, descripcion: descripcion, estado: estado });
    cargarEventos();
    document.getElementById("formEvento").reset();
    mostrarAlerta("alertaEvento", "✅ Evento registrado correctamente.", "success");
  }
}
