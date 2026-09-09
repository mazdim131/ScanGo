// NOTE: Pengecekan role admin DINONAKTIFKAN sementara (per permintaan: "hapus aja tokennya").
// Semua request diizinkan tanpa cek role. Kode asli tetap tersimpan di komentar di bawah.
// Untuk mengaktifkan kembali, uncomment blok di bawah dan hapus fungsi pass-through ini.

const verifyAdmin = (req, res, next) => {
  const role = (req.user?.role || "").trim().toLowerCase();
  if (role !== "teacher" && role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak! Halaman ini khusus untuk Guru.",
    });
  }

  next();
};

module.exports = verifyAdmin;
