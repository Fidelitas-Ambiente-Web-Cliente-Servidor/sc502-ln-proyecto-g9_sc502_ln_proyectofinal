// ============================================================
//  PetHealth – eventos.js  (versión API PHP)
// ============================================================

const API_EVENTOS = '../api/eventos.php';

// ── Cargar eventos desde el servidor ─────────────────────────
async function cargarEventos() {
  const tbody = document.getElementById('tablaEventosBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  try {
    const res  = await fetch(API_EVENTOS, { credentials: 'include' });
    const data = await res.json();

    if (!data.ok) {
      if (res.status === 401) window.location.href = '../Auth/login.html';
      return;
    }

    const eventos = data.eventos;

    if (eventos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay eventos registrados.</td></tr>';
      return;
    }

    eventos.forEach(e => {
      let estadoHTML;
      if (e.estado === 'ok')      estadoHTML = '<span class="badge-ok"> Al día</span>';
      else if (e.estado === 'proximo') estadoHTML = '<span class="badge-warning"> Próximo</span>';
      else                        estadoHTML = '<span class="badge-danger"> Vencido</span>';

      const fila = document.createElement('tr');
      fila.innerHTML =
        `<td>${e.mascota}</td>
         <td>${e.tipo}</td>
         <td>${formatearFecha(e.fecha)}</td>
         <td>${e.descripcion}</td>
         <td>${estadoHTML}</td>
         <td>
           <button class="btn btn-sm btn-outline-danger"
                   onclick="eliminarEvento(${e.id})">Eliminar</button>
         </td>`;
      tbody.appendChild(fila);
    });

  } catch (err) {
    console.error('Error cargando eventos:', err);
  }
}

// ── Agregar evento ───────────────────────────────────────────
async function agregarEvento() {
  const mascota_id  = document.getElementById('evMascota').value;
  const tipo        = document.getElementById('evTipo').value;
  const fecha       = document.getElementById('evFecha').value;
  const descripcion = document.getElementById('evDescripcion').value;
  let valido = true;

  limpiarFormulario('formEvento');

  if (!campoRequerido(mascota_id)) { mostrarError('evMascota',     'Seleccione una mascota.');  valido = false; }
  else                               { limpiarError('evMascota'); }
  if (!campoRequerido(tipo))       { mostrarError('evTipo',        'Seleccione el tipo.');      valido = false; }
  else                               { limpiarError('evTipo'); }
  if (!campoRequerido(fecha))      { mostrarError('evFecha',       'La fecha es obligatoria.'); valido = false; }
  else                               { limpiarError('evFecha'); }
  if (!campoRequerido(descripcion)){ mostrarError('evDescripcion', 'Descripción obligatoria.'); valido = false; }
  else                               { limpiarError('evDescripcion'); }

  if (!valido) return;

  try {
    const res  = await fetch(API_EVENTOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        mascota_id: parseInt(mascota_id),
        tipo, fecha, descripcion,
      }),
    });
    const data = await res.json();

    if (!data.ok) {
      mostrarAlerta('alertaEvento', '⚠️ ' + data.mensaje, 'danger');
      return;
    }

    await cargarEventos();
    document.getElementById('formEvento').reset();
    mostrarAlerta('alertaEvento', '✅ Evento registrado correctamente.', 'success');

  } catch (err) {
    mostrarAlerta('alertaEvento', '❌ Error de conexión.', 'danger');
    console.error(err);
  }
}

// ── Eliminar evento ──────────────────────────────────────────
async function eliminarEvento(id) {
  if (!confirm('¿Eliminar este evento?')) return;

  try {
    const res  = await fetch(`${API_EVENTOS}?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();

    if (!data.ok) {
      alert('Error: ' + data.mensaje);
      return;
    }
    await cargarEventos();
  } catch (err) {
    console.error(err);
  }
}

// ── Inicializar ──────────────────────────────────────────────
window.addEventListener('load', cargarEventos);
