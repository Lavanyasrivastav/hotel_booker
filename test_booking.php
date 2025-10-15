<?php
// Test script to verify booking system
require_once "backend/db.php";

echo "<h2>Hotel Booker - Database Test</h2>";

// Test database connection
if ($conn->connect_error) {
    echo "<p style='color:red'>❌ Database connection failed: " . $conn->connect_error . "</p>";
    exit;
}
echo "<p style='color:green'>✅ Database connection successful</p>";

// Check if bookings table exists and has required columns
$result = $conn->query("DESCRIBE bookings");
if (!$result) {
    echo "<p style='color:red'>❌ Bookings table doesn't exist</p>";
    exit;
}

echo "<h3>Bookings Table Structure:</h3>";
echo "<table border='1' style='border-collapse:collapse; margin:10px 0;'>";
echo "<tr><th>Column</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";

$has_booking_reference = false;
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['Field'] . "</td>";
    echo "<td>" . $row['Type'] . "</td>";
    echo "<td>" . $row['Null'] . "</td>";
    echo "<td>" . $row['Key'] . "</td>";
    echo "<td>" . $row['Default'] . "</td>";
    echo "</tr>";
    
    if ($row['Field'] === 'booking_reference') {
        $has_booking_reference = true;
    }
}
echo "</table>";

if ($has_booking_reference) {
    echo "<p style='color:green'>✅ booking_reference column exists</p>";
} else {
    echo "<p style='color:orange'>⚠️ booking_reference column missing - booking references won't be saved</p>";
}

// Test hotels table
$hotels_result = $conn->query("SELECT COUNT(*) as count FROM hotels");
if ($hotels_result) {
    $hotel_count = $hotels_result->fetch_assoc()['count'];
    echo "<p>✅ Hotels table has $hotel_count hotels</p>";
} else {
    echo "<p style='color:red'>❌ Hotels table issue</p>";
}

// Test users table
$users_result = $conn->query("SELECT COUNT(*) as count FROM users");
if ($users_result) {
    $user_count = $users_result->fetch_assoc()['count'];
    echo "<p>✅ Users table has $user_count users</p>";
} else {
    echo "<p style='color:red'>❌ Users table issue</p>";
}

// Test payments table
$payments_result = $conn->query("SELECT COUNT(*) as count FROM payments");
if ($payments_result) {
    $payment_count = $payments_result->fetch_assoc()['count'];
    echo "<p>✅ Payments table has $payment_count payments</p>";
} else {
    echo "<p style='color:red'>❌ Payments table issue</p>";
}

// Show recent bookings
echo "<h3>Recent Bookings:</h3>";
$bookings_result = $conn->query("SELECT b.*, h.name as hotel_name, u.name as user_name 
                                FROM bookings b 
                                LEFT JOIN hotels h ON b.hotel_id = h.id 
                                LEFT JOIN users u ON b.user_id = u.id 
                                ORDER BY b.created_at DESC 
                                LIMIT 5");

if ($bookings_result && $bookings_result->num_rows > 0) {
    echo "<table border='1' style='border-collapse:collapse; margin:10px 0;'>";
    echo "<tr><th>ID</th><th>User</th><th>Hotel</th><th>Check-in</th><th>Check-out</th><th>Total</th><th>Reference</th></tr>";
    
    while ($booking = $bookings_result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $booking['id'] . "</td>";
        echo "<td>" . ($booking['user_name'] ?: 'N/A') . "</td>";
        echo "<td>" . ($booking['hotel_name'] ?: 'N/A') . "</td>";
        echo "<td>" . $booking['check_in'] . "</td>";
        echo "<td>" . $booking['check_out'] . "</td>";
        echo "<td>₹" . number_format($booking['total_price']) . "</td>";
        echo "<td>" . ($booking['booking_reference'] ?: 'N/A') . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p>No bookings found</p>";
}

echo "<hr>";
echo "<p><strong>Instructions:</strong></p>";
echo "<ul>";
echo "<li>If booking_reference column is missing, run the SQL script: <code>add_booking_reference_column.sql</code></li>";
echo "<li>Test the booking system by going to the main page and trying to book a hotel</li>";
echo "<li>Check browser console for any JavaScript errors</li>";
echo "</ul>";

$conn->close();
?>
