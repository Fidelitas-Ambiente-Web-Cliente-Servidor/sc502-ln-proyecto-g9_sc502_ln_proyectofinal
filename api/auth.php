<?php
// ============================================================
//  PetHealth – API Auth
//  Rutas:
//    POST   /api/auth.php?accion=login
//    POST   /api/auth.php?accion=registro
//    POST   /api/auth.php?accion=logout
//    GET    /api/auth.php?accion=sesion
// ============================================================

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$accion = $_GET['accion'] ?? '';

// ── LOGIN ────────────────────────────────────────────────────
if ($accion === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    $datos = leerJSON();
    $correo    = trim($datos['correo']    ?? '');
    $contrasena = trim($datos['contrasena'] ?? '');

    if (!$correo || !$contrasena) {
        responder(['ok' => false, 'mensaje' => 'Correo y contraseña son obligatorios.'], 400);
    }

    $pdo  = getDB();
    $stmt = $pdo->prepare('SELECT id, nombre, correo, password, rol FROM usuarios WHERE correo = ?');
    $stmt->execute([$correo]);
    $usuario = $stmt->fetch();

    if (!$usuario || !password_verify($contrasena, $usuario['password'])) {
        responder(['ok' => false, 'mensaje' => 'Correo o contraseña incorrectos.'], 401);
    }

    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['nombre']     = $usuario['nombre'];
    $_SESSION['rol']        = $usuario['rol'];

    responder([
        'ok'     => true,
        'mensaje' => 'Sesión iniciada.',
        'usuario' => [
            'id'     => $usuario['id'],
            'nombre' => $usuario['nombre'],
            'rol'    => $usuario['rol'],
        ],
    ]);
}

// ── REGISTRO ─────────────────────────────────────────────────
if ($accion === 'registro' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    $datos = leerJSON();
    $nombre    = trim($datos['nombre']    ?? '');
    $correo    = trim($datos['correo']    ?? '');
    $contrasena = trim($datos['contrasena'] ?? '');

    // Validaciones básicas (el front ya valida, pero el back también)
    if (!$nombre || !$correo || !$contrasena) {
        responder(['ok' => false, 'mensaje' => 'Todos los campos son obligatorios.'], 400);
    }
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        responder(['ok' => false, 'mensaje' => 'Correo inválido.'], 400);
    }
    if (strlen($contrasena) < 6) {
        responder(['ok' => false, 'mensaje' => 'La contraseña debe tener al menos 6 caracteres.'], 400);
    }

    $pdo = getDB();

    // Verificar duplicado
    $check = $pdo->prepare('SELECT id FROM usuarios WHERE correo = ?');
    $check->execute([$correo]);
    if ($check->fetch()) {
        responder(['ok' => false, 'mensaje' => 'Este correo ya está registrado.'], 409);
    }

    $hash = password_hash($contrasena, PASSWORD_BCRYPT);
    $ins  = $pdo->prepare('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)');
    $ins->execute([$nombre, $correo, $hash]);
    $id = (int)$pdo->lastInsertId();

    $_SESSION['usuario_id'] = $id;
    $_SESSION['nombre']     = $nombre;
    $_SESSION['rol']        = 'usuario';

    responder([
        'ok'      => true,
        'mensaje' => 'Cuenta creada exitosamente.',
        'usuario' => ['id' => $id, 'nombre' => $nombre, 'rol' => 'usuario'],
    ], 201);
}

// ── LOGOUT ───────────────────────────────────────────────────
if ($accion === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    session_destroy();
    responder(['ok' => true, 'mensaje' => 'Sesión cerrada.']);
}

// ── VERIFICAR SESIÓN ─────────────────────────────────────────
if ($accion === 'sesion' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    session_start();
    if (!empty($_SESSION['usuario_id'])) {
        responder([
            'ok'      => true,
            'usuario' => [
                'id'     => (int)$_SESSION['usuario_id'],
                'nombre' => $_SESSION['nombre'],
                'rol'    => $_SESSION['rol'],
            ],
        ]);
    }
    responder(['ok' => false, 'mensaje' => 'Sin sesión activa.'], 401);
}

responder(['ok' => false, 'mensaje' => 'Acción no válida.'], 404);
