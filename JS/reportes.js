

async function cargarReportes() {
  let tipo      = document.getElementById('filtroTipo')?.value      || 'todos';
  let mascota   = document.getElementById('filtroMascota')?.value   || '';
  let desde     = document.getElementById('filtroDesde')?.value     || '';
  let hasta     = document.getElementById('filtroHasta')?.value     || '';

  let url = `../API/reportes.php?tipo=${tipo}`;
  if (mascota) url += `&mascota_id=${mascota}`;
  if (desde)   url += `&desde=${desde}`;
  if (hasta)   url += `&hasta=${hasta}`;

  let tbody = document.getElementById('tablaReportesBody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border spinner-border-sm"></div> Cargando...</td></tr>';

  try {
    const resp = await fetch(url, { credentials: 'same-origin' });
    const data = await resp.json();


    let el = (id) => document.getElementById(id);
    if (el('resumenTotal'))    el('resumenTotal').textContent    = data.resumen?.total    || 0;
    if (el('resumenOk'))       el('resumenOk').textContent       = data.resumen?.ok       || 0;
    if (el('resumenProximos')) el('resumenProximos').textContent = data.resumen?.proximos || 0;
    if (el('resumenVencidos')) el('resumenVencidos').textContent = data.resumen?.vencidos || 0;

    if (!tbody) return;
    tbody.innerHTML = '';

    if (!data.exito || data.reportes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay reportes con los filtros seleccionados.</td></tr>';
      return;
    }

    data.reportes.forEach(r => {
      let estadoHTML = r.estado === 'ok'
        ? '<span class="badge-ok">✅ Al día</span>'
        : r.estado === 'proximo'
        ? '<span class="badge-warning">⚠️ Próximo</span>'
        : '<span class="badge-danger">❌ Vencido</span>';
      let tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + r.mascota + '</td>' +
        '<td>' + r.tipo + '</td>' +
        '<td>' + formatearFecha(r.fecha) + '</td>' +
        '<td>' + r.descripcion + '</td>' +
        '<td>' + estadoHTML + '</td>';
      tbody.appendChild(tr);
    });

  } catch (err) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">⚠️ Error de conexión con el servidor.</td></tr>';
  }
}

async function cargarMascotasFiltro() {
  let sel = document.getElementById('filtroMascota');
  if (!sel) return;
  try {
    const resp = await fetch('../API/mascotas.php', { credentials: 'same-origin' });
    const data = await resp.json();
    sel.innerHTML = '<option value="">Todas las mascotas</option>';
    if (data.exito) {
      data.mascotas.forEach(m => {
        let opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.nombre + ' (' + m.especie + ')';
        sel.appendChild(opt);
      });
    }
  } catch (err) { console.warn('Error cargando mascotas filtro'); }
}

window.addEventListener('load', async function () {
  await verificarSesion();
  await cargarMascotasFiltro();
  await cargarReportes();
});
