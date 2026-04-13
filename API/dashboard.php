<?php

require_once 'config.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['exito' => false, 'mensaje' => 'No autenticado']);
    exit;
}

$usuario_id = (int) $_SESSION['usuario_id'];
$conn       = getConexion();
$hoy        = date('Y-m-d');


$q = $conn->prepare('SELECT COUNT(*) AS total FROM mascotas WHERE usuario_id = ?');
$q->bind_param('i', $usuario_id);
$q->execute();
$total_mascotas = $q->get_result()->fetch_assoc()['total'];
$q->close();


$q = $conn->prepare(
    'SELECT COUNT(*) AS total FROM eventos_salud e
     INNER JOIN mascotas m ON m.id = e.mascota_id
     WHERE m.usuario_id = ?'
);
$q->bind_param('i', $usuario_id);
$q->execute();
$total_eventos = $q->get_result()->fetch_assoc()['total'];
$q->close();


$limite = date('Y-m-d', strtotime('+30 days'));
$q = $conn->prepare(
    'SELECT COUNT(*) AS total FROM eventos_salud e
     INNER JOIN mascotas m ON m.id = e.mascota_id
     WHERE m.usuario_id = ? AND e.fecha BETWEEN ? AND ?'
);
$q->bind_param('iss', $usuario_id, $hoy, $limite);
$q->execute();
$eventos_proximos = $q->get_result()->fetch_assoc()['total'];
$q->close();


$q = $conn->prepare(
    'SELECT COUNT(*) AS total FROM eventos_salud e
     INNER JOIN mascotas m ON m.id = e.mascota_id
     WHERE m.usuario_id = ? AND e.fecha < ?'
);
$q->bind_param('is', $usuario_id, $hoy);
$q->execute();
$eventos_vencidos = $q->get_result()->fetch_assoc()['total'];
$q->close();


$q = $conn->prepare(
    'SELECT e.id, m.nombre AS mascota, e.tipo, e.fecha, e.descripcion, e.estado
     FROM eventos_salud e
     INNER JOIN mascotas m ON m.id = e.mascota_id
     WHERE m.usuario_id = ?
     ORDER BY e.fecha DESC
     LIMIT 5'
);
$q->bind_param('i', $usuario_id);
$q->execute();
$result         = $q->get_result();
$ultimos_eventos = [];
while ($row = $result->fetch_assoc()) {
  
    $evento_date = new DateTime($row['fecha']);
    $hoy_date    = new DateTime('today');
    $diff        = (int) $hoy_date->diff($evento_date)->days;
    $futuro      = $evento_date >= $hoy_date;
    $row['estado'] = !$futuro ? 'vencido' : ($diff <= 30 ? 'proximo' : 'ok');
    $ultimos_eventos[] = $row;
}
$q->close();
$conn->close();

echo json_encode([
    'exito' => true,
    'stats' => [
        'total_mascotas'   => (int) $total_mascotas,
        'total_eventos'    => (int) $total_eventos,
        'eventos_proximos' => (int) $eventos_proximos,
        'eventos_vencidos' => (int) $eventos_vencidos,
    ],
    'ultimos_eventos' => $ultimos_eventos,
    'usuario'         => $_SESSION['nombre']
]);
