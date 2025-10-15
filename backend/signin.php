<?php
// backend/signin.php
require_once "db.php";
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);

  $email = $data['email'] ?? '';
  $password = $data['password'] ?? '';

  if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "error" => "Email and password are required"]);
    exit;
  }

  // Fetch user from DB
  $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();
  $user = $result->fetch_assoc();

  if ($user && password_verify($password, $user['password'])) {
    // Attempt to update last_login if the column exists (safe to run on varied schemas)
    $colCheck = $conn->query("SHOW COLUMNS FROM users LIKE 'last_login'");
    if ($colCheck && $colCheck->num_rows > 0) {
      $ustmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
      if ($ustmt) {
        $ustmt->bind_param("i", $user['id']);
        $ustmt->execute();
      }
    }

    echo json_encode([
      "success" => true,
      "message" => "Login successful!",
      "user" => [
        "id" => $user["id"],
        "name" => $user["name"],
        "email" => $user["email"]
      ]
    ]);
  } else {
    echo json_encode(["success" => false, "error" => "Invalid email or password"]);
  }
}
?>
