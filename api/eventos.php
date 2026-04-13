<?php
// ============================================================
// PetHealth - API: Eventos de Salud (CRUD)
// GET    /API/eventos.php                     -> listar eventos del usuario
// GET    /API/eventos.php?mascota_id={id}     -> eventos de una mascota específica
// POST   /API/eventos.php                     -> crear evento
// DELETE /API/eventos.php?id={id}             -> eliminar evento
// ============================================================
require_once 'config.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['exito' => false, 'mensaje' => 'No autenticado']);
    exit;
}

$usuario_id = (int) $_SESSION['usuario_id'];
$metodo     = $_SERVER['REQUEST_METHOD'];
$conn       = getConexion();

// Función para calcular estado según fecha
function calcularEstado(string $fecha): string {
    $hoy   = new DateTime('today');
    $evento = new DateTime($fecha);
    $diff   = $hoy->diff($evento)->days;
    $futuro = $evento >= $hoy;

    if (!$futuro) return 'vencido';
    if ($diff <= 30) return 'proximo';
    return 'ok';
}

// ── GET: Listar eventos ──────────────────────────────────────
if ($metodo === 'GET') {
    $mascota_id = isset($_GET['mascota_id']) ? (int)$_GET['mascota_id'] : 0;

    if ($mascota_id > 0) {
        // Eventos de una mascota específica (verificar que pertenece al usuario)
        $stmt = $conn->prepare(
            'SELECT e.id, e.mascota_id, m.nombre AS mascota_nombre, e.tipo, e.fecha,
                    e.descripcion, e.estado, e.created_at
             FROM eventos_salud e
             INNER JOIN mascotas m ON m.id = e.mascota_id
             WHERE e.mascota_id = ? AND m.usuario_id = ?
             ORDER BY e.fecha DESC'
        );
        $stmt->bind_param('ii', $mascota_id, $usuario_id);
    } else {
        // Todos los eventos del usuario
        $stmt = $conn->prepare(
            'SELECT e.id, e.mascota_id, m.nombre AS mascota_nombre, e.tipo, e.fecha,
                    e.descripcion, e.estado, e.created_at
             FROM eventos_salud e
             INNER JOIN mascotas m ON m.id = e.mascota_id
             WHERE m.usuario_id = ?
             ORDER BY e.fecha DESC'
        );
        $stmt->bind_param('i', $usuario_id);
    }

    $stmt->execute();
    $result  = $stmt->get_result();
    $eventos = [];
    while ($row = $result->fetch_assoc()) {
        // Recalcular estado en tiempo real
        $row['estado'] = calcularEstado($row['fecha']);
        $eventos[] = $row;
    }
    $stmt->close();
    $conn->close();

    echo json_encode(['exito' => true, 'eventos' => $eventos]);
    exit;
}

// ── POST: Crear evento ───────────────────────────────────────
if ($metodo === 'POST') {
    $datos      = json_decode(file_get_contents('php://input'), true);
    $mascota_id = (int)  ($datos['mascota_id'] ?? 0);
    $tipo       = trim($datos['tipo']          ?? '');
    $fecha      = trim($datos['fecha']         ?? '');
    $desc       = trim($datos['descripcion']   ?? '');

    if ($mascota_id <= 0 || empty($tipo) || empty($fecha) || empty($desc)) {
        echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos son obligatorios']);
        exit;
    }

    // Verificar que la mascota pertenece al usuario
    $check = $conn->prepare('SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?');
    $check->bind_param('ii', $mascota_id, $usuario_id);
    $check->execute();
    $check->store_result();
    if ($check->num_rows === 0) {
        $check->close(); $conn->close();
        echo json_encode(['exito' => false, 'mensaje' => 'Mascota no válida']);
        exit;
    }
    $check->close();

    $estado = calcularEstado($fecha);

    $stmt = $conn->prepare(
        'INSERT INTO eventos_salud (mascota_id, tipo, fecha, descripcion, estado) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('issss', $mascota_id, $tipo, $fecha, $desc, $estado);

    if ($stmt->execute()) {
        $nuevo_id = $conn->insert_id;
        $stmt->close(); $conn->close();
        echo json_encode([
            'exito'   => true,
            'mensaje' => 'Evento registrado correctamente',
            'id'      => $nuevo_id,
            'estado'  => $estado
        ]);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al registrar evento: ' . $conn->error]);
    }
    exit;
}

// ── DELETE: Eliminar evento ──────────────────────────────────
if ($metodo === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'ID inválido']);
        exit;
    }

    // Verificar propiedad via JOIN
    $stmt = $conn->prepare(
        'DELETE e FROM eventos_salud e
         INNER JOIN mascotas m ON m.id = e.mascota_id
         WHERE e.id = ? AND m.usuario_id = ?'
    );
    $stmt->bind_param('ii', $id, $usuario_id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        $stmt->close(); $conn->close();
        echo json_encode(['exito' => true, 'mensaje' => 'Evento eliminado correctamente']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'No se pudo eliminar el evento']);
    }
    exit;
}

echo json_encode(['exito' => false, 'mensaje' => 'Método no soportado']);
$conn->close();
