<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$datos  = json_decode(file_get_contents('php://input'), true);
$nombre = trim($datos['nombre']  ?? '');
$correo = trim($datos['correo']  ?? '');
$asunto = trim($datos['asunto']  ?? '');
$mensaje = trim($datos['mensaje'] ?? '');

if (empty($nombre) || empty($correo) || empty($asunto) || empty($mensaje)) {
    echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos son obligatorios']);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['exito' => false, 'mensaje' => 'Correo inválido']);
    exit;
}

$conn = getConexion();

$stmt = $conn->prepare(
    'INSERT INTO contacto_mensajes (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)'
);
$stmt->bind_param('ssss', $nombre, $correo, $asunto, $mensaje);

if ($stmt->execute()) {
    $stmt->close(); $conn->close();
    echo json_encode([
        'exito'   => true,
        'mensaje' => 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.'
    ]);
} else {
    echo json_encode(['exito' => false, 'mensaje' => 'Error al enviar el mensaje']);
}
