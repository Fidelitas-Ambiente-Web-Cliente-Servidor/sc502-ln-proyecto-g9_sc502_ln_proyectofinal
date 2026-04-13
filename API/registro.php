<?php
// ============================================================
// PetHealth - API: Registro de Usuario
// POST /API/registro.php
// Body JSON: { nombre, correo, password }
// ============================================================
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);

$nombre   = trim($datos['nombre']   ?? '');
$correo   = trim($datos['correo']   ?? '');
$password = trim($datos['password'] ?? '');

// Validaciones básicas del servidor
if (empty($nombre) || empty($correo) || empty($password)) {
    echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos son obligatorios']);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['exito' => false, 'mensaje' => 'El correo no tiene un formato válido']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['exito' => false, 'mensaje' => 'La contraseña debe tener al menos 6 caracteres']);
    exit;
}

$conn = getConexion();

// Verificar si el correo ya existe
$stmt = $conn->prepare('SELECT id FROM usuarios WHERE correo = ?');
$stmt->bind_param('s', $correo);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->close();
    $conn->close();
    echo json_encode(['exito' => false, 'mensaje' => 'Este correo ya está registrado']);
    exit;
}
$stmt->close();

// Hashear contraseña
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// Insertar usuario
$stmt = $conn->prepare('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $nombre, $correo, $hash);

if ($stmt->execute()) {
    $usuario_id = $conn->insert_id;

    // Iniciar sesión automáticamente
    $_SESSION['usuario_id'] = $usuario_id;
    $_SESSION['nombre']     = $nombre;
    $_SESSION['correo']     = $correo;
    $_SESSION['rol']        = 'usuario';

    echo json_encode([
        'exito'   => true,
        'mensaje' => 'Cuenta creada exitosamente',
        'usuario' => ['id' => $usuario_id, 'nombre' => $nombre, 'correo' => $correo]
    ]);
} else {
    echo json_encode(['exito' => false, 'mensaje' => 'Error al crear la cuenta: ' . $conn->error]);
}

$stmt->close();
$conn->close();
