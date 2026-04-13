<?php
// ============================================================
// PetHealth - Configuración de Base de Datos
// SC-502 Ambiente Web Cliente Servidor | Grupo 9 | Fidelitas
// ============================================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // Cambiar por tu usuario de MySQL
define('DB_PASS', '');           // Cambiar por tu contraseña de MySQL
define('DB_NAME', 'pethealth');
define('DB_CHARSET', 'utf8mb4');

function getConexion() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $conn->set_charset(DB_CHARSET);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error de conexión a la base de datos: ' . $conn->connect_error
        ]);
        exit;
    }
    return $conn;
}

// Headers CORS para peticiones AJAX
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Iniciar sesión PHP para autenticación
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
