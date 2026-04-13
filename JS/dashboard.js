// ============================================================
// PetHealth - dashboard.js
// Carga datos del panel principal desde la API PHP/MySQL
// SC-502 | Grupo 9 | Universidad Fidelitas
// ============================================================

async function cargarDashboard() {
  try {
    const resp = await fetch('../API/dashboard.php', { credentials: 'same-origin' });
    const data = await resp.json();

    if (!data.exito) {
      console.error('Error dashboard:', data.mensaje);
      return;
    }

    // Estadísticas
    let el = (id) => document.getElementById(id);
    if (el('statMascotas'))  el('statMascotas').textContent  = data.stats.total_mascotas;
    if (el('statEventos'))   el('statEventos').textContent   = data.stats.total_eventos;
    if (el('statProximos'))  el('statProximos').textContent  = data.stats.eventos_proximos;
    if (el('statVencidos'))  el('statVencidos').textContent  = data.stats.eventos_vencidos;

    // Nombre de usuario en la bienvenida
    if (el('bienvenidaNombre')) el('bienvenidaNombre').textContent = data.usuario;

    // Alertas de vencidos/próximos
    let alertaContainer = el('alertasDashboard');
    if (alertaContainer) {
      alertaContainer.innerHTML = '';
      if (data.stats.eventos_vencidos > 0) {
        alertaContainer.innerHTML +=
          '<div class="alert alert-danger alert-dismissible fade show">' +
          '❌ Tienes <strong>' + data.stats.eventos_vencidos + '</strong> evento(s) de salud vencido(s). Revísalos pronto.' +
          '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
      }
      if (data.stats.eventos_proximos > 0) {
        alertaContainer.innerHTML +=
          '<div class="alert alert-warning alert-dismissible fade show">' +
          '⚠️ Tienes <strong>' + data.stats.eventos_proximos + '</strong> evento(s) próximo(s) en los próximos 30 días.' +
          '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
      }
      if (data.stats.eventos_vencidos === 0 && data.stats.eventos_proximos === 0) {
        alertaContainer.innerHTML =
          '<div class="alert alert-success">✅ ¡Todo al día! No hay eventos vencidos ni próximos.</div>';
      }
    }

    // Tabla de últimos eventos
    let tbody = el('tablaUltimosEventos');
    if (tbody) {
      tbody.innerHTML = '';
      if (data.ultimos_eventos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Sin eventos registrados.</td></tr>';
      } else {
        data.ultimos_eventos.forEach(e => {
          let estadoHTML = e.estado === 'ok'
            ? '<span class="badge-ok">✅ Al día</span>'
            : e.estado === 'proximo'
            ? '<span class="badge-warning">⚠️ Próximo</span>'
            : '<span class="badge-danger">❌ Vencido</span>';
          let tr = document.createElement('tr');
          tr.innerHTML =
            '<td>' + e.mascota + '</td>' +
            '<td>' + e.tipo + '</td>' +
            '<td>' + formatearFecha(e.fecha) + '</td>' +
            '<td>' + e.descripcion + '</td>' +
            '<td>' + estadoHTML + '</td>';
          tbody.appendChild(tr);
        });
      }
    }

  } catch (err) {
    console.warn('No se pudo cargar el dashboard desde la API:', err);
    // Mostrar mensaje de error en dashboard
    let alertaContainer = document.getElementById('alertasDashboard');
    if (alertaContainer) {
      alertaContainer.innerHTML =
        '<div class="alert alert-warning">⚠️ No se pudo conectar al servidor PHP/MySQL. Verifique que XAMPP/WAMP esté activo.</div>';
    }
  }
}

window.addEventListener('load', async function () {
  await verificarSesion();
  await cargarDashboard();
});
