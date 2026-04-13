<?php
// ============================================================
//  PetHealth – API Mascotas
//  Rutas:
//    GET    /api/mascotas.php              → listar mis mascotas
//    POST   /api/mascotas.php              → crear mascota
//    PUT    /api/mascotas.php?id={n}       → actualizar mascota
//    DELETE /api/mascotas.php?id={n}       → eliminar mascota
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

// ── GET – Listar mascotas del usuario ────────────────────────
if ($metodo === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT id, nombre, especie, raza, edad, peso, observaciones
           FROM mascotas
          WHERE usuario_id = ?
          ORDER BY nombre'
    );
    $stmt->execute([$usuario['id']]);
    responder(['ok' => true, 'mascotas' => $stmt->fetchAll()]);
}

// ── POST – Crear mascota ─────────────────────────────────────
if ($metodo === 'POST') {
    $d = leerJSON();
    $nombre       = trim($d['nombre']       ?? '');
    $especie      = trim($d['especie']      ?? '');
    $raza         = trim($d['raza']         ?? '');
    $edad         = isset($d['edad'])        ? (int)$d['edad']         : null;
    $peso         = isset($d['peso'])        ? (float)$d['peso']       : null;
    $observaciones = trim($d['observaciones'] ?? 'Sin observaciones');

    if (!$nombre || !$especie || !$raza || $edad === null || $peso === null) {
        responder(['ok' => false, 'mensaje' => 'Todos los campos son obligatorios.'], 400);
    }
    if ($edad < 0 || $peso <= 0) {
        responder(['ok' => false, 'mensaje' => 'Edad o peso inválidos.'], 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO mascotas (usuario_id, nombre, especie, raza, edad, peso, observaciones)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$usuario['id'], $nombre, $especie, $raza, $edad, $peso, $observaciones]);
    $nuevoId = (int)$pdo->lastInsertId();

    responder([
        'ok'      => true,
        'mensaje' => "Mascota $nombre registrada.",
        'id'      => $nuevoId,
    ], 201);
}

// ── PUT – Actualizar mascota ─────────────────────────────────
if ($metodo === 'PUT' && $id) {
    // Verificar que la mascota pertenece al usuario
    $check = $pdo->prepare('SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?');
    $check->execute([$id, $usuario['id']]);
    if (!$check->fetch()) {
        responder(['ok' => false, 'mensaje' => 'Mascota no encontrada.'], 404);
    }

    $d = leerJSON();
    $nombre        = trim($d['nombre']        ?? '');
    $especie       = trim($d['especie']       ?? '');
    $raza          = trim($d['raza']          ?? '');
    $edad          = isset($d['edad'])         ? (int)$d['edad']   : null;
    $peso          = isset($d['peso'])         ? (float)$d['peso'] : null;
    $observaciones = trim($d['observaciones'] ?? '');

    if (!$nombre || !$especie || !$raza || $edad === null || $peso === null) {
        responder(['ok' => false, 'mensaje' => 'Todos los campos son obligatorios.'], 400);
    }

    $stmt = $pdo->prepare(
        'UPDATE mascotas
            SET nombre = ?, especie = ?, raza = ?, edad = ?, peso = ?, observaciones = ?
          WHERE id = ? AND usuario_id = ?'
    );
    $stmt->execute([$nombre, $especie, $raza, $edad, $peso, $observaciones, $id, $usuario['id']]);
    responder(['ok' => true, 'mensaje' => 'Mascota actualizada.']);
}

// ── DELETE – Eliminar mascota ────────────────────────────────
if ($metodo === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM mascotas WHERE id = ? AND usuario_id = ?');
    $stmt->execute([$id, $usuario['id']]);
    if ($stmt->rowCount() === 0) {
        responder(['ok' => false, 'mensaje' => 'Mascota no encontrada.'], 404);
    }
    responder(['ok' => true, 'mensaje' => 'Mascota eliminada.']);
}

responder(['ok' => false, 'mensaje' => 'Método no permitido.'], 405);
