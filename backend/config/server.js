const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const { client, sendWhatsAppMessage } = require("/whatsapp");

const app = express();
app.use(express.json());

const SUPABASE_URL = "";
const SUPABASE_KEY = "";
const supabase = createClient(SUPABASE_KEY, SUPABASE_URL);

app.post("/api/absen", async (req, res) => {
  const { idcard } = req.body;

  if (!idcard) {
    return res
      .status(400)
      .json({ success: false, message: "ID card tidak ditemukan!" });
  }

  try {
    const { data: siswa, error: errSiswa } = await supabase
      .from("users")
      .select("*")
      .eq("idcard", idcard)
      .single();

    if (errSiswa || !siswa) {
      return res
        .status(404)
        .json({ success: false, message: "Kartu Rfid tidak terdaftar!" });
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleDateString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const { data: absensiHariIni } = await supabase
      .from("absensi")
      .select("*")
      .eq("idcard", idcard)
      .eq("tanggal", todayDate)
      .single();

    if (absensiHariIni && !absensiHariIni.waktu_keluar) {
      await supabase
        .from("absensi")
        .update({ waktu_keluar: new Date() })
        .eq("id", absensiHariIni.id);

      const pesanWA =
        `*NOTIFIKASI PRESENSI PULANG SCANGO*\n\n` +
        `Halo Bapak/Ibu,\n` +
        `Siswa a.n *${siswa.username}* (Kls: ${siswa.rombel}) telah *PULANG* dari sekolah.\n\n` +
        `⏰ Waktu Pulang: *${currentTime} WIB*\n` +
        `📅 Tanggal: ${todayDate}\n\n` +
        `Hati-hati di jalan!`;

      sendWhatsAppMessage(siswa.whatsapp, pesanWA);

      return res.json({
        success: true,
        type: "PULANG",
        message: `Absen Pulang Berhasil: ${siswa.username}`,
      });
    }

    return res.status(400).json({
      success: false,
      message: `Kuota scan hari ini untuk ${siswa.username} sudah habis (Sudah Absen Masuk & Pulang).`,
    });
  } catch (error) {
    console.error("Error Server:", error);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan pada server!" });
  }
});

app.listen(3000, () => {
  console.log("Server Backend Aktif di http://localhost:3000");
});
