const mysql = require("mysql");

// buat konfigurasi koneksi
// Ganti dengan konfigurasi database Anda
// Ganti nama file ini menjadi database.js
const koneksi = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "", // Ganti dengan nama database Anda
    multipleStatements: true,
});

// koneksi database
koneksi.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

module.exports = koneksi;
