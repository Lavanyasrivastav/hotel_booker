<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

// backend/bookings.php
require_once "db.php";
header("Content-Type: application/json");

// Add error logging for debugging
function logError($message) {
    error_log("Booking Error: " . $message);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

/**
 * Availability check:
 * We consider hotel unavailable if there is ANY booking overlapping requested dates
 * for the same hotel where rooms requested would exceed available rooms.
 * For simple demo we assume hotel has unlimited rooms; here we'll just check for overlaps and return true.
 * You can extend with inventory logic as needed.
 */
if ($method === 'GET' && $action === 'availability') {
    $hotel_id = intval($_GET['hotelId'] ?? 0);
    $checkIn = $_GET['checkIn'] ?? '';
    $checkOut = $_GET['checkOut'] ?? '';

    if (!$hotel_id || !$checkIn || !$checkOut) {
        echo json_encode(['success'=>false,'error'=>'Missing parameters']);
        exit;
    }

    // Basic validation
    if ($checkIn >= $checkOut) {
        echo json_encode(['success'=>false,'error'=>'Invalid date range']);
        exit;
    }

    // Simplified: always available for demo
    echo json_encode(['success'=>true,'data'=>['isAvailable'=>true]]);
    exit;
}

/**
 * Create booking:
 * Expect POST body:
 * {
 *  user_id, hotel_id, checkIn, checkOut, guests, rooms, payment_id
 * }
 */
if ($method === 'POST' && $action === 'create') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = intval($data['user_id'] ?? 0);
    $hotel_id = intval($data['hotel_id'] ?? 0);
    $checkIn = $data['checkIn'] ?? '';
    $checkOut = $data['checkOut'] ?? '';
    $guests = intval($data['guests'] ?? 1);
    $rooms = intval($data['rooms'] ?? 1);
    $payment_id = isset($data['payment_id']) ? intval($data['payment_id']) : null;

    if (!$hotel_id || !$checkIn || !$checkOut) {
        echo json_encode(['success'=>false,'error'=>'Missing required booking fields']);
        exit;
    }

    // Enforce that user exists in users table
    if ($user_id <= 0) {
        echo json_encode(['success'=>false,'error'=>'Please sign in to book.']);
        exit;
    }
    $ustmt = $conn->prepare("SELECT id FROM users WHERE id=? LIMIT 1");
    $ustmt->bind_param("i", $user_id);
    $ustmt->execute();
    $ustmt->store_result();
    $ustmt->bind_result($uid_checked);
    $ustmt->fetch();
    if ($ustmt->num_rows === 0) {
        echo json_encode(['success'=>false,'error'=>'User not found. Please sign up first.']);
        exit;
    }

    // Verify payment (if provided)
    if ($payment_id) {
        $pstmt = $conn->prepare("SELECT id, status, payment_reference, method FROM payments WHERE id=? LIMIT 1");
        $pstmt->bind_param("i", $payment_id);
        $pstmt->execute();
        $pstmt->store_result();
        $pstmt->bind_result($pid_checked, $pstatus_checked, $pref_checked, $pmethod_checked);
        $rowExists = $pstmt->num_rows > 0;
        $pstmt->fetch();
        if (!$rowExists) {
            echo json_encode(['success'=>false,'error'=>'Payment record not found']);
            exit;
        }
        if ($pstatus_checked !== 'paid') {
            echo json_encode(['success'=>false,'error'=>'Payment not completed']);
            exit;
        }
        // Use payment method from payment record (credit_card, upi, etc.) if available
        $payment_method_name = $pmethod_checked ?: 'unknown';
    } else {
        echo json_encode(['success'=>false,'error'=>'Payment_id required for booking']);
        exit;
    }

    // Get hotel price to calculate total
    $hstmt = $conn->prepare("SELECT price FROM hotels WHERE id=? LIMIT 1");
    $hstmt->bind_param("i", $hotel_id);
    $hstmt->execute();
    $hstmt->store_result();
    $hstmt->bind_result($hotel_price);
    $hotelExists = $hstmt->num_rows > 0;
    $hstmt->fetch();
    if (!$hotelExists) {
        echo json_encode(['success'=>false,'error'=>'Hotel not found']);
        exit;
    }

    // Calculate nights
    $d1 = new DateTime($checkIn);
    $d2 = new DateTime($checkOut);
    $nights = $d2->diff($d1)->days;
    if ($nights <= 0) $nights = 1;

    $total_price = floatval($hotel_price) * $nights * max(1, $rooms);

    // Insert booking
    $bstmt = $conn->prepare("INSERT INTO bookings (user_id, hotel_id, check_in, check_out, guests, rooms, total_price, payment_method, payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$bstmt) {
        logError("DB prepare failed: " . $conn->error);
        echo json_encode(['success'=>false,'error'=>'Database preparation failed','db_error'=>$conn->error]);
        exit;
    }
    // types: i(int) user_id, i(int) hotel_id, s(string) check_in, s(string) check_out,
    // i(int) guests, i(int) rooms, d(double) total_price, s(string) payment_method, i(int) payment_id
    $pmethod = $payment_method_name;
    $bstmt->bind_param("iissiidsi", $user_id, $hotel_id, $checkIn, $checkOut, $guests, $rooms, $total_price, $pmethod, $payment_id);

    if ($bstmt->execute()) {
        // Use connection insert_id to reliably get the inserted booking id
        $booking_id = $conn->insert_id;
        
        // Generate booking reference
        $booking_ref = 'BK' . strtoupper(bin2hex(random_bytes(5)));
        
        // Try to update booking_reference column (in case it doesn't exist yet)
        try {
            $refstmt = $conn->prepare("UPDATE bookings SET booking_reference=? WHERE id=?");
            if ($refstmt) {
                $refstmt->bind_param("si", $booking_ref, $booking_id);
                $refstmt->execute();
            }
        } catch (Exception $e) {
            // If booking_reference column doesn't exist, continue without it
            error_log("Booking reference update failed: " . $e->getMessage());
        }

        echo json_encode([
            'success' => true,
            'data' => [
                'booking_id' => $booking_id,
                'booking_reference' => $booking_ref,
                'total_amount' => $total_price
            ]
        ]);
    } else {
        // Provide DB error to help diagnose frontend failures during development
        $err = $bstmt->error ?: $conn->error;
        logError("Booking creation failed: " . $err);
        echo json_encode(['success'=>false,'error'=>'Failed to create booking','db_error'=>$err]);
    }
    exit;
}

echo json_encode(['success'=>false,'error'=>'Invalid request']);
