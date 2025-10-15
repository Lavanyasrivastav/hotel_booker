<?php
// backend/auth.php
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

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

/**
 * Utility function for hashing passwords
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

/**
 * Utility function for verifying password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Register user
 */
if ($action === 'register' && $method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');

    if (!$name || !$email || !$password) {
        echo json_encode(['success' => false, 'error' => 'All fields are required']);
        exit;
    }

    // Check if user already exists
    $check = $conn->prepare("SELECT id FROM users WHERE email=?");
    $check->bind_param("s", $email);
    $check->execute();
    $exists = $check->get_result()->fetch_assoc();

    if ($exists) {
        echo json_encode(['success' => false, 'error' => 'User already exists. Please sign in.']);
        exit;
    }

    $hashed = hashPassword($password);
    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $hashed);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registration successful! Please log in.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Registration failed.']);
    }
    exit;
}

/**
 * Login user
 */
if ($action === 'login' && $method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'error' => 'Email and password required']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email=? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();
    $user = $res->fetch_assoc();

    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'Account not found. Please sign up first.']);
        exit;
    }

    if ($user && verifyPassword($password, $user['password'])) {
        unset($user['password']);
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Incorrect password.']);
    }
    exit;
}

/**
 * If no valid action
 */
echo json_encode(['success' => false, 'error' => 'Invalid request']);
