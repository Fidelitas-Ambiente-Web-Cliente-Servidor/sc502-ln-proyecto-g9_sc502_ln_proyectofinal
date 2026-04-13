

const API_EVENTOS   = '../API/eventos.php';
const API_MASCOTAS2 = '../API/mascotas.php';


async function cargarEventos() {
  let tbody = document.getElementById('tablaEventosBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner-border spinner-border-sm"></div> Cargando...</td></tr>';

  try {
    const resp = await fetch(API_EVENTOS, { credentials: 'same-origin' });
    const data = await resp.json();
    tbody.innerHTML = '';

    if (!data.exito || data.eventos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay eventos registrados.</td></tr>';
      return;
    }

    data.eventos.forEach(e => {
      let estadoHTML = e.estado === 'ok'
        ? '<span class="badge-ok">✅ Al día</span>'
        : e.estado === 'proximo'
        ? '<span class="badge-warning">⚠️ Próximo</span>'
        : '<span class="badge-danger">❌ Vencido</span>';

      let tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + e.mascota_nombre + '</td>' +
        '<td>' + e.tipo + '</td>' +
        '<td>' + formatearFecha(e.fecha) + '</td>' +
        '<td>' + e.descripcion + '</td>' +
        '<td>' + estadoHTML + '</td>' +
        '<td><button class="btn btn-sm btn-outline-danger" onclick="eliminarEvento(' + e.id + ')">🗑️</button></td>';
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">⚠️ Error al cargar eventos.</td></tr>';
  }
}


async function cargarMascotasSelect() {
  let sel = document.getElementById('evMascota');
  if (!sel) return;

  try {
    const resp = await fetch(API_MASCOTAS2, { credentials: 'same-origin' });
    const data = await resp.json();
    sel.innerHTML = '<option value="">-- Seleccione una mascota --</option>';
    if (data.exito && data.mascotas.length > 0) {
      data.mascotas.forEach(m => {
        let emoji = m.especie === 'Perro' ? '🐶' : m.especie === 'Gato' ? '🐱' : '🐾';
        let opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = emoji + ' ' + m.nombre;
        sel.appendChild(opt);
      });
    } else {
      sel.innerHTML += '<option disabled>Sin mascotas registradas</option>';
    }
  } catch (err) {
    console.warn('Error al cargar mascotas:', err);
  }
}


async function agregarEvento() {
  let mascota_id = document.getElementById('evMascota').value;
  let tipo       = document.getElementById('evTipo').value;
  let fecha      = document.getElementById('evFecha').value;
  let descripcion = document.getElementById('evDescripcion').value.trim();
  let valido     = true;

  limpiarFormulario('formEvento');

  if (!campoRequerido(mascota_id)) { mostrarError('evMascota',     'Seleccione una mascota.'); valido = false; }
  if (!campoRequerido(tipo))       { mostrarError('evTipo',        'Seleccione el tipo.');     valido = false; }
  if (!campoRequerido(fecha))      { mostrarError('evFecha',       'La fecha es obligatoria.'); valido = false; }
  if (!campoRequerido(descripcion)){ mostrarError('evDescripcion', 'La descripción es obligatoria.'); valido = false; }
  if (!valido) return;

  let btn = document.querySelector('#formEvento button[type=button]');
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }

  try {
    const resp = await fetch(API_EVENTOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mascota_id: parseInt(mascota_id), tipo, fecha, descripcion }),
      credentials: 'same-origin'
    });
    const data = await resp.json();
    if (data.exito) {
      document.getElementById('formEvento').reset();
      mostrarAlerta('alertaEvento', '✅ Evento registrado correctamente.', 'success');
      // Volver al tab de historial
      let tabHistorial = document.querySelector('[data-bs-target="#panelListaEventos"]');
      if (tabHistorial) new bootstrap.Tab(tabHistorial).show();
      await cargarEventos();
    } else {
      mostrarAlerta('alertaEvento', '❌ ' + data.mensaje, 'danger');
    }
  } catch (err) {
    mostrarAlerta('alertaEvento', '⚠️ Error de conexión al guardar.', 'warning');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Registrar evento'; }
  }
}


async function eliminarEvento(id) {
  if (!confirm('¿Desea eliminar este evento de salud?')) return;

  try {
    const resp = await fetch(`${API_EVENTOS}?id=${id}`, {
      method: 'DELETE',
      credentials: 'same-origin'
    });
    const data = await resp.json();
    if (data.exito) {
      await cargarEventos();
    } else {
      alert('Error: ' + data.mensaje);
    }
  } catch (err) {
    alert('Error al eliminar evento.');
  }
}


window.addEventListener('load', async function () {
  await verificarSesion();
  await cargarEventos();
  await cargarMascotasSelect();
});
