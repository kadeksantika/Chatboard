<?php
$filename = 'data.csv';
$selectedRoom = isset($_GET['room']) ? $_GET['room'] : '';
$searchTerm = isset($_GET['search']) ? $_GET['search'] : '';
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
$offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
$sortOrder = isset($_GET['sort']) ? $_GET['sort'] : 'asc';

// Check if the file exists and is readable
if (file_exists($filename) && ($file = fopen($filename, 'r')) !== FALSE) {

    $totalCharCount = 0;
    $messageCount = 0;
    $messages = [];

    // Collect all matching messages
    while (($data = fgetcsv($file, 1000, ",")) !== FALSE) {
        $name = $data[0];
        $message = $data[1];
        $room = $data[2];
        $datetime = $data[3];

        $messageWithoutWhitespace = preg_replace('/\s+/', '', $message);
        $charCount = strlen($messageWithoutWhitespace);

        // Filter messages based on room and search term
        if (
            trim($room) === trim($selectedRoom) &&
            (stripos($name, $searchTerm) !== false ||
                stripos($message, $searchTerm) !== false ||
                stripos($datetime, $searchTerm) !== false)
        ) {
            $totalCharCount += $charCount;
            $messageCount++;
            $messages[] = [
                'name' => $name,
                'message' => $message,
                'datetime' => $datetime,
                'charCount' => $charCount
            ];
        }
    }
    fclose($file);

    // Sort messages based on the sort order
    usort($messages, function ($a, $b) use ($sortOrder) {
        return ($sortOrder === 'asc') ? strcmp($a['datetime'], $b['datetime']) : strcmp($b['datetime'], $a['datetime']);
    });

    // Calculate average character count
    $averageCharCount = $messageCount > 0 ? floor($totalCharCount / $messageCount) : 0;

    // Retrieve the last $limit messages
    $messagesCount = count($messages);
    $start = max($messagesCount - $limit, 0); // Ensure start index is not negative
    $messagesToDisplay = array_slice($messages, $start);

    // Display the messages
    foreach ($messagesToDisplay as $msg) {
        echo "
        <div class='border border-gray-200 rounded-md p-5 bg-white shadow-sm gap-2 flex flex-col'>
            <div class='flex justify-between md:items-center md:flex-row flex-col'>
                <p class='font-medium'>{$msg['name']}</p>
                <p class='text-sm font-thin opacity-60'>{$msg['datetime']}</p>
            </div>
            <p class='text-sm'>{$msg['message']}</p>
            <p class='italic text-xs border-l-4 border-emerald-800/50 pl-2 text-emerald-700 opacity-70'>{$msg['charCount']} char</p>
        </div>";
    }

    // Pass average character count to JavaScript
    echo "<script>window.chatData = {averageCharCount: $averageCharCount};</script>";

} else {
    echo "There are no chat yet.";
}
?>
