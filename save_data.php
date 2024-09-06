<?php
// Nama file CSV
$filename = 'data.csv';

// Data dari form
$name = $_POST['name'];
$message = $_POST['message'];
$room = $_POST['room'];

// Dapatkan tanggal dan waktu saat ini
$datetime = date('Y-m-d H:i:s'); // Format: Tahun-Bulan-Hari Jam:Menit:Detik

// Buka file CSV untuk menulis (append mode)
$file = fopen($filename, 'a');

// Cek apakah file berhasil dibuka
if ($file) {
    // Buat array dari data yang akan disimpan
    $data = [$name, $message, $room, $datetime];

    // Tulis data ke CSV
    fputcsv($file, $data);

    // Tutup file
    fclose($file);

    // Berikan respons sukses
    echo json_encode(['status' => 'success', 'message' => 'Data berhasil disimpan ke CSV']);
} else {
    // Berikan respons gagal
    echo json_encode(['status' => 'error', 'message' => 'Gagal membuka file CSV']);
}
?>