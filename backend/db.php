<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "hotelbooker";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
  die(json_encode(["success" => false, "error" => "Database connection failed."]));
}
?>
