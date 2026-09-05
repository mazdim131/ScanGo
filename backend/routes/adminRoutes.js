const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const verifyAdmin = require("../middlewares/adminMiddleware");

router.get("/dashboard-data", verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({
    message: "API Dashboard Admin",
    stats: {
      totalUsers: 1000,
      totalScans: 1000,
      activeLogins: 1000,
    },
  });
});

module.exports = router;
