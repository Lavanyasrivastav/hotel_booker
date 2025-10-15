<?php
require_once "db.php";
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  if (isset($_GET['q'])) {
    $q = "%" . $_GET['q'] . "%";
    $stmt = $conn->prepare("SELECT * FROM hotels WHERE name LIKE ? OR city LIKE ?");
    $stmt->bind_param("ss", $q, $q);
  } else {
    $stmt = $conn->prepare("SELECT * FROM hotels");
  }

  $stmt->execute();
  $result = $stmt->get_result();
  $hotels = $result->fetch_all(MYSQLI_ASSOC);
  echo json_encode(["success" => true, "data" => $hotels]);
}
?>
