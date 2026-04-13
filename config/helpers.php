<?php
// ============================================================
//  PetHealth – Funciones de utilidad compartidas por la API
// ============================================================

/**
 * Envía una respuesta JSON y termina la ejecución.
 */
function responder(array $datos, int $codigo = 200): void {
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Verifica que el usuario tenga sesión activa.
 * Si no, devuelve 401 y detiene la ejecución.
 */
function requerirSesion(): array {
    session_start();
    if (empty($_SESSION['usuario_id'])) {
        responder(['ok' => false, 'mensaje' => 'No autenticado.'], 401);
    }
    return [
        'id'     => (int)$_SESSION['usuario_id'],
        'nombre' => $_SESSION['nombre'],
        'rol'    => $_SESSION['rol'],
    ];
}

/**
 * Lee el cuerpo de la petición como JSON y lo devuelve como array.
 */
function leerJSON(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
