<?php
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function sanitizeFolderName($name) {
    return strtolower(preg_replace('/[^A-Za-z0-9_\-]/', '_', $name));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    return preg_match('/^[6-9]\d{9}$/', $phone);
}

function validatePassport($passport) {
    return preg_match('/^[A-Z]{1,2}\d{6,9}$/', strtoupper($passport));
}

$errors = [];

$visaType    = sanitize($_POST['visaType'] ?? '');
$country     = sanitize($_POST['country'] ?? '');
$fullName    = sanitize($_POST['fullName'] ?? '');
$email       = sanitize($_POST['email'] ?? '');
$phone       = sanitize($_POST['phone'] ?? '');
$passport    = sanitize($_POST['passport'] ?? '');
$nationality = sanitize($_POST['nationality'] ?? '');
$travelDates = sanitize($_POST['travelDates'] ?? '');

if (empty($visaType)) {
    $errors[] = "Please select a visa type";
}
if (empty($country)) {
    $errors[] = "Please enter destination country";
}
if (empty($fullName) || strlen($fullName) < 2) {
    $errors[] = "Please enter a valid full name";
}
if (!validateEmail($email)) {
    $errors[] = "Please enter a valid email address";
}
if (!validatePhone($phone)) {
    $errors[] = "Please enter a valid 10-digit phone number";
}
if (!validatePassport($passport)) {
    $errors[] = "Please enter a valid passport number";
}
if (empty($nationality)) {
    $errors[] = "Please enter your nationality";
}
if (empty($travelDates)) {
    $errors[] = "Please enter travel dates";
}

if (!empty($errors)) {
    echo "<!DOCTYPE html><html><head><title>Error</title></head><body>";
    echo "<div style='max-width:600px;margin:80px auto;padding:30px;background:#ffe6e6;border-radius:10px;text-align:center;'>";
    echo "<h2 style='color:#cc0000;'>Application Failed</h2><ul style='text-align:left;'>";
    foreach ($errors as $error) {
        echo "<li style='color:#cc0000;margin:5px 0;'>" . $error . "</li>";
    }
    echo "</ul><a href='visa.html' style='display:inline-block;padding:10px 20px;background:#0077cc;color:white;text-decoration:none;border-radius:5px;'>Back to Form</a>";
    echo "</div></body></html>";
    exit;
}

$allowed_visa_types = ['tourist', 'business', 'student', 'work', 'transit'];
if (!in_array($visaType, $allowed_visa_types)) {
    $errors[] = "Invalid visa type";
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
$allowed_types = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
$max_size = 5 * 1024 * 1024; // 5MB

if (!empty($_FILES['documents']['name'])) {
    foreach ($_FILES['documents']['name'] as $docLabel => $filename) {
        if ($_FILES['documents']['error'][$docLabel] === UPLOAD_ERR_OK) {
            $tmpName = $_FILES['documents']['tmp_name'][$docLabel];
            $fileSize = $_FILES['documents']['size'][$docLabel];
            $fileType = mime_content_type($tmpName);
            $safeName = sanitizeFolderName($docLabel) . '_' . basename($filename);
            $target = $applicantFolder . '/' . $safeName;

            if ($fileSize > $max_size) {
                rmdir($applicantFolder);
                die("<div style='max-width:600px;margin:80px auto;padding:30px;background:#ffe6e6;border-radius:10px;text-align:center;'><h2 style='color:#cc0000;'>File too large</h2><p>Maximum file size is 5MB</p><a href='visa.html' style='display:inline-block;padding:10px 20px;background:#0077cc;color:white;text-decoration:none;border-radius:5px;'>Back to Form</a></div>");
            }

            if (!in_array($fileType, $allowed_types)) {
                rmdir($applicantFolder);
                die("<div style='max-width:600px;margin:80px auto;padding:30px;background:#ffe6e6;border-radius:10px;text-align:center;'><h2 style='color:#cc0000;'>Invalid file type</h2><p>Only JPG, PNG and PDF files are allowed</p><a href='visa.html' style='display:inline-block;padding:10px 20px;background:#0077cc;color:white;text-decoration:none;border-radius:5px;'>Back to Form</a></div>");
            }

            if (!move_uploaded_file($tmpName, $target)) {
                rmdir($applicantFolder);
                die("<div style='max-width:600px;margin:80px auto;padding:30px;background:#ffe6e6;border-radius:10px;text-align:center;'><h2 style='color:#cc0000;'>Upload failed</h2><p>Could not upload document: $docLabel</p><a href='visa.html' style='display:inline-block;padding:10px 20px;background:#0077cc;color:white;text-decoration:none;border-radius:5px;'>Back to Form</a></div>");
            }
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
