

const API_MASCOTAS = '../API/mascotas.php';
let mascotas = [];


async function cargarMascotas() {
  try {
    const resp = await fetch(API_MASCOTAS, { credentials: 'same-origin' });
    const data = await resp.json();
    if (data.exito) {
      mascotas = data.mascotas;
      renderMascotas();
      poblarSelectMascotas();
    } else {
      mostrarAlerta('alertaMascota', '❌ ' + data.mensaje, 'danger');
    }
  } catch (err) {
    mostrarAlerta('alertaMascota', '⚠️ No se pudo conectar al servidor. Verifique XAMPP/WAMP.', 'warning');
    console.error(err);
  }
}


function renderMascotas() {
  let contenedor = document.getElementById('contenedorMascotas');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (mascotas.length === 0) {
    contenedor.innerHTML = '<p class="text-muted text-center mt-4">No hay mascotas registradas aún. ¡Agrega tu primera mascota! 🐾</p>';
    return;
  }

  mascotas.forEach((m, i) => {
    let emoji = m.especie === 'Perro' ? '🐶' : m.especie === 'Gato' ? '🐱' : m.especie === 'Ave' ? '🐦' : m.especie === 'Reptil' ? '🦎' : '🐾';
    let card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.id = 'card-' + m.id;
    card.innerHTML =
      '<div class="card card-pethealth h-100">' +
        '<div class="card-header text-center">' +
          '<span style="font-size:2rem">' + emoji + '</span> ' + m.nombre +
        '</div>' +
        '<div class="card-body">' +
          '<p><strong>Especie:</strong> ' + m.especie + '</p>' +
          '<p><strong>Raza:</strong> ' + m.raza + '</p>' +
          '<p><strong>Edad:</strong> ' + m.edad + ' año(s)</p>' +
          '<p><strong>Peso:</strong> ' + parseFloat(m.peso).toFixed(1) + ' kg</p>' +
          '<p><strong>Observaciones:</strong> ' + (m.observaciones || 'Sin observaciones') + '</p>' +
        '</div>' +
        '<div class="card-footer d-flex gap-2">' +
          '<button class="btn btn-sm btn-outline-primary w-50" onclick="verHistorial(' + m.id + ', \'' + m.nombre + '\')">📋 Historial</button>' +
          '<button class="btn btn-sm btn-outline-danger w-50" onclick="eliminarMascota(' + m.id + ', \'' + m.nombre + '\')">🗑️ Eliminar</button>' +
        '</div>' +
      '</div>';
    contenedor.appendChild(card);
  });
}

function poblarSelectMascotas() {
  let selects = document.querySelectorAll('.select-mascotas');
  selects.forEach(sel => {
    let valorActual = sel.value;
    sel.innerHTML = '<option value="">-- Seleccione una mascota --</option>';
    mascotas.forEach(m => {
      let emoji = m.especie === 'Perro' ? '🐶' : m.especie === 'Gato' ? '🐱' : '🐾';
      let opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = emoji + ' ' + m.nombre + ' (' + m.especie + ')';
      sel.appendChild(opt);
    });
    if (valorActual) sel.value = valorActual;
  });
}


async function agregarMascota() {
  let nombre   = document.getElementById('mNombre').value.trim();
  let especie  = document.getElementById('mEspecie').value;
  let raza     = document.getElementById('mRaza').value.trim();
  let edad     = document.getElementById('mEdad').value;
  let peso     = document.getElementById('mPeso').value;
  let obs      = document.getElementById('mObservaciones').value.trim();
  let valido   = true;

  limpiarFormulario('formMascota');

  if (!campoRequerido(nombre))  { mostrarError('mNombre',  'El nombre es obligatorio.');    valido = false; }
  if (!campoRequerido(especie)) { mostrarError('mEspecie', 'Seleccione la especie.');       valido = false; }
  if (!campoRequerido(raza))    { mostrarError('mRaza',    'La raza es obligatoria.');      valido = false; }
  if (!campoRequerido(edad) || isNaN(edad) || parseInt(edad) < 0) {
    mostrarError('mEdad', 'Ingrese una edad válida.'); valido = false;
  }
  if (!campoRequerido(peso) || isNaN(peso) || parseFloat(peso) <= 0) {
    mostrarError('mPeso', 'Ingrese un peso válido.');  valido = false;
  }
  if (!valido) return;

  let btn = document.querySelector('#formMascota button[type=button]');
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }

  try {
    const resp = await fetch(API_MASCOTAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, especie, raza, edad: parseInt(edad), peso: parseFloat(peso), observaciones: obs }),
      credentials: 'same-origin'
    });
    const data = await resp.json();
    if (data.exito) {
      await cargarMascotas();
      document.getElementById('formMascota').reset();
      mostrarAlerta('alertaMascota', '✅ Mascota <strong>' + nombre + '</strong> registrada exitosamente.', 'success');
      let tabMascotas = document.getElementById('tab-mascotas');
      if (tabMascotas) new bootstrap.Tab(tabMascotas).show();
    } else {
      mostrarAlerta('alertaMascota', '❌ ' + data.mensaje, 'danger');
    }
  } catch (err) {
    mostrarAlerta('alertaMascota', '⚠️ Error de conexión al guardar.', 'warning');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Registrar mascota'; }
  }
}


async function eliminarMascota(id, nombre) {
  if (!confirm('¿Está seguro de que desea eliminar a ' + nombre + '?\nEsto también eliminará todos sus eventos de salud.')) return;

  try {
    const resp = await fetch(`${API_MASCOTAS}?id=${id}`, {
      method: 'DELETE',
      credentials: 'same-origin'
    });
    const data = await resp.json();
    if (data.exito) {
      await cargarMascotas();
      mostrarAlerta('alertaMascota', '🗑️ Mascota <strong>' + nombre + '</strong> eliminada.', 'warning');
    } else {
      mostrarAlerta('alertaMascota', '❌ ' + data.mensaje, 'danger');
    }
  } catch (err) {
    mostrarAlerta('alertaMascota', '⚠️ Error al eliminar.', 'warning');
  }
}


async function verHistorial(mascota_id, nombre) {
  document.getElementById('modalNombreMascota').textContent = nombre;
  let tbody = document.getElementById('tablaHistorialBody');
  tbody.innerHTML = '<tr><td colspan="4" class="text-center"><div class="spinner-border spinner-border-sm"></div> Cargando...</td></tr>';

  let modal = new bootstrap.Modal(document.getElementById('modalHistorial'));
  modal.show();

  try {
    const resp = await fetch(`../API/eventos.php?mascota_id=${mascota_id}`, { credentials: 'same-origin' });
    const data = await resp.json();
    tbody.innerHTML = '';
    if (!data.exito || data.eventos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Sin eventos registrados.</td></tr>';
      return;
    }
    data.eventos.forEach(e => {
      let estadoHTML = e.estado === 'ok'
        ? '<span class="badge-ok">✅ Al día</span>'
        : e.estado === 'proximo'
        ? '<span class="badge-warning">⚠️ Próximo</span>'
        : '<span class="badge-danger">❌ Vencido</span>';
      let tr = document.createElement('tr');
      tr.innerHTML = '<td>' + formatearFecha(e.fecha) + '</td><td>' + e.tipo + '</td><td>' + e.descripcion + '</td><td>' + estadoHTML + '</td>';
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar historial.</td></tr>';
  }
}


window.addEventListener('load', async function () {
  await verificarSesion();
  await cargarMascotas();
});
