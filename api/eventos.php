<?php
// ============================================================
//  PetHealth – API Eventos
//  Rutas:
//    GET    /api/eventos.php              → listar eventos del usuario
//    POST   /api/eventos.php              → crear evento
//    PUT    /api/eventos.php?id={n}       → actualizar evento
//    DELETE /api/eventos.php?id={n}       → eliminar evento
// ============================================================

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$usuario = requerirSesion();
$pdo     = getDB();
$metodo  = $_SERVER['REQUEST_METHOD'];
$id      = isset($_GET['id']) ? (int)$_GET['id'] : null;

/**
 * Calcula el estado de un evento según su fecha.
 */
function calcularEstado(string $fecha): string {
    $hoy      = new DateTime('today');
    $objetivo = new DateTime($fecha);
    $diff     = (int)$hoy->diff($objetivo)->days;
    $futuro   = $objetivo >= $hoy;

    if (!$futuro)       return 'vencido';
    if ($diff <= 30)    return 'proximo';
    return 'ok';
}

// ── GET – Listar eventos ─────────────────────────────────────
if ($metodo === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT e.id, m.nombre AS mascota, e.mascota_id, e.tipo, e.fecha, e.descripcion, e.estado
           FROM eventos e
           JOIN mascotas m ON m.id = e.mascota_id
          WHERE e.usuario_id = ?
          ORDER BY e.fecha DESC'
    );
    $stmt->execute([$usuario['id']]);
    responder(['ok' => true, 'eventos' => $stmt->fetchAll()]);
}

// ── POST – Crear evento ──────────────────────────────────────
if ($metodo === 'POST') {
    $d          = leerJSON();
    $mascota_id = isset($d['mascota_id']) ? (int)$d['mascota_id'] : 0;
    $tipo       = trim($d['tipo']        ?? '');
    $fecha      = trim($d['fecha']       ?? '');
    $descripcion = trim($d['descripcion'] ?? '');

    if (!$mascota_id || !$tipo || !$fecha) {
        responder(['ok' => false, 'mensaje' => 'mascota_id, tipo y fecha son obligatorios.'], 400);
    }

    // Verificar que la mascota pertenece al usuario
    $chk = $pdo->prepare('SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?');
    $chk->execute([$mascota_id, $usuario['id']]);
    if (!$chk->fetch()) {
        responder(['ok' => false, 'mensaje' => 'Mascota no encontrada.'], 404);
    }

    $estado = calcularEstado($fecha);
    $stmt   = $pdo->prepare(
        'INSERT INTO eventos (mascota_id, usuario_id, tipo, fecha, descripcion, estado)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$mascota_id, $usuario['id'], $tipo, $fecha, $descripcion, $estado]);

    responder([
        'ok'      => true,
        'mensaje' => 'Evento registrado.',
        'id'      => (int)$pdo->lastInsertId(),
        'estado'  => $estado,
    ], 201);
}

// ── PUT – Actualizar evento ──────────────────────────────────
if ($metodo === 'PUT' && $id) {
    $chk = $pdo->prepare('SELECT id FROM eventos WHERE id = ? AND usuario_id = ?');
    $chk->execute([$id, $usuario['id']]);
    if (!$chk->fetch()) {
        responder(['ok' => false, 'mensaje' => 'Evento no encontrado.'], 404);
    }

    $d           = leerJSON();
    $mascota_id  = isset($d['mascota_id']) ? (int)$d['mascota_id'] : 0;
    $tipo        = trim($d['tipo']         ?? '');
    $fecha       = trim($d['fecha']        ?? '');
    $descripcion = trim($d['descripcion']  ?? '');

    if (!$mascota_id || !$tipo || !$fecha) {
        responder(['ok' => false, 'mensaje' => 'Todos los campos son obligatorios.'], 400);
    }

    $estado = calcularEstado($fecha);
    $stmt   = $pdo->prepare(
        'UPDATE eventos
            SET mascota_id = ?, tipo = ?, fecha = ?, descripcion = ?, estado = ?
          WHERE id = ? AND usuario_id = ?'
    );
    $stmt->execute([$mascota_id, $tipo, $fecha, $descripcion, $estado, $id, $usuario['id']]);
    responder(['ok' => true, 'mensaje' => 'Evento actualizado.', 'estado' => $estado]);
}

// ── DELETE – Eliminar evento ─────────────────────────────────
if ($metodo === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM eventos WHERE id = ? AND usuario_id = ?');
    $stmt->execute([$id, $usuario['id']]);
    if ($stmt->rowCount() === 0) {
        responder(['ok' => false, 'mensaje' => 'Evento no encontrado.'], 404);
    }
    responder(['ok' => true, 'mensaje' => 'Evento eliminado.']);
}

responder(['ok' => false, 'mensaje' => 'Método no permitido.'], 405);
