// ============================================================
//  PetHealth – mascotas.js  (versión API PHP)
// ============================================================

const API_MASCOTAS = '../api/mascotas.php';

// ── Cargar mascotas desde el servidor ────────────────────────
async function cargarMascotas() {
  const contenedor = document.getElementById('contenedorMascotas');
  if (!contenedor) return;

  try {
    const res  = await fetch(API_MASCOTAS, { credentials: 'include' });
    const data = await res.json();

    if (!data.ok) {
      if (res.status === 401) window.location.href = '../Auth/login.html';
      return;
    }

    const mascotas = data.mascotas;
    contenedor.innerHTML = '';

    if (mascotas.length === 0) {
      contenedor.innerHTML = '<p class="text-muted text-center mt-3">No hay mascotas registradas aún.</p>';
      return;
    }

    mascotas.forEach((m) => {
      const emoji = m.especie === 'Perro' ? 'Perro' : m.especie === 'Gato' ? 'Gato' : '🐾';
      const card  = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      card.innerHTML =
        `<div class="card card-pethealth h-100">
          <div class="card-header text-center">
            <span style="font-size:2rem">${emoji}</span> ${m.nombre}
          </div>
          <div class="card-body">
            <p><strong>Especie:</strong> ${m.especie}</p>
            <p><strong>Raza:</strong> ${m.raza}</p>
            <p><strong>Edad:</strong> ${m.edad} año(s)</p>
            <p><strong>Peso:</strong> ${m.peso} kg</p>
            <p><strong>Observaciones:</strong> ${m.observaciones}</p>
          </div>
          <div class="card-footer d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary w-50"
                    onclick="verHistorial(${m.id}, '${m.nombre}')">Historial</button>
            <button class="btn btn-sm btn-outline-danger w-50"
                    onclick="eliminarMascota(${m.id}, '${m.nombre}')">Eliminar</button>
          </div>
        </div>`;
      contenedor.appendChild(card);
    });

    // Rellenar select de mascotas en el form de eventos (si existe)
    llenarSelectMascotas(mascotas);

  } catch (err) {
    console.error('Error cargando mascotas:', err);
  }
}

function llenarSelectMascotas(mascotas) {
  const sel = document.getElementById('evMascota');
  if (!sel) return;
  const valorActual = sel.value;
  // Conservar primera opción vacía
  sel.innerHTML = '<option value="">Seleccione una mascota...</option>';
  mascotas.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.nombre;
    sel.appendChild(opt);
  });
  if (valorActual) sel.value = valorActual;
}

// ── Agregar mascota ──────────────────────────────────────────
async function agregarMascota() {
  const nombre        = document.getElementById('mNombre').value;
  const especie       = document.getElementById('mEspecie').value;
  const raza          = document.getElementById('mRaza').value;
  const edad          = document.getElementById('mEdad').value;
  const peso          = document.getElementById('mPeso').value;
  const observaciones = document.getElementById('mObservaciones').value;
  let valido = true;

  limpiarFormulario('formMascota');

  if (!campoRequerido(nombre))  { mostrarError('mNombre',  'El nombre es obligatorio.');  valido = false; }
  else                            { limpiarError('mNombre'); }
  if (!campoRequerido(especie)) { mostrarError('mEspecie', 'Seleccione la especie.');      valido = false; }
  else                            { limpiarError('mEspecie'); }
  if (!campoRequerido(raza))    { mostrarError('mRaza',    'La raza es obligatoria.');     valido = false; }
  else                            { limpiarError('mRaza'); }
  if (!campoRequerido(edad) || isNaN(edad) || parseInt(edad) < 0)
                                  { mostrarError('mEdad',  'Ingrese una edad válida.');    valido = false; }
  else                            { limpiarError('mEdad'); }
  if (!campoRequerido(peso) || isNaN(peso) || parseFloat(peso) <= 0)
                                  { mostrarError('mPeso',  'Ingrese un peso válido.');     valido = false; }
  else                            { limpiarError('mPeso'); }

  if (!valido) return;

  try {
    const res  = await fetch(API_MASCOTAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        nombre, especie, raza,
        edad: parseInt(edad),
        peso: parseFloat(peso),
        observaciones: observaciones || 'Sin observaciones',
      }),
    });
    const data = await res.json();

    if (!data.ok) {
      mostrarAlerta('alertaMascota', '⚠️ ' + data.mensaje, 'danger');
      return;
    }

    await cargarMascotas();
    document.getElementById('formMascota').reset();
    mostrarAlerta('alertaMascota', `✅ Mascota <strong>${nombre}</strong> registrada.`, 'success');

    // Cambiar a pestaña de lista
    const tabMascotas = document.getElementById('tab-mascotas');
    if (tabMascotas) new bootstrap.Tab(tabMascotas).show();

  } catch (err) {
    mostrarAlerta('alertaMascota', '❌ Error de conexión.', 'danger');
    console.error(err);
  }
}

// ── Eliminar mascota ─────────────────────────────────────────
async function eliminarMascota(id, nombre) {
  if (!confirm(`¿Está seguro de que desea eliminar a ${nombre}?`)) return;

  try {
    const res  = await fetch(`${API_MASCOTAS}?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();

    if (!data.ok) {
      mostrarAlerta('alertaMascota', '⚠️ ' + data.mensaje, 'danger');
      return;
    }
    await cargarMascotas();
    mostrarAlerta('alertaMascota', '⚠️ Mascota eliminada.', 'warning');
  } catch (err) {
    console.error(err);
  }
}

// ── Ver historial (modal) ─────────────────────────────────────
function verHistorial(id, nombre) {
  const span = document.getElementById('modalNombreMascota');
  if (span) span.textContent = nombre;
  const modal = new bootstrap.Modal(document.getElementById('modalHistorial'));
  modal.show();
}

// ── Inicializar ──────────────────────────────────────────────
window.addEventListener('load', cargarMascotas);
