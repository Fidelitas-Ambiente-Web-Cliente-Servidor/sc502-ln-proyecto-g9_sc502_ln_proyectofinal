<?php
// ============================================================
// PetHealth - API: Reportes
// GET /API/reportes.php?tipo={vacunas|desparasitaciones|citas|todos}
//                      &mascota_id={id}   (opcional)
//                      &desde={YYYY-MM-DD}&hasta={YYYY-MM-DD}
// ============================================================
require_once 'config.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['exito' => false, 'mensaje' => 'No autenticado']);
    exit;
}

$usuario_id = (int) $_SESSION['usuario_id'];
$conn       = getConexion();

$tipo_map = [
    'vacunas'           => 'Vacuna',
    'desparasitaciones' => 'Desparasitación',
    'citas'             => 'Cita veterinaria',
    'revisiones'        => 'Revisión general',
    'todos'             => null,
];

$tipo_param  = $_GET['tipo']        ?? 'todos';
$mascota_id  = isset($_GET['mascota_id']) ? (int)$_GET['mascota_id'] : 0;
$desde       = $_GET['desde']       ?? null;
$hasta       = $_GET['hasta']       ?? null;

$tipo_sql = $tipo_map[$tipo_param] ?? null;

// Construir la query dinámica
$sql = 'SELECT e.id, m.nombre AS mascota, m.especie, e.tipo, e.fecha, e.descripcion, e.estado
        FROM eventos_salud e
        INNER JOIN mascotas m ON m.id = e.mascota_id
        WHERE m.usuario_id = ?';

$params  = [$usuario_id];
$types   = 'i';

if ($tipo_sql) {
    $sql    .= ' AND e.tipo = ?';
    $params[] = $tipo_sql;
    $types   .= 's';
}

if ($mascota_id > 0) {
    $sql    .= ' AND e.mascota_id = ?';
    $params[] = $mascota_id;
    $types   .= 'i';
}

if ($desde) {
    $sql    .= ' AND e.fecha >= ?';
    $params[] = $desde;
    $types   .= 's';
}

if ($hasta) {
    $sql    .= ' AND e.fecha <= ?';
    $params[] = $hasta;
    $types   .= 's';
}

$sql .= ' ORDER BY e.fecha DESC';

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result   = $stmt->get_result();
$reportes = [];

$hoy = new DateTime('today');
while ($row = $result->fetch_assoc()) {
    $fecha_ev = new DateTime($row['fecha']);
    $diff     = (int) $hoy->diff($fecha_ev)->days;
    $futuro   = $fecha_ev >= $hoy;
    $row['estado'] = !$futuro ? 'vencido' : ($diff <= 30 ? 'proximo' : 'ok');
    $reportes[] = $row;
}

$stmt->close();

// Resumen estadístico
$total   = count($reportes);
$ok      = count(array_filter($reportes, fn($r) => $r['estado'] === 'ok'));
$proximos = count(array_filter($reportes, fn($r) => $r['estado'] === 'proximo'));
$vencidos = count(array_filter($reportes, fn($r) => $r['estado'] === 'vencido'));

$conn->close();

echo json_encode([
    'exito'    => true,
    'reportes' => $reportes,
    'resumen'  => [
        'total'    => $total,
        'ok'       => $ok,
        'proximos' => $proximos,
        'vencidos' => $vencidos,
    ]
]);
