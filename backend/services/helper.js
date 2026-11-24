const rentangHariWIB = (customDateStr) => {
  // WIB = UTC + 7h. Supabase TIMESTAMP columns are stored/queried in UTC.
  // We must return startWib / endWib as UTC ISO strings that represent the
  // WIB calendar day 00:00:00.000 until 23:59:59.999. A WIB midnight equals
  // UTC 17:00 on the previous calendar day.
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

  const toWibDayMs = (y, m, d) => {
    // WIB midnight of local y-m-d
    const wibMidnight = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
    // Represent that same instant as a UTC ISO string (UTC = WIB - 7h).
    const utcMidnight = new Date(wibMidnight.getTime() - WIB_OFFSET_MS);
    const endWib = new Date(utcMidnight.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { startWib: utcMidnight.toISOString(), endWib: endWib.toISOString() };
  };

  if (customDateStr) {
    const parts = String(customDateStr).split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      const { startWib, endWib } = toWibDayMs(parts[0], parts[1], parts[2]);
      return {
        startWib: new Date(startWib).toISOString(),
        endWib: new Date(endWib).toISOString(),
      };
    }
  }

  // No date argument -> today's WIB calendar day.
  const wibNow = new Date(Date.now() + WIB_OFFSET_MS);
  const y = wibNow.getUTCFullYear();
  const m = wibNow.getUTCMonth() + 1; // 1-based (toWibDayMs expects 1-based month)
  const d = wibNow.getUTCDate();
  const { startWib, endWib } = toWibDayMs(y, m, d);
  return { startWib, endWib };
};

// Konstanta jam absensi (dalam menit dari 00:00 WIB)
const MASUK_START_MIN = 4 * 60 + 30; // 04:30
const MASUK_ON_TIME_END_MIN = 7 * 60; // 07:00
const MASUK_LATE_END_MIN = 14 * 60 + 30; // 14:30
const PULANG_MIN = 14 * 60 + 30; // 14:30

const getWibNow = () => new Date(Date.now() + 7 * 60 * 60 * 1000);

const getWibMinutesNow = () => {
  const d = getWibNow();
  return d.getUTCHours() * 60 + d.getUTCMinutes();
};

// Mengembalikan status masuk berdasarkan jam WIB saat ini.
// null jika di luar window masuk (ditolak).
const masukStatus = (minutes = getWibMinutesNow()) => {
  if (minutes < MASUK_START_MIN || minutes > MASUK_LATE_END_MIN) return null;
  if (minutes <= MASUK_ON_TIME_END_MIN) return "Hadir";
  return "terlambat";
};

module.exports = {
  rentangHariWIB,
  MASUK_START_MIN,
  MASUK_ON_TIME_END_MIN,
  MASUK_LATE_END_MIN,
  PULANG_MIN,
  getWibNow,
  getWibMinutesNow,
  masukStatus,
};
