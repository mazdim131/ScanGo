const supabase = require("../config/db");
const { rentangHariWIB } = require("../services/helper");

const storeAttendance = async (req, res) => {
  try {
    const idcard = req.query.idcard;
    const mac_address = req.query.mac_address;

    if (!idcard) {
      return res
        .status(400)
        .json({ success: false, message: "UID Kartu tidak terbaca" });
    }

    const { startWib, endWib } = rentangHariWIB();

    const [userRes, attRes] = await Promise.all([
      supabase
        .from("users")
        .select("username, idcard, whatsapp, rombel")
        .eq("idcard", idcard)
        .maybeSingle(),
      supabase
        .from("attendances")
        .select("id, time_finish")
        .eq("idcard", idcard)
        .gte("created_at", startWib)
        .lte("created_at", endWib)
        .maybeSingle(),
    ]);

    if (userRes.error) {
      console.error("Error store user lookup:", userRes.error.message);
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan saat memverifikasi kartu." });
    }

    const uservalid = userRes.data;

    if (!uservalid) {
      return res.status(403).json({
        success: false,
        message: "ID RFID tidak dikenali! Silahkan registrasi terlebih dahulu.",
      });
    }

    const namaPemilik = uservalid.username || "Siswa";

    if (attRes.error) {
      console.error("Error check existing:", attRes.error.message);
      throw attRes.error;
    }

    const existing = attRes.data;

    if (existing) {
      if (existing.time_finish) {
        return res.status(409).json({
          success: false,
          message: "Kartu ini sudah absen masuk & keluar hari ini.",
          already_finished: true,
          attendance_id: existing.id,
        });
      }

      return res.status(409).json({
        success: false,
        message: `Kartu ini sudah absen hari ini. Silahkan tap sekali lagi untuk absen keluar.`,
        already_checked_in: true,
        attendance_id: existing.id,
      });
    }

    const { data: attendanceData, error: insertError } = await supabase
      .from("attendances")
      .insert([
        {
          idcard,
          mac_address: mac_address || "RFID Reader Card 135KHZ",
          status: "Hadir",
        },
      ])
      .select();

    if (insertError) {
      console.error("Error insert attendance:", insertError.message);
      return res
        .status(500)
        .json({ success: false, message: "Gagal menyimpan absensi." });
    }

    res.json({
      success: true,
      message: `Absensi berhasil dicatat! Selamat belajar ${namaPemilik}`,
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error store attendance:", error.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
};

const tapAttendance = async (req, res) => {
  try {
    const body = req.body || {};
    const query = req.query || {};
    const rawIdcard = String(body.idcard ?? query.idcard ?? "").trim();
    const rawUsername = String(body.username ?? query.username ?? "").trim();
    const mode =
      String(body.mode ?? query.mode ?? "masuk") === "keluar"
        ? "keluar"
        : "masuk";
    const macAddress = body.mac_address ?? query.mac_address ?? null;
    const statusInput =
      typeof body.status === "string" ? body.status.trim() : "";
    const noteInput = typeof body.note === "string" ? body.note.trim() : "";

    const byIdcard = rawIdcard !== "";
    if (!byIdcard && !rawUsername) {
      return res
        .status(400)
        .json({ success: false, code: "invalid_input", message: "UID kartu atau nama siswa wajib diisi." });
    }

    if (byIdcard && !/^\d+$/.test(rawIdcard)) {
      return res.status(403).json({
        success: false,
        code: "unknown_card",
        message: "ID RFID tidak dikenali! Silahkan registrasi terlebih dahulu.",
      });
    }

    const { startWib, endWib } = rentangHariWIB();

    let uservalid;
    let existing;

    if (byIdcard) {
      const [userRes, attRes] = await Promise.all([
        supabase
          .from("users")
          .select("username, idcard, whatsapp, rombel")
          .eq("idcard", rawIdcard)
          .maybeSingle(),
        supabase
          .from("attendances")
          .select("id, time_finish")
          .eq("idcard", rawIdcard)
          .gte("created_at", startWib)
          .lte("created_at", endWib)
          .maybeSingle(),
      ]);

      if (userRes.error) {
        console.error("Error tap user lookup:", userRes.error.message);
        return res
          .status(500)
          .json({ success: false, message: "Terjadi kesalahan saat memverifikasi kartu." });
      }
      if (attRes.error) {
        console.error("Error tap attendance lookup:", attRes.error.message);
        throw attRes.error;
      }

      uservalid = userRes.data;
      existing = attRes.data;
    } else {
      const userRes = await supabase
        .from("users")
        .select("username, idcard, whatsapp, rombel")
        .ilike("username", rawUsername)
        .maybeSingle();

      if (userRes.error) {
        console.error("Error tap manual user lookup:", userRes.error.message);
        return res.status(500).json({ success: false, error: "Gagal mencari data siswa." });
      }
      if (!userRes.data) {
        return res.status(404).json({
          success: false,
          code: "user_not_found",
          error: `Nama "${rawUsername}" tidak ditemukan di database. Pastikan nama sesuai dengan data yang terdaftar.`,
        });
      }

      uservalid = userRes.data;

      const attRes = await supabase
        .from("attendances")
        .select("id, time_finish")
        .eq("idcard", String(uservalid.idcard))
        .gte("created_at", startWib)
        .lte("created_at", endWib)
        .maybeSingle();

      if (attRes.error) {
        console.error("Error tap manual attendance lookup:", attRes.error.message);
        throw attRes.error;
      }
      existing = attRes.data;
    }

    if (!uservalid) {
      return res.status(403).json({
        success: false,
        code: "unknown_card",
        message: "ID RFID tidak dikenali! Silahkan registrasi terlebih dahulu.",
      });
    }

    // Aturan absensi: 1x masuk + 1x keluar per kartu per hari
    if (existing?.time_finish) {
      return res.status(409).json({
        success: false,
        code: "already_finished",
        message: "Kartu ini sudah absen masuk & keluar hari ini.",
        attendance_id: existing.id,
      });
    }

    if (mode === "masuk" && existing) {
      return res.status(409).json({
        success: false,
        code: "already_checked_in",
        message: "Kartu ini sudah absen hari ini.",
        attendance_id: existing.id,
      });
    }

    if (mode === "keluar" && !existing) {
      return res.status(409).json({
        success: false,
        code: "not_checked_in",
        message: "Kartu ini belum absen masuk hari ini.",
      });
    }

    if (!existing) {
      const macDefault = byIdcard ? "RFID Reader Card 135KHZ" : "Manual Input";
      const insertPayload = {
        idcard: byIdcard ? rawIdcard : String(uservalid.idcard),
        mac_address: macAddress || macDefault,
        status: statusInput || "Hadir",
      };
      if (!byIdcard) insertPayload.note = noteInput || "Tidak ada catatan";

      const { data: attendanceData, error: insertError } = await supabase
        .from("attendances")
        .insert([insertPayload])
        .select("id, created_at, status");

      if (insertError) {
        console.error("Error tap insert:", insertError.message);
        return res
          .status(500)
          .json({ success: false, message: byIdcard ? "Gagal menyimpan absensi." : "Gagal menyimpan absensi manual." });
      }

      const pesan = byIdcard
        ? `Absensi berhasil dicatat! Selamat belajar ${uservalid.username || "Siswa"}`
        : `Absensi manual berhasil! ${uservalid.username} tercatat dengan RFID ${uservalid.idcard}`;

      return res.json({
        success: true,
        action: "masuk",
        message: pesan,
        data: attendanceData,
      });
    }

    const nowIso = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("attendances")
      .update({ time_finish: nowIso, updated_at: nowIso })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Error tap update:", updateError.message);
      return res.status(500).json({ success: false, message: "Gagal memperbarui absensi keluar." });
    }

    return res.json({
      success: true,
      action: "keluar",
      message: `Absen keluar untuk ${uservalid.username} berhasil dicatat!`,
      attendance_id: existing.id,
    });
  } catch (error) {
    console.error("Error tap attendance:", error.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
};

const manualAttendance = async (req, res) => {
  try {
    const { username, status, note } = req.body;

    if (!username || !username.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Nama siswa wajib diisi!" });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("username, idcard, whatsapp, rombel")
      .ilike("username", username.trim())
      .maybeSingle();

    if (userError) {
      console.error("Error manual user lookup:", userError.message);
      return res.status(500).json({ success: false, error: "Gagal mencari data siswa." });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Nama "${username}" tidak ditemukan di database. Pastikan nama sesuai dengan data yang terdaftar.`,
      });
    }

    const { data: attendanceData, error: insertError } = await supabase
      .from("attendances")
      .insert([
        {
          idcard: user.idcard,
          mac_address: "Manual Input",
          status: status || "Hadir",
          note: note || "Tidak ada catatan",
        },
      ])
      .select();

    if (insertError) {
      console.error("Error manual insert:", insertError.message);
      return res
        .status(500)
        .json({ success: false, error: "Gagal menyimpan absensi manual." });
    }

    res.json({
      success: true,
      message: `Absensi manual berhasil! ${user.username} tercatat dengan RFID ${user.idcard}`,
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error manual attendance:", error.message);
    res.status(500).json({ success: false, error: "Terjadi kesalahan pada server." });
  }
};

const getAttendances = async (req, res) => {
  try {
    const { data: attendances, error: attError } = await supabase
      .from("attendances")
      .select("*")
      .order("created_at", { ascending: false });

    if (attError) {
      console.error("Error fetch attendances:", attError.message);
      throw attError;
    }

    if (!attendances || attendances.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const { data: users, error: userError } = await supabase
      .from("users")
      .select("username, idcard, rombel, kelas, nis, rayon");

    if (userError) {
      console.error("Error fetch users:", userError.message);
    }

    const dataValidUsers = users || [];

    const dataGabungan = attendances.map((att) => {
      const idKartuAbsen = att.card_id || att.idcard || "";

      const userCocok = dataValidUsers.find((u) => {
        const idUser = u.idcard || u.card_id || "";
        return String(idUser).trim() === String(idKartuAbsen).trim();
      });

      return {
        ...att,
        idcard: idKartuAbsen,
        rombel: userCocok?.rombel || att.rombel || null,
        kelas: userCocok?.kelas || null,
        rayon: userCocok?.rayon || att.rayon || null,
        nis: userCocok?.nis ?? null,
        users: userCocok
          ? { username: userCocok.username || userCocok.name || "Siswa" }
          : null,
      };
    });

    res.json({ success: true, data: dataGabungan });
  } catch (error) {
    console.error("Error get attendances:", error.message);
    res.status(500).json({ success: false, error: "Gagal memuat data absensi." });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { time_finish, status, note } = req.body;

    const updateData = {};
    if (time_finish) updateData.time_finish = time_finish;
    if (status) updateData.status = status;
    if (note !== undefined) updateData.note = note;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Tidak ada data yang diupdate" });
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("attendances")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error update attendance:", error.message);
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Data absensi tidak ditemukan" });
    }

    if (time_finish) {
      const { data: attRow } = await supabase
        .from("attendances")
        .select("idcard")
        .eq("id", id)
        .maybeSingle();

      if (attRow?.idcard) {
        const { data: userPulang } = await supabase
          .from("users")
          .select("username, rombel")
          .eq("idcard", String(attRow.idcard).trim())
          .maybeSingle();
      }
    }

    res.json({
      success: true,
      message: "Data absensi berhasil diupdate",
      data,
    });
  } catch (error) {
    console.error("Error put attendance:", error.message);
    res.status(500).json({ success: false, error: "Gagal memperbarui data absensi." });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("attendances")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error delete attendance:", error.message);
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Data absensi tidak ditemukan" });
    }

    res.json({ success: true, message: "Data absensi berhasil dihapus" });
  } catch (error) {
    console.error("Error delete attendance:", error.message);
    res.status(500).json({ success: false, error: "Gagal menghapus data absensi." });
  }
};

const getUserAttendances = async (req, res) => {
  try {
    const { nis } = req.params;
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("idcard")
      .eq("nis", nis)
      .maybeSingle();

    if (userErr) {
      console.error("Error get user by nis:", userErr.message);
      throw userErr;
    }
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Siswa tidak ditemukan" });

    const { data: attendances, error: attErr } = await supabase
      .from("attendances")
      .select("*")
      .eq("idcard", user.idcard)
      .order("created_at", { ascending: false })
      .limit(15);

    if (attErr) {
      console.error("Error fetch attendances:", attErr.message);
      throw attErr;
    }

    res.json({ success: true, data: attendances || [] });
  } catch (error) {
    console.error("Error get user attendances:", error.message);
    res.status(500).json({ success: false, error: "Gagal memuat riwayat absensi." });
  }
};

module.exports = {
  storeAttendance,
  tapAttendance,
  manualAttendance,
  getAttendances,
  updateAttendance,
  deleteAttendance,
  getUserAttendances,
};