<?php
function sanitize($data) {
  return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
  return filter_var($email, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $errors = [];

  $name = sanitize($_POST['name'] ?? '');
  $email = sanitize($_POST['email'] ?? '');
  $destination = sanitize($_POST['destination'] ?? '');
  $days = (int)($_POST['days'] ?? 0);
  $date = sanitize($_POST['date'] ?? '');
  $returnDate = sanitize($_POST['return'] ?? '');
  $people = (int)($_POST['people'] ?? 0);
  $flight = sanitize($_POST['flight'] ?? 'economy');
  $hotelType = sanitize($_POST['hotel'] ?? '3star');
  $meal = sanitize($_POST['meal'] ?? 'veg');
  $guider = sanitize($_POST['guider'] ?? 'no');
  $isInternational = isset($_POST['international']);
  $isLuxury = isset($_POST['luxury']);

  if (empty($name) || strlen($name) < 2) {
    $errors[] = "Please enter a valid name";
  }
  if (!validateEmail($email)) {
    $errors[] = "Please enter a valid email address";
  }
  if (empty($destination)) {
    $errors[] = "Please enter a destination";
  }
  if ($days < 1 || $days > 365) {
    $errors[] = "Please enter valid number of days (1-365)";
  }
  if ($people < 1 || $people > 100) {
    $errors[] = "Please enter valid number of people (1-100)";
  }
  if (empty($date)) {
    $errors[] = "Please select a travel date";
  }
  if (empty($returnDate)) {
    $errors[] = "Please select a return date";
  }

  $allowed_flight = ['economy', 'business', 'firstclass'];
  if (!in_array($flight, $allowed_flight)) {
    $flight = 'economy';
  }
  $allowed_hotel = ['3star', '4star', '5star'];
  if (!in_array($hotelType, $allowed_hotel)) {
    $hotelType = '3star';
  }
  $allowed_meal = ['veg', 'nonveg', 'both'];
  if (!in_array($meal, $allowed_meal)) {
    $meal = 'veg';
  }
  $allowed_guider = ['yes', 'no'];
  if (!in_array($guider, $allowed_guider)) {
    $guider = 'no';
  }

  if (!empty($errors)) {
    echo "<div class='booking-error'>";
    echo "<h2>Booking Failed</h2>";
    echo "<ul>";
    foreach ($errors as $error) {
      echo "<li>" . $error . "</li>";
    }
    echo "</ul>";
    echo "<a href='homepage.html' class='btn-home'>Back to Home</a>";
    echo "</div>";
    exit;
  }

  // Calculate fees
  $travelFee = 2000 * $days;
  $guiderFee = ($guider === 'yes') ? 1500 * $days : 0;
  $visaFee = $isInternational ? 50000 : 0;
  $luxuryFee = $isLuxury ? 3000 * $days : 0;
  $restaurantFee = 2000 * $days;

  switch ($hotelType) {
    case "3star": $hotelFee = 1500 * $days; break;
    case "4star": $hotelFee = 2500 * $days; break;
    case "5star": $hotelFee = 4000 * $days; break;
    default: $hotelFee = 2000 * $days;
  }

  $flightFee = $isInternational
    ? match($flight) {
        'economy' => 10000,
        'business' => 25000,
        'firstclass' => 35000,
        default => 20000,
      }
    : match($flight) {
        'economy' => 5000,
        'business' => 10000,
        'firstclass' => 15000,
        default => 5000,
      };

  $totalPerPerson = $travelFee + $guiderFee + $visaFee + $luxuryFee + $restaurantFee + $hotelFee + $flightFee;
  $totalCost = $totalPerPerson * $people;

  $folderName = "bookings/" . preg_replace("/[^a-zA-Z0-9]/", "_", $name);
  if (!file_exists($folderName)) {
    mkdir($folderName, 0777, true);
  }
  $fileName = "booking_" . date("Ymd_His") . ".txt";
  $filePath = "$folderName/$fileName";

  $data = "Name: $name\nEmail: $email\nDestination: $destination\nTravel Date: $date\nReturn Date: $returnDate\nDays: $days\nPeople: $people\n".
          "International Tour: " . ($isInternational ? "Yes" : "No") . "\nLuxury Package: " . ($isLuxury ? "Yes" : "No") . "\n".
          "Flight Type: $flight\nHotel Type: $hotelType\nMeal Preference: $meal\nNeed Guide: $guider\n\n".
          "Charges Per Person:\n".
          "Travel Fee: ₹$travelFee\nGuide Fee: ₹$guiderFee\nVisa Fee: ₹$visaFee\nLuxury Fee: ₹$luxuryFee\n".
          "Restaurant Fee: ₹$restaurantFee\nHotel Fee: ₹$hotelFee\nFlight Fee: ₹$flightFee\n\n".
          "Total Cost for $people person(s): ₹$totalCost\n";

  file_put_contents($filePath, $data);

  // Show styled confirmation
  echo "<div class='booking-success'>";
  echo "<h2>Booking Successful!</h2>";
  echo "<p>Thank you, $name. Your tour to <strong>$destination</strong> is confirmed from <strong>$date</strong> to <strong>$returnDate</strong>.</p>";
  echo "<p><strong>Total People:</strong> $people<br><strong>Total Cost:</strong> ₹$totalCost</p>";
  echo "<p><a href='$filePath' download class='btn-download'>📥 Download Invoice</a></p>";
  echo "<a href='homepage.html' class='btn-home'>Back to Home</a>";
  echo "</div>";
} else {
?>

<!-- FORM DISPLAY ONLY IF NOT SUBMITTED -->
<div class="booking-form-modal" id="bookingModal">
  <div class="booking-form-content">
    <span class="close-btn" onclick="window.location.href='homepage.html'">&times;</span>
    <h2>Travel Booking Form</h2>
    <form action="booking.php" method="POST" oninput="calculateReturnDate(); calculateCost();">

      <label for="name">Full Name:</label>
      <input type="text" id="name" name="name" required>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>

      <label for="destination">Tour Destination:</label>
      <input type="text" id="destination" name="destination" required>

      <label for="days">Number of Days:</label>
      <input type="number" id="days" name="days" min="1" value="1" required>

      <label for="people">Number of People:</label>
      <input type="number" id="people" name="people" min="1" value="1" required>

      <label for="date">Travel Date:</label>
      <input type="date" id="date" name="date" required>

      <label for="return">Return Date:</label>
      <input type="date" id="return" name="return" readonly>

      <label><input type="checkbox" name="international" id="international"> International Tour (Visa Required)</label>
      <label><input type="checkbox" name="luxury" id="luxury"> Add Luxury Travel Package</label>

      <label for="flight">Flight Type:</label>
      <select name="flight" id="flight">
        <option value="economy">Economy</option>
        <option value="business">Business</option>
        <option value="firstclass">First Class</option>
      </select>

      <label for="hotel">Hotel Type:</label>
      <select name="hotel" id="hotel">
        <option value="3star">3-Star</option>
        <option value="4star">4-Star</option>
        <option value="5star">5-Star</option>
      </select>

      <label for="meal">Meal Preference:</label>
      <select name="meal" id="meal">
        <option value="veg">Vegetarian</option>
        <option value="nonveg">Non-Vegetarian</option>
        <option value="both">Both</option>
      </select>

      <label for="guider">Require Tour Guider:</label>
      <select name="guider" id="guider">
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <p><strong>Estimated Total Cost:</strong> ₹<span id="estimatedCost">0</span></p>

      <input type="submit" value="Book Now">
    </form>
  </div>
</div>

<?php } ?>

<!-- CSS for both form and success -->
<style>
.booking-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  overflow-y: auto;
  z-index: 9999;
  padding: 50px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.booking-form-content {
  background-color: #fff;
  padding: 25px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-in-out;
  margin-top: 20px;
}

.booking-form-content h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.booking-form-content label {
  font-weight: bold;
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  color: #444;
}

.booking-form-content input,
.booking-form-content select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
}

.booking-form-content input[type="submit"] {
  background-color: #007BFF;
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 15px;
  cursor: pointer;
  width: 100%;
}

.booking-form-content input[type="submit"]:hover {
  background-color: #0056b3;
}

.close-btn {
  float: right;
  font-size: 24px;
  cursor: pointer;
  color: #aaa;
}

.close-btn:hover {
  color: #000;
}

/* SUCCESS MESSAGE STYLE */
.booking-success {
  max-width: 600px;
  margin: 80px auto;
  background: #e6ffe6;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 128, 0, 0.2);
  font-family: Arial, sans-serif;
  text-align: center;
  color: #0a4d00;
  animation: fadeIn 0.5s ease-in-out;
}

.booking-success h2 {
  color: #0f730c;
  margin-bottom: 15px;
}

.booking-success .btn-download,
.booking-success .btn-home {
  display: inline-block;
  margin: 10px 8px;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
}

.booking-success .btn-download {
  background-color: #28a745;
  color: white;
}

.booking-success .btn-home {
  background-color: #007bff;
  color: white;
}

.booking-success .btn-download:hover {
  background-color: #218838;
}

.booking-success .btn-home:hover {
  background-color: #0056b3;
}

.booking-error {
  max-width: 600px;
  margin: 80px auto;
  background: #ffe6e6;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(128, 0, 0, 0.2);
  font-family: Arial, sans-serif;
  text-align: center;
  color: #4d0000;
  animation: fadeIn 0.5s ease-in-out;
}

.booking-error h2 {
  color: #cc0000;
  margin-bottom: 15px;
}

.booking-error ul {
  text-align: left;
  margin: 15px 0;
}

.booking-error li {
  margin: 5px 0;
  color: #cc0000;
}

.booking-error .btn-home {
  display: inline-block;
  margin: 10px 8px;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  background-color: #007bff;
  color: white;
}

.booking-error .btn-home:hover {
  background-color: #0056b3;
}
</style>

<!-- Script for date and cost -->
<script>
function calculateReturnDate() {
  const travelDate = document.getElementById("date").value;
  const days = parseInt(document.getElementById("days").value);
  if (travelDate && days) {
    const startDate = new Date(travelDate);
    startDate.setDate(startDate.getDate() + days);
    const returnDate = startDate.toISOString().split('T')[0];
    document.getElementById("return").value = returnDate;
  }
}

function calculateCost() {
  const days = parseInt(document.getElementById("days").value) || 1;
  const people = parseInt(document.getElementById("people").value) || 1;
  const isInternational = document.getElementById("international").checked;
  const isLuxury = document.getElementById("luxury").checked;

  let travelFee = 1000 * days;
  let guiderFee = 2000 * days;
  let visaFee = isInternational ? 10000 : 0;
  let luxuryFee = isLuxury ? 3000 * days : 0;
  let restaurantFee = 1500 * days;
  let hotelFee = 2000 * days;
  let flightFee = isInternational ? 10000 : 5000;

  let totalPerPerson = travelFee + guiderFee + visaFee + luxuryFee + restaurantFee + hotelFee + flightFee;
  let totalCost = totalPerPerson * people;

  document.getElementById("estimatedCost").innerText = totalCost;
}

// Pre-fill from URL
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has('destination')) document.getElementById('destination').value = params.get('destination');
  if (params.has('duration')) document.getElementById('days').value = params.get('duration');
  if (params.has('date')) {
    document.getElementById('date').value = params.get('date');
    calculateReturnDate();
  }
});
</script>
