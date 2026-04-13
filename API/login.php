<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);

$correo   = trim($datos['correo']   ?? '');
$password = trim($datos['password'] ?? '');

if (empty($correo) || empty($password)) {
    echo json_encode(['exito' => false, 'mensaje' => 'Correo y contraseña son obligatorios']);
    exit;
}

$conn = getConexion();

$stmt = $conn->prepare('SELECT id, nombre, correo, password, rol, activo FROM usuarios WHERE correo = ?');
$stmt->bind_param('s', $correo);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();
$stmt->close();
$conn->close();

if (!$usuario) {
    echo json_encode(['exito' => false, 'mensaje' => 'Correo o contraseña incorrectos']);
    exit;
}

if (!$usuario['activo']) {
    echo json_encode(['exito' => false, 'mensaje' => 'Esta cuenta está desactivada']);
    exit;
}

if (!password_verify($password, $usuario['password'])) {
    echo json_encode(['exito' => false, 'mensaje' => 'Correo o contraseña incorrectos']);
    exit;
}


$_SESSION['usuario_id'] = $usuario['id'];
$_SESSION['nombre']     = $usuario['nombre'];
$_SESSION['correo']     = $usuario['correo'];
$_SESSION['rol']        = $usuario['rol'];

echo json_encode([
    'exito'   => true,
    'mensaje' => 'Sesión iniciada correctamente',
    'usuario' => [
        'id'     => $usuario['id'],
        'nombre' => $usuario['nombre'],
        'correo' => $usuario['correo'],
        'rol'    => $usuario['rol']
    ]
]);
