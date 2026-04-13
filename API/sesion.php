<?php

require_once 'config.php';

$accion = $_GET['accion'] ?? '';

if ($accion === 'logout') {
    $_SESSION = [];
    session_destroy();
    echo json_encode(['exito' => true, 'mensaje' => 'Sesión cerrada correctamente']);
    exit;
}

if (isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'exito'     => true,
        'autenticado' => true,
        'usuario'   => [
            'id'     => $_SESSION['usuario_id'],
            'nombre' => $_SESSION['nombre'],
            'correo' => $_SESSION['correo'],
            'rol'    => $_SESSION['rol']
        ]
    ]);
} else {
    echo json_encode([
        'exito'       => true,
        'autenticado' => false
    ]);
}
