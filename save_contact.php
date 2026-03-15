<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['name'], $input['email'], $input['message'])) {
        $name = trim($input['name']);
        $email = trim($input['email']);
        $message = trim($input['message']);

        if ($name && $email && $message) {
            $entry = "Name: $name\nEmail: $email\nMessage: $message\n---\n";
            file_put_contents("contact.txt", $entry, FILE_APPEND);
            http_response_code(200);
            echo "Message saved successfully.";
            exit;
        }
    }
    http_response_code(400);
    echo "Invalid input.";
} else {
    http_response_code(405);
    echo "Method not allowed.";
}
?>