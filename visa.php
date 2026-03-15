<?php
function sanitizeFolderName($name) {
    return strtolower(preg_replace('/[^A-Za-z0-9_\-]/', '_', $name));
}

// Get and validate POST fields
$visaType    = trim($_POST['visaType'] ?? '');
$country     = trim($_POST['country'] ?? '');
$fullName    = trim($_POST['fullName'] ?? '');
$email       = trim($_POST['email'] ?? '');
$phone       = trim($_POST['phone'] ?? '');
$passport    = trim($_POST['passport'] ?? '');
$nationality = trim($_POST['nationality'] ?? '');
$travelDates = trim($_POST['travelDates'] ?? '');

if (!$visaType || !$country || !$fullName || !$email || !$phone || !$passport || !$nationality || !$travelDates) {
    die("Please fill in all required fields.");
}

// Define folder structure: /applicants/username/
$mainFolder       = __DIR__ . '/applicants';
$applicantFolder  = $mainFolder . '/' . sanitizeFolderName($fullName);

// Check if already exists
if (is_dir($applicantFolder)) {
    die("An application with this name already exists.");
}

// Create applicant folder
if (!mkdir($applicantFolder, 0777, true)) {
    die("Failed to create applicant folder.");
}

// Save data to data.txt
$data  = "Visa Type: $visaType\n";
$data .= "Destination Country: $country\n";
$data .= "Full Name: $fullName\n";
$data .= "Email: $email\n";
$data .= "Phone: $phone\n";
$data .= "Passport Number: $passport\n";
$data .= "Nationality: $nationality\n";
$data .= "Travel Dates: $travelDates\n";

file_put_contents($applicantFolder . '/data.txt', $data);

// Save uploaded documents
if (!empty($_FILES['documents']['name'])) {
    foreach ($_FILES['documents']['name'] as $docLabel => $filename) {
        if ($_FILES['documents']['error'][$docLabel] === UPLOAD_ERR_OK) {
            $tmpName   = $_FILES['documents']['tmp_name'][$docLabel];
            $safeName  = sanitizeFolderName($docLabel) . '_' . basename($filename);
            $target    = $applicantFolder . '/' . $safeName;

            if (!move_uploaded_file($tmpName, $target)) {
                die("❌ Failed to upload document: $docLabel");
            }
        } else {
            die("❌ Error uploading: $docLabel");
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Application Submitted | ＳＴ ✪ Ｒ Tours And Travels</title>
    <link rel="stylesheet" href="visa.css">
    <style>
        .submission-success {
            margin: 80px auto;
            max-width: 700px;
            padding: 30px;
            border: 2px solid #4CAF50;
            background-color: #e6f9e6;
            border-radius: 10px;
            color: #2e7d32;
            font-size: 18px;
            line-height: 1.7;
            box-shadow: 0 0 15px rgba(76, 175, 80, 0.2);
            text-align: center;
            animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .home-button {
            margin-top: 20px;
            display: inline-block;
            padding: 12px 24px;
            font-size: 16px;
            background-color: #0077cc;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background-color 0.3s ease;
        }

        .home-button:hover {
            background-color: #005fa3;
        }
    </style>
</head>
<body>

    <div class="submission-success">
        <h2>✅ Application Submitted Successfully</h2>
        <p>Thank you, <strong><?php echo htmlspecialchars($fullName); ?></strong>.</p>
        <p>Your visa application for <strong><?php echo htmlspecialchars($country); ?></strong> 
            (<strong><?php echo htmlspecialchars($visaType); ?></strong>) has been received.</p>
        <p>We will contact you via email or phone shortly.</p>

        <a class="home-button" href="homepage.html">⬅ Back to Home</a>
    </div>

</body>
</html>
