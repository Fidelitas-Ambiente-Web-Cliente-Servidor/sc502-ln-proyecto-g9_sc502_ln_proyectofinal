<?php

require_once 'config.php';


if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['exito' => false, 'mensaje' => 'No autenticado. Inicie sesión primero.']);
    exit;
}

$usuario_id = (int) $_SESSION['usuario_id'];
$metodo     = $_SERVER['REQUEST_METHOD'];
$conn       = getConexion();


if ($metodo === 'GET') {
    $stmt = $conn->prepare(
        'SELECT id, nombre, especie, raza, edad, peso, observaciones, created_at
         FROM mascotas
         WHERE usuario_id = ?
         ORDER BY nombre ASC'
    );
    $stmt->bind_param('i', $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $mascotas = [];
    while ($row = $result->fetch_assoc()) {
        $mascotas[] = $row;
    }
    $stmt->close();
    $conn->close();

    echo json_encode(['exito' => true, 'mascotas' => $mascotas]);
    exit;
}


if ($metodo === 'POST') {
    $datos  = json_decode(file_get_contents('php://input'), true);
    $nombre = trim($datos['nombre']       ?? '');
    $especie = trim($datos['especie']     ?? '');
    $raza   = trim($datos['raza']         ?? '');
    $edad   = (int)  ($datos['edad']      ?? 0);
    $peso   = (float)($datos['peso']      ?? 0.0);
    $obs    = trim($datos['observaciones'] ?? '');

    if (empty($nombre) || empty($especie) || empty($raza)) {
        echo json_encode(['exito' => false, 'mensaje' => 'Nombre, especie y raza son obligatorios']);
        exit;
    }

    $especies_validas = ['Perro', 'Gato', 'Ave', 'Reptil', 'Otro'];
    if (!in_array($especie, $especies_validas)) {
        echo json_encode(['exito' => false, 'mensaje' => 'Especie no válida']);
        exit;
    }

    if ($edad < 0 || $peso <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'Edad y peso deben ser valores positivos']);
        exit;
    }

    $stmt = $conn->prepare(
        'INSERT INTO mascotas (usuario_id, nombre, especie, raza, edad, peso, observaciones)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('isssiis', $usuario_id, $nombre, $especie, $raza, $edad, $peso, $obs);

    if ($stmt->execute()) {
        $nueva_id = $conn->insert_id;
        $stmt->close();
        $conn->close();
        echo json_encode([
            'exito'   => true,
            'mensaje' => "Mascota '$nombre' registrada exitosamente",
            'id'      => $nueva_id
        ]);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al registrar: ' . $conn->error]);
    }
    exit;
}


if ($metodo === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'ID de mascota inválido']);
        exit;
    }


    $check = $conn->prepare('SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?');
    $check->bind_param('ii', $id, $usuario_id);
    $check->execute();
    $check->store_result();
    if ($check->num_rows === 0) {
        $check->close(); $conn->close();
        echo json_encode(['exito' => false, 'mensaje' => 'Mascota no encontrada']);
        exit;
    }
    $check->close();

    $datos   = json_decode(file_get_contents('php://input'), true);
    $nombre  = trim($datos['nombre']       ?? '');
    $especie = trim($datos['especie']      ?? '');
    $raza    = trim($datos['raza']         ?? '');
    $edad    = (int)  ($datos['edad']      ?? 0);
    $peso    = (float)($datos['peso']      ?? 0.0);
    $obs     = trim($datos['observaciones'] ?? '');

    $stmt = $conn->prepare(
        'UPDATE mascotas SET nombre=?, especie=?, raza=?, edad=?, peso=?, observaciones=?
         WHERE id=? AND usuario_id=?'
    );
    $stmt->bind_param('sssiids', $nombre, $especie, $raza, $edad, $peso, $obs, $id, $usuario_id);

    if ($stmt->execute()) {
        $stmt->close(); $conn->close();
        echo json_encode(['exito' => true, 'mensaje' => 'Mascota actualizada correctamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al actualizar: ' . $conn->error]);
    }
    exit;
}


if ($metodo === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'ID inválido']);
        exit;
    }

    $stmt = $conn->prepare('DELETE FROM mascotas WHERE id = ? AND usuario_id = ?');
    $stmt->bind_param('ii', $id, $usuario_id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        $stmt->close(); $conn->close();
        echo json_encode(['exito' => true, 'mensaje' => 'Mascota eliminada correctamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'No se pudo eliminar la mascota']);
    }
    exit;
}

echo json_encode(['exito' => false, 'mensaje' => 'Método no soportado']);
$conn->close();
