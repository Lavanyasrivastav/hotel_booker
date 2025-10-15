<?php
// backend/payments.php
require_once "db.php";
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 0);
set_error_handler(function ($severity, $message, $file, $line) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error', 'details' => $message, 'line' => $line]);
    exit;
});
set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server exception', 'details' => $e->getMessage()]);
    exit;
});

// Simple UUID generator for payment reference
function genRef($prefix='PAY') {
    return $prefix . strtoupper(bin2hex(random_bytes(6)));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'create') {
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = intval($data['user_id'] ?? 0);
    $amount = floatval($data['amount'] ?? 0);
    $methodName = $data['method'] ?? 'test';

    if ($amount <= 0) {
        echo json_encode(['success'=>false,'error'=>'Invalid amount']);
        exit;
    }

    $payment_ref = genRef();

    $stmt = $conn->prepare("INSERT INTO payments (payment_reference, user_id, amount, method, status) VALUES (?, ?, ?, ?, 'created')");
    $stmt->bind_param("sids", $payment_ref, $user_id, $amount, $methodName);

    if ($stmt->execute()) {
        $payment_id = $stmt->insert_id;

        // Simulate redirect to gateway and immediate success for local testing:
        // In a real integration you'd redirect to gateway and receive a webhook/callback to update status.
        // For local demo we'll immediately mark as 'paid' (simulate successful payment).
        $update = $conn->prepare("UPDATE payments SET status='paid', gateway_response=? WHERE id=?");
        $gateway_resp = json_encode(['simulated' => true, 'message' => 'Payment auto-approved (test mode)']);
        $update->bind_param("si", $gateway_resp, $payment_id);
        $update->execute();

        echo json_encode([
            'success' => true,
            'data' => [
                'payment_id' => $payment_id,
                'payment_reference' => $payment_ref,
                'status' => 'paid'
            ]
        ]);
    } else {
        echo json_encode(['success'=>false,'error'=>'Failed to create payment record']);
    }
    exit;
}

// Endpoint to check payment status
if ($method === 'GET' && $action === 'status') {
    $ref = $_GET['ref'] ?? '';
    $stmt = $conn->prepare("SELECT id, payment_reference, status, amount, method, gateway_response FROM payments WHERE payment_reference=? LIMIT 1");
    $stmt->bind_param("s", $ref);
    $stmt->execute();
    $res = $stmt->get_result();
    $p = $res->fetch_assoc();
    if ($p) {
        echo json_encode(['success'=>true,'data'=>$p]);
    } else {
        echo json_encode(['success'=>false,'error'=>'Payment not found']);
    }
    exit;
}

echo json_encode(['success'=>false,'error'=>'Invalid request']);
