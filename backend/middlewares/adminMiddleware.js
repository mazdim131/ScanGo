const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role.trim().toLowerCase() !== "teacher") {
    return res.status(403).json({
      message: "Akses ditolak! Halaman ini khusus untuk Guru.",
    });
  }

  next();
};

module.exports = verifyAdmin;