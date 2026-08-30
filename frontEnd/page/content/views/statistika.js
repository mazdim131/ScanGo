function renderGrafik() {
  return `
                <div class="wrap">
                    <div class="summary">
                        <div class="scard">
                            <div class="icon-box" style="background:#EEF2FF;color:#4F46E5;"><i
                                    class="bi bi-people-fill"></i></div>
                            <div>
                                <div class="value" id="val-total-siswa">-</div>
                                <div class="label">Total Siswa</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#DCFCE7;color:#16A34A;"><i
                                    class="bi bi-check-circle-fill"></i></div>
                            <div>
                                <div class="value" id="val-hadir">-</div>
                                <div class="label">Hadir Hari Ini</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#DBEAFE;color:#2563EB;"><i
                                    class="bi bi-heart-pulse-fill"></i></div>
                            <div>
                                <div class="value" id="val-sakit">-</div>
                                <div class="label">Sakit</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#F3E8FF;color:#7C3AED;"><i
                                    class="bi bi-file-earmark-text-fill"></i></div>
                            <div>
                                <div class="value" id="val-izin">-</div>
                                <div class="label">Izin</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#FEF3C7;color:#D97706;"><i
                                    class="bi bi-clock-fill"></i></div>
                            <div>
                                <div class="value" id="val-terlambat">-</div>
                                <div class="label">Terlambat</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#FEE2E2;color:#DC2626;"><i
                                    class="bi bi-x-circle-fill"></i></div>
                            <div>
                                <div class="value" id="val-belum-absen">-</div>
                                <div class="label">Belum Absen</div>
                            </div>
                        </div>
                    </div>

                    <!-- dropdown filter kelas & rombel (di bawah kartu monitor) -->
                    <div class="filter-bar">
                        <div class="filter-group">
                            <label class="filter-label" for="filterKelas"><i class="bi bi-collection"></i> Kelas</label>
                            <select id="filterKelas" class="form-select">
                                <option value="">Semua Kelas</option>
                                <option value="X">Kelas X</option>
                                <option value="XI">Kelas XI</option>
                                <option value="XII">Kelas XII</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label" for="filterRombel"><i class="bi bi-people"></i> Rombel</label>
                            <select id="filterRombel" class="form-select">
                                <!-- diisi oleh renderRombel() -->
                            </select>
                        </div>
                    </div>

                    <div class="grid">
                        <div class="panel">
                            <div class="panel-head">
    <div>
        <h3>Kehadiran 7 Hari Terakhir</h3>
        <p>Jumlah siswa hadir per hari</p>
    </div>
    
<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">

    <span class="filterpill"
        id="hadirTodayPill"
        style="background:var(--green-soft);color:var(--green);border-color:transparent;">
        Hari Ini · -
    </span>

    <span class="filterpill">
        7 Hari
    </span>

    <div class="download-wrapper">

        <button type="button"
            class="download-btn"
            id="downloadStatBtn">

            <i class="bi bi-download"></i>
            Download
            <i class="bi bi-chevron-down"></i>

        </button>

        <div class="download-menu"
            id="downloadStatMenu">

            <button type="button"
                class="download-option"
                data-format="pdf">

                <i class="bi bi-file-earmark-pdf"></i>

                <span>
                    <strong>PDF</strong>
                    <small>Dokumen laporan</small>
                </span>

            </button>

            <button type="button"
                class="download-option"
                data-format="png">

                <i class="bi bi-image"></i>

                <span>
                    <strong>PNG</strong>
                    <small>Gambar statistik</small>
                </span>

            </button>

        </div>

    </div>

</div>
</div>

                            <div class="chart-box tall" id="trendChart"></div>
                            <div class="delta-row" id="deltaRow"></div>
                        </div>

                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Distribusi Status</h3>
                                    <p>Komposisi hari ini</p>
                                </div>
                            </div>
                            <div class="donut-wrap" id="donutChart">
                                <div class="donut-center">
                                    <div class="big">168</div>
                                    <div class="small">total siswa</div>
                                </div>
                            </div>
                            <div class="legend-row">
                                <div class="legend-item"><span class="l"><span class="dot"
                                            style="background:var(--green)"></span>Tepat Waktu</span><span
                                        class="v">120</span>
                                </div>
                                <div class="legend-item"><span class="l"><span class="dot"
                                            style="background:var(--blue)"></span>Sakit</span><span class="v">15</span>
                                </div>
                                <div class="legend-item"><span class="l"><span class="dot"
                                            style="background:var(--purple)"></span>Izin</span><span class="v">25</span>
                                </div>
                                <div class="legend-item"><span class="l"><span class="dot"
                                            style="background:var(--red)"></span>Tidak Hadir</span><span
                                        class="v">8</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- row 2: absent today list + tap-in time histogram -->
                    <div class="grid3">
                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Tidak Hadir Hari Ini</h3>
                                    <p>Siswa yang tidak tap masuk hari ini</p>
                                </div>
                                <span class="filterpill" id="absentCountPill">0 siswa</span>
                            </div>
                            <div class="rank-list" id="absentList"></div>
                        </div>

                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Distribusi Jam Tap-in</h3>
                                    <p>Jam masuk mulai 07:00 — batas tepat waktu 07:30</p>
                                </div>
                            </div>
                            <div class="chart-box" id="timeChart"></div>
                        </div>
                    </div>

                    <!-- row 3: today's check-in status list + ranking -->
                    <div class="grid">
                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Status Tap Hari Ini</h3>
                                    <p>Belum tap diprioritaskan di atas</p>
                                </div>
                                <span class="filterpill" id="belumCountPill">0 belum</span>
                            </div>
                            <div class="rank-list" id="statusList"></div>
                        </div>

                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Perlu Perhatian</h3>
                                    <p>Sering terlambat / tidak hadir bulan ini</p>
                                </div>
                                <span class="filterpill" id="perhatianCountPill"
                                    style="background:var(--purple-soft);color:var(--purple);border-color:transparent;">0
                                    siswa</span>
                            </div>
                            <div class="rank-list" id="perhatianList">
                                <!-- list dikosongkan jika belum cukup data -->
                            </div>
                        </div>
                    </div>

                </div>
  `;
}

// const guruMap = {

//   "PPLG X-1": [
//     {
//       nama: "Pak Iqbal",
//       mapel: "Pemrograman Dasar",
//       jam: "07:00 - 10:00"
//     },
//     {
//       nama: "Bu Duma",
//       mapel: "Basis Data",
//       jam: "10:15 - 12:30"
//     }
//   ],

//   "PPLG X-2": [
//     {
//       nama: "Pak Andi",
//       mapel: "Basis Data",
//       jam: "07:00 - 09:30"
//     }
//   ],

//   "PPLG XI-1": [
//     {
//       nama: "Bu Sinta",
//       mapel: "Web Programming",
//       jam: "08:00 - 10:00"
//     }
//   ]

// };

function renderGuru(rombel) {
  const container = document.querySelector(".teacher-list");

  if (!container) return;

  container.innerHTML = "";
}

let selectedRombel = "";
let selectedKelas = "";

// Daftar rombel disamakan dengan pilihan di inputStudent.js
const ROMBEL_GROUPS_STAT = [
  ["TEACHER", ["Guru Produktif"]],
  ["PPLG", ["PPLG 1", "PPLG 2", "PPLG 3", "PPLG 4", "PPLG 5"]],
  ["TJKT", ["TJKT 1", "TJKT 2", "TJKT 3", "TJKT 4", "TJKT 5"]],
  ["DKV", ["DKV 1", "DKV 2", "DKV 3", "DKV 4", "DKV 5"]],
  ["KLN", ["Kuliner 1", "Kuliner 2", "Kuliner 3", "Kuliner 4", "Kuliner 5"]],
  ["HTL", ["Hotel 1", "Hotel 2", "Hotel 3", "Hotel 4", "Hotel 5"]],
  [
    "PMN",
    ["Pemasaran 1", "Pemasaran 2", "Pemasaran 3", "Pemasaran 4", "Pemasaran 5"],
  ],
];

function renderRombelOptionsStat() {
  const selected = String(selectedRombel || "");
  const allOption = `<option value=""${selected === "" ? " selected" : ""}>Semua Rombel</option>`;
  const groups = ROMBEL_GROUPS_STAT.map(([label, items]) => {
    const options = items
      .map(
        (val) =>
          `<option value="${val}"${normalizeRombel(val) === normalizeRombel(selected) ? " selected" : ""}>${val}</option>`,
      )
      .join("");
    return `<optgroup label="${label}">${options}</optgroup>`;
  }).join("");
  return allOption + groups;
}

function renderRombel(kelas) {
  const rombelSelect = document.getElementById("filterRombel");
  if (!rombelSelect) return;

  // Simpan kelas aktif
  selectedKelas = kelas;

  // Sinkronkan dropdown kelas
  const kelasSelect = document.getElementById("filterKelas");
  if (kelasSelect) kelasSelect.value = kelas;

  rombelSelect.innerHTML = renderRombelOptionsStat();

  // Reset pilihan rombel jika tidak ada lagi di daftar
  if (selectedRombel && !rombelSelect.value) {
    selectedRombel = "";
  }
  rombelSelect.value = selectedRombel || "";

  // Muat data untuk filter yang aktif
  initGrafikListener();
}

// function renderRombel(kelas) {
//   const container = document.getElementById("rombelTabs");
//   container.innerHTML = "";
//   for (let i = 1; i <= 5; i++) {
//     container.innerHTML += `
//             <a href="#"
//                class="nav-tab-item ${i === 1 ? "active" : ""}"
//                data-kelas="${kelas}"
//                data-rombel="${i}">
//                 PPLG ${kelas}-${i}
//             </a>
//         `;
//   }
//   // console.log(kelas);
//   initTabs();
// }

// Listener kelas tabs dipasang di dalam initDashboardListener()
// agar bekerja saat halaman di-load lewat SPA router

if (typeof window.clockInterval === "undefined") window.clockInterval = null;

function initStatistikaListener() {
  const timeElement = document.getElementById("time");
  const dateElement = document.getElementById("date");

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let seconds = now.getSeconds().toString().padStart(2, "0");
    let localDate = now.toLocaleDateString("id-ID", dateOptions);
    if (timeElement) timeElement.innerHTML = `${hours}:${minutes}:${seconds}`;
    if (dateElement) dateElement.innerHTML = `${localDate}`;
  }

  if (typeof clockInterval !== "undefined" && clockInterval !== null) {
    clearInterval(clockInterval);
  }
  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  // ── Dropdown Kelas (Semua / X / XI / XII) ──
  const kelasSelect = document.getElementById("filterKelas");
  if (kelasSelect) {
    kelasSelect.value = selectedKelas;
    kelasSelect.addEventListener("change", function () {
      selectedKelas = this.value;
      renderRombel(selectedKelas);
    });
  }

  // ── Dropdown Rombel (Sesuai daftar inputStudent.js) ──
  const rombelSelect = document.getElementById("filterRombel");
  if (rombelSelect) {
    rombelSelect.addEventListener("change", function () {
      selectedRombel = this.value;
      initGrafikListener();
    });
  }

  // Inisialisasi filter default (semua kelas & semua rombel) dan muat data pertama kali
  renderRombel(selectedKelas);
}

//dasborad statistik
// ===================== helpers =====================
const NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}
function makeTooltip(container) {
  const tip = document.createElement("div");
  tip.className = "ctip";
  container.appendChild(tip);
  return tip;
}
function showTip(tip, container, x, y, html) {
  tip.innerHTML = html;
  tip.style.left = x + "px";
  tip.style.top = y - 10 + "px";
  tip.style.opacity = 1;
}
function hideTip(tip) {
  tip.style.opacity = 0;
}

// VW/VH = virtual viewbox units, stretched to fill container (preserveAspectRatio none)
const VW = 1000,
  VH = 400;
const PAD = { l: 34, r: 14, t: 18, b: 28 };

function scaleX(i, n) {
  return PAD.l + (i / (n - 1)) * (VW - PAD.l - PAD.r);
}
function scaleY(v, max) {
  return VH - PAD.b - (v / max) * (VH - PAD.t - PAD.b);
}

function gridLines(svg, max, steps) {
  for (let i = 0; i <= steps; i++) {
    const v = (max / steps) * i;
    const y = scaleY(v, max);
    svg.appendChild(
      svgEl("line", {
        x1: PAD.l,
        x2: VW - PAD.r,
        y1: y,
        y2: y,
        stroke: "#ECEEF3",
        "stroke-width": 1,
      }),
    );
  }
}

// ── Helper: normalisasi format rombel ──────────────────────────────────
// DB menyimpan rombel sesuai pilihan di inputStudent.js, contoh "PPLG 3".
// Perbandingan cukup trim + uppercase agar case/whitespace tidak masalah.
function normalizeRombel(r) {
  return String(r || "")
    .trim()
    .toUpperCase();
}
// ─────────────────────────────────────────────────────────────────────

// ===================== 1. Kehadiran 7 Hari Terakhir (single line) =====================
window.initGrafikListener = async function () {
  let users = [];
  let attendances = [];
  try {
    const resA = await fetch(`${API_BASE}/api/attendances`, {
      credentials: "include",
    });
    if (resA.ok) {
      const dataA = await resA.json();
      if (dataA.success) attendances = dataA.data || [];
    }
    const resU = await fetch(`${API_BASE}/api/users`, {
      credentials: "include",
    });
    if (resU.ok) {
      const dataU = await resU.json();
      if (dataU.success) users = dataU.data || [];
    }
  } catch (error) {
    console.error("Gagal memuat data statistik", error);
  }

  const td = new Date();
  // Filter siswa berdasarkan kelas dan/atau rombel yang dipilih
  const selectedKelasKey = String(selectedKelas || "")
    .trim()
    .toUpperCase();
  const selectedRombelKey = normalizeRombel(selectedRombel);
  const usersRombel = users.filter((user) => {
    if (
      selectedKelasKey &&
      String(user.kelas || "")
        .trim()
        .toUpperCase() !== selectedKelasKey
    ) {
      return false;
    }
    if (
      selectedRombelKey &&
      normalizeRombel(user.rombel) !== selectedRombelKey
    ) {
      return false;
    }
    return true;
  });
  const idcards = usersRombel
    .map((u) => String(u.idcard ?? "").trim())
    .filter(Boolean);

  const todayAtt = attendances.filter((a) => {
    if (!a.created_at) return false;
    const d = new Date(a.created_at);
    return (
      d.getFullYear() === td.getFullYear() &&
      d.getMonth() === td.getMonth() &&
      d.getDate() === td.getDate()
    );
  });

  const todayAttRombel = todayAtt.filter((att) =>
    idcards.includes(String(att.idcard).trim()),
  );

  const totalSiswa = usersRombel.length;
  const hadirMap = new Map();
  todayAttRombel.forEach((a) => {
    let cId = String(a.idcard || "").trim();
    if (cId) {
      if (!hadirMap.has(cId)) {
        hadirMap.set(cId, a);
      } else {
        const existing = hadirMap.get(cId);
        if (new Date(a.created_at) > new Date(existing.created_at)) {
          hadirMap.set(cId, a);
        }
      }
    }
  });

  // Data List Siswa (Status Hari Ini) & Menghitung status
  const studentsList = [];
  const absentList = [];
  let countTepat = 0;
  let countTerlambat = 0;
  let countSakit = 0;
  let countIzin = 0;
  let countAlfa = 0;
  let countHadirTotal = 0;
  let countBelum = 0;

  usersRombel.forEach((u) => {
    let uId = String(u.idcard || "").trim();
    if (uId && hadirMap.has(uId)) {
      const attObj = hadirMap.get(uId);
      const attStatus = (attObj.status || "Hadir").toLowerCase();
      let timeStr = "00:00";

      if (attObj.created_at) {
        const dtt = new Date(attObj.created_at);
        timeStr =
          String(dtt.getHours()).padStart(2, "0") +
          ":" +
          String(dtt.getMinutes()).padStart(2, "0");
      }

      if (attStatus === "sakit") {
        countSakit++;
        absentList.push({
          name: u.username,
          rombel: u.rombel,
          status: "Sakit",
        });
        studentsList.push({
          name: u.username,
          rombel: u.rombel,
          status: "sakit",
          time: timeStr,
        });
      } else if (attStatus === "izin") {
        countIzin++;
        absentList.push({ name: u.username, rombel: u.rombel, status: "Izin" });
        studentsList.push({
          name: u.username,
          rombel: u.rombel,
          status: "izin",
          time: timeStr,
        });
      } else if (attStatus === "alfa") {
        countAlfa++;
        absentList.push({ name: u.username, rombel: u.rombel, status: "Alfa" });
        studentsList.push({
          name: u.username,
          rombel: u.rombel,
          status: "alfa",
          time: timeStr,
        });
      } else {
        // Hadir
        let isTerlambat = false;
        if (attObj.created_at) {
          const dtt = new Date(attObj.created_at);
          const hrs = dtt.getHours();
          const mins = dtt.getMinutes();
          if (hrs > 8 || (hrs === 8 && mins >= 10)) {
            isTerlambat = true;
          }
        }

        if (isTerlambat) countTerlambat++;
        else countTepat++;
        countHadirTotal++;

        // Cek note khusus "Tidak bawa kartu"
        let noteStr = "";
        const pNote = (attObj.note || "").toLowerCase();
        if (
          pNote.includes("kartu") ||
          pNote.includes("gak bawa") ||
          attObj.mac_address === "Manual Input"
        ) {
          noteStr = " (Tdk bawa kartu)";
        }

        studentsList.push({
          name: u.username,
          rombel: u.rombel,
          status: isTerlambat ? "terlambat" : "sudah",
          time: timeStr,
          note: noteStr,
        });
      }
    } else {
      countBelum++;
      studentsList.push({
        name: u.username,
        rombel: u.rombel,
        status: "belum",
      });
      absentList.push({
        name: u.username,
        rombel: u.rombel,
        status: "Belum Absen",
      });
    }
  });

  const valTotal = document.getElementById("val-total-siswa");
  if (valTotal) valTotal.innerText = totalSiswa;
  const valHadir = document.getElementById("val-hadir");
  if (valHadir) valHadir.innerText = countHadirTotal;
  const valSakit = document.getElementById("val-sakit");
  if (valSakit) valSakit.innerText = countSakit;
  const valIzin = document.getElementById("val-izin");
  if (valIzin) valIzin.innerText = countIzin;
  const valTerlambat = document.getElementById("val-terlambat");
  if (valTerlambat) valTerlambat.innerText = countTerlambat;
  const valBelum = document.getElementById("val-belum-absen");
  if (valBelum) valBelum.innerText = countBelum + countAlfa;

  const hadirPct =
    totalSiswa > 0 ? ((countHadirTotal / totalSiswa) * 100).toFixed(1) : "0.0";
  const pillToday = document.getElementById("hadirTodayPill");
  if (pillToday) pillToday.textContent = `Hari Ini · ${hadirPct}%`;

  // Data Kehadiran 7 Hari
  const trendLabels = [];
  const trendLabelsShort = [];
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dmy = d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    trendLabelsShort.push(dmy.split(",")[0]);
    trendLabels.push(dmy);

    const atts = attendances.filter((a) => {
      if (!a.created_at) return false;
      const ad = new Date(a.created_at);
      return (
        ad.getFullYear() === d.getFullYear() &&
        ad.getMonth() === d.getMonth() &&
        ad.getDate() === d.getDate() &&
        idcards.includes(String(a.idcard).trim())
      );
    });
    const unique = new Set(atts.map((a) => String(a.idcard).trim())).size;
    trendData.push(unique || 0);
  }

  // Data Distribusi Status (Donut)
  const donutData = [
    { label: "Tepat Waktu", value: countTepat, color: "#1FA871" },
    { label: "Terlambat", value: countTerlambat, color: "#EAB308" },
    { label: "Sakit/Izin", value: countSakit + countIzin, color: "#3FA9E0" },
    { label: "Tidak Hadir", value: countBelum + countAlfa, color: "#E25C5C" },
  ];

  // Jam Tap-in — selalu tampilkan 07:00 sampai 14:00 (8 slot)
  const TAP_START_HR = 7; // mulai jam 7 pagi
  const tLabels = [];
  for (let i = 0; i < 8; i++) {
    tLabels.push(String(TAP_START_HR + i).padStart(2, "0") + ":00");
  }

  let tBins = [0, 0, 0, 0, 0, 0, 0, 0];
  Array.from(hadirMap.values()).forEach((a) => {
    if (a.created_at) {
      const hrs = new Date(a.created_at).getHours();
      let binIdx = hrs - TAP_START_HR;
      if (binIdx < 0) binIdx = 0;
      if (binIdx > 7) binIdx = 7;
      tBins[binIdx]++;
    }
  });

  // ===================== 1. Kehadiran 7 Hari Terakhir (single line) =====================
  (function () {
    const labels = trendLabels;
    const labelsShort = trendLabelsShort;
    const data = trendData;
    const max = Math.max(50, ...data) + 10;
    const n = data.length;

    const box = document.getElementById("trendChart");
    if (!box) return;
    box.innerHTML = "";
    const svg = svgEl("svg", {
      viewBox: `0 0 ${VW} ${VH}`,
      preserveAspectRatio: "none",
    });
    box.appendChild(svg);
    gridLines(svg, max, 4);

    const pts = data.map((v, i) => [scaleX(i, n), scaleY(v, max)]);

    // area fill
    let areaD = `M ${pts[0][0]} ${VH - PAD.b} `;
    pts.forEach((p) => (areaD += `L ${p[0]} ${p[1]} `));
    areaD += `L ${pts[n - 1][0]} ${VH - PAD.b} Z`;
    const grad = svgEl("linearGradient", {
      id: "trendGrad",
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 1,
    });
    grad.appendChild(
      svgEl("stop", {
        offset: "0%",
        "stop-color": "#4F5AED",
        "stop-opacity": 0.16,
      }),
    );
    grad.appendChild(
      svgEl("stop", {
        offset: "100%",
        "stop-color": "#4F5AED",
        "stop-opacity": 0,
      }),
    );
    const defs = svgEl("defs", {});
    defs.appendChild(grad);
    svg.appendChild(defs);
    svg.appendChild(
      svgEl("path", { d: areaD, fill: "url(#trendGrad)", stroke: "none" }),
    );

    // line
    let lineD = `M ${pts[0][0]} ${pts[0][1]} `;
    pts.forEach((p, i) => {
      if (i > 0) lineD += `L ${p[0]} ${p[1]} `;
    });
    svg.appendChild(
      svgEl("path", {
        d: lineD,
        fill: "none",
        stroke: "#4F5AED",
        "stroke-width": 3,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
    );

    // points + hover targets + labels
    const tip = makeTooltip(box);
    pts.forEach((p, i) => {
      const c = svgEl("circle", {
        cx: p[0],
        cy: p[1],
        r: 5,
        fill: "#fff",
        stroke: "#4F5AED",
        "stroke-width": 2,
      });
      svg.appendChild(c);

      // Label angka (agar muncul di export PDF/PNG)
      const valText = svgEl("text", {
        x: p[0],
        y: p[1] - 12,
        "text-anchor": "middle",
        "font-size": 12,
        fill: "#4F5AED",
        "font-weight": 600,
      });
      valText.textContent = data[i];
      svg.appendChild(valText);

      const hit = svgEl("circle", {
        cx: p[0],
        cy: p[1],
        r: 16,
        fill: "transparent",
      });
      hit.addEventListener("mouseenter", () => {
        c.setAttribute("r", 7);
        showTip(
          tip,
          box,
          (p[0] / VW) * box.clientWidth,
          (p[1] / VH) * box.clientHeight,
          `<div class="tt-title">${labels[i]}</div><div class="tt-row"><span class="sw" style="background:#4F5AED"></span>Hadir: ${data[i]} siswa</div>`,
        );
      });
      hit.addEventListener("mouseleave", () => {
        c.setAttribute("r", 5);
        hideTip(tip);
      });
      svg.appendChild(hit);
    });

    // x labels
    labelsShort.forEach((lab, i) => {
      const t = svgEl("text", {
        x: pts[i][0],
        y: VH - 8,
        "text-anchor": "middle",
        "font-size": 12,
        fill: "#6B7280",
        "font-weight": 600,
      });
      t.textContent = lab;
      svg.appendChild(t);
    });

    // delta chips
    const deltaRow = document.getElementById("deltaRow");
    if (deltaRow) {
      deltaRow.innerHTML = "";
      data.forEach((val, i) => {
        const item = document.createElement("div");
        item.className = "delta-item";
        let chipHtml;
        if (i === 0) {
          chipHtml = `<span class="chip flat">awal</span>`;
        } else {
          const diff = val - data[i - 1];
          if (diff > 0) chipHtml = `<span class="chip up">▲ ${diff}</span>`;
          else if (diff < 0)
            chipHtml = `<span class="chip down">▼ ${Math.abs(diff)}</span>`;
          else chipHtml = `<span class="chip flat">tetap</span>`;
        }
        item.innerHTML = `<div class="dd">${labelsShort[i]}</div><div class="dv">${val}</div>${chipHtml}`;
        deltaRow.appendChild(item);
      });
    }
  })();

  // ===================== 2. Donut Distribusi Status =====================
  (function () {
    const data = donutData;
    const total = data.reduce((a, b) => a + b.value, 0) || 1; // avg divide by 0
    const box = document.getElementById("donutChart");
    if (!box) return;

    // clean old svg
    const oldSvg = box.querySelector("svg");
    if (oldSvg) oldSvg.remove();

    const size = 180,
      r = 70,
      cx = size / 2,
      cy = size / 2,
      sw = 22;
    const svg = svgEl("svg", {
      viewBox: `0 0 ${size} ${size}`,
      width: size,
      height: size,
      style: "position:relative;z-index:1;",
    });
    box.insertBefore(svg, box.firstChild);

    // update labels dynamically
    const dc = box.querySelector(".donut-center .big");
    if (dc) dc.textContent = totalSiswa;

    const tip = makeTooltip(box);
    let startAngle = -90;
    const circumference = 2 * Math.PI * r;
    data.forEach((seg) => {
      const frac = seg.value / total;
      const dash = frac * circumference;
      const gap = circumference - dash;
      if (seg.value === 0) return; // don't draw 0 path
      const path = svgEl("circle", {
        cx,
        cy,
        r,
        fill: "none",
        stroke: seg.color,
        "stroke-width": sw,
        "stroke-dasharray": `${dash} ${gap}`,
        "stroke-dashoffset": -((startAngle + 90) / 360) * circumference,
        transform: `rotate(-90 ${cx} ${cy})`,
      });
      path.style.cursor = "pointer";
      path.addEventListener("mouseenter", (e) => {
        path.setAttribute("stroke-width", sw + 4);
        const pct = Math.round(frac * 100);
        showTip(
          tip,
          box,
          size / 2,
          size / 2 - r - 6,
          `<div class="tt-title">${seg.label}</div><div class="tt-row"><span class="sw" style="background:${seg.color}"></span>${seg.value} siswa (${pct}%)</div>`,
        );
      });
      path.addEventListener("mouseleave", () => {
        path.setAttribute("stroke-width", sw);
        hideTip(tip);
      });
      svg.appendChild(path);
      startAngle += frac * 360;
    });

    // Update legends
    const legendRow = box.nextElementSibling;
    if (legendRow && legendRow.classList.contains("legend-row")) {
      legendRow.innerHTML = `
          <div class="legend-item"><span class="l"><span class="dot" style="background:var(--green)"></span>Tepat Waktu</span><span class="v">${countTepat}</span></div>
          <div class="legend-item"><span class="l"><span class="dot" style="background:#EAB308"></span>Terlambat</span><span class="v">${countTerlambat}</span></div>
          <div class="legend-item"><span class="l"><span class="dot" style="background:var(--purple)"></span>Sakit/Izin</span><span class="v">${countSakit + countIzin}</span></div>
          <div class="legend-item"><span class="l"><span class="dot" style="background:var(--red)"></span>Tidak Hadir</span><span class="v">${countBelum + countAlfa}</span></div>
       `;
    }
  })();

  // ===================== 3. Tidak Hadir Hari Ini (list: foto, nama, rombel, status) =====================
  (function () {
    const absentStudents = absentList;
    const list = document.getElementById("absentList");
    const countPill = document.getElementById("absentCountPill");
    if (!list) return;
    list.innerHTML = "";
    absentStudents.forEach((s) => {
      const row = document.createElement("div");
      row.className = "rank-item";
      let tagHtml = "";
      if (s.status === "Sakit")
        tagHtml = `<span class="rank-tag sakit" style="background:#DBEAFE;color:#2563EB;">Sakit</span>`;
      else if (s.status === "Izin")
        tagHtml = `<span class="rank-tag izin" style="background:#F3E8FF;color:#7C3AED;">Izin</span>`;
      else if (s.status === "Alfa")
        tagHtml = `<span class="rank-tag alfa" style="background:#FEE2E2;color:#DC2626;">Alfa</span>`;
      else tagHtml = `<span class="rank-tag absent">Belum Absen</span>`;

      row.innerHTML = `
      <div class="avatar"></div>
      <div class="rank-info"><div class="nm">${s.name}</div><div class="rb">${s.rombel || "-"}</div></div>
      ${tagHtml}`;
      list.appendChild(row);
    });
    if (countPill) countPill.textContent = absentStudents.length + " siswa";
  })();

  // ===================== 4. Status Tap Hari Ini (list: belum di atas, sudah di bawah) =====================
  (function () {
    const students = studentsList;
    // prioritas: belum > alfa > sakit > izin > terlambat > sudah
    students.sort((a, b) => {
      const rank = {
        belum: 1,
        alfa: 2,
        sakit: 3,
        izin: 4,
        terlambat: 5,
        sudah: 6,
      };
      if (rank[a.status] === rank[b.status]) return 0;
      return rank[a.status] < rank[b.status] ? -1 : 1;
    });

    const list = document.getElementById("statusList");
    if (!list) return;
    list.innerHTML = "";
    students.forEach((s) => {
      const row = document.createElement("div");
      row.className = "rank-item";
      let note = s.note || "";
      let tag = "";
      if (s.status === "belum")
        tag = `<span class="rank-tag belum">Belum Tap</span>`;
      else if (s.status === "terlambat")
        tag = `<span class="rank-tag late">Sudah (Terlambat)${note} · ${s.time}</span>`;
      else if (s.status === "sudah")
        tag = `<span class="rank-tag sudah">Sudah${note} · ${s.time}</span>`;
      else if (s.status === "sakit")
        tag = `<span class="rank-tag sakit" style="background:#DBEAFE;color:#2563EB;">Sakit</span>`;
      else if (s.status === "izin")
        tag = `<span class="rank-tag izin" style="background:#F3E8FF;color:#7C3AED;">Izin</span>`;
      else if (s.status === "alfa")
        tag = `<span class="rank-tag alfa" style="background:#FEE2E2;color:#DC2626;">Alfa</span>`;

      row.innerHTML = `
      <div class="avatar"></div>
      <div class="rank-info"><div class="nm">${s.name}</div><div class="rb">${s.rombel || "-"}</div></div>
      ${tag}`;
      list.appendChild(row);
    });
    const belumCount = students.filter((s) => s.status === "belum").length;
    const dp = document.getElementById("belumCountPill");
    if (dp) dp.textContent = belumCount + " belum";
  })();

  // ===================== 4. Distribusi Jam Tap-in (bar) =====================
  (function () {
    const labels = tLabels;
    const data = tBins; // Dynamic Tbins
    const max = Math.max(10, ...data) + 5;
    const n = data.length;

    const box = document.getElementById("timeChart");
    if (!box) return;

    box.innerHTML = "";

    const svg = svgEl("svg", {
      viewBox: `0 0 ${VW} ${VH}`,
      preserveAspectRatio: "none",
    });

    box.appendChild(svg);
    gridLines(svg, max, 4);

    const slotW = (VW - PAD.l - PAD.r) / n;
    const barW = slotW * 0.55;
    const tip = makeTooltip(box);

    data.forEach((v, i) => {
      const cx = PAD.l + slotW * (i + 0.5);
      const y = scaleY(v, max);
      const color = i <= 3 ? "#4F5AED" : "#F0973C";
      const bar = svgEl("rect", {
        x: cx - barW / 2,
        y,
        width: barW,
        height: VH - PAD.b - y,
        rx: 6,
        fill: color,
      });
      svg.appendChild(bar);

      const hit = svgEl("rect", {
        x: cx - slotW / 2,
        y: PAD.t,
        width: slotW,
        height: VH - PAD.b - PAD.t,
        fill: "transparent",
      });
      hit.addEventListener("mouseenter", () => {
        bar.setAttribute("opacity", 0.75);
        showTip(
          tip,
          box,
          (cx / VW) * box.clientWidth,
          (y / VH) * box.clientHeight,
          `<div class="tt-title">${labels[i]}</div><div class="tt-row"><span class="sw" style="background:${color}"></span>${v} siswa</div>`,
        );
      });
      hit.addEventListener("mouseleave", () => {
        bar.setAttribute("opacity", 1);
        hideTip(tip);
      });
      svg.appendChild(hit);

      const t = svgEl("text", {
        x: cx,
        y: VH - 8,
        "text-anchor": "middle",
        "font-size": 11,
        fill: "#6B7280",
        "font-weight": 600,
      });
      t.textContent = labels[i];
      svg.appendChild(t);
    });
  })();

  // ===================== 5. Perlu Perhatian (absen >= 3 kali dalam 30 hari) =====================
  (async function () {
    const list = document.getElementById("perhatianList");
    const pill = document.getElementById("perhatianCountPill");
    if (!list) return;

    // Kumpulkan hari-hari yang memang secara aktual ADA log absensi (Sistem Aktif) di 30 hari terakhir.
    // Ini mengabaikan hari libur, tanggal merah, atau hari sebelum sistem mulai dipakai.
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const todayMs = today.getTime();

    const schoolDaysMap = new Map();

    attendances.forEach((a) => {
      if (a.created_at) {
        const d = new Date(a.created_at);
        const dow = d.getDay();
        // Hanya hitung jika Senin(1) - Jumat(5)
        if (dow >= 1 && dow <= 5) {
          const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          const dMs = d.getTime();
          const diffDays = (todayMs - dMs) / (1000 * 60 * 60 * 24);

          // Sisihkan Hari Ini, dan ambil yang ada di masa lalu (1 - 31 hari ke belakang)
          if (dStr !== todayStr && diffDays > 0 && diffDays <= 31) {
            schoolDaysMap.set(
              dStr,
              new Date(d.getFullYear(), d.getMonth(), d.getDate()),
            );
          }
        }
      }
    });

    const schoolDays = Array.from(schoolDaysMap.values());

    // Untuk setiap siswa di rombel ini, hitung berapa hari tidak hadir dalam 30 hari
    const perhatianSiswa = [];
    usersRombel.forEach((u) => {
      const uId = String(u.idcard || "").trim();
      let absentCount = 0;
      schoolDays.forEach((sd) => {
        const hadir = attendances.some((a) => {
          if (!a.created_at) return false;
          const ad = new Date(a.created_at);
          return (
            String(a.idcard || "").trim() === uId &&
            ad.getFullYear() === sd.getFullYear() &&
            ad.getMonth() === sd.getMonth() &&
            ad.getDate() === sd.getDate()
          );
        });
        if (!hadir) absentCount++;
      });
      // Masukkan ke 'perlu perhatian' jika absen 3–5 kali atau lebih
      if (absentCount >= 3) {
        perhatianSiswa.push({
          name: u.username,
          rombel: u.rombel,
          absentCount,
        });
      }
    });

    perhatianSiswa.sort((a, b) => b.absentCount - a.absentCount);

    list.innerHTML = "";
    if (perhatianSiswa.length === 0) {
      list.innerHTML = `<div style="padding:16px;text-align:center;color:var(--color-sub);font-size:13px;">Tidak ada siswa yang perlu perhatian khusus</div>`;
    } else {
      perhatianSiswa.forEach((s) => {
        const row = document.createElement("div");
        row.className = "rank-item";
        const badgeColor =
          s.absentCount >= 8
            ? "#DC2626"
            : s.absentCount >= 5
              ? "#F0973C"
              : "#D97706";
        row.innerHTML = `
          <div class="avatar"></div>
          <div class="rank-info"><div class="nm">${s.name}</div><div class="rb">${s.rombel || "-"}</div></div>
          <span class="rank-tag" style="background:${badgeColor}20;color:${badgeColor};border:1px solid ${badgeColor}40;">${s.absentCount}x absen</span>`;
        list.appendChild(row);
      });
    }
    if (pill) pill.textContent = perhatianSiswa.length + " siswa";
  })();

  // ============================================================
  // DOWNLOAD DROPDOWN
  // ============================================================

  const downloadBtn = document.getElementById("downloadStatBtn");

  const downloadMenu = document.getElementById("downloadStatMenu");

  if (downloadBtn && downloadMenu) {
    downloadBtn.onclick = function (e) {
      e.stopPropagation();

      downloadMenu.classList.toggle("show");
    };

    const options = downloadMenu.querySelectorAll(".download-option");

    options.forEach((option) => {
      option.onclick = function () {
        const format = this.dataset.format;

        downloadMenu.classList.remove("show");

        openExportPreview(format);
      };
    });
  }
};

// ============================================================
// EXPORT STATISTIKA
// ============================================================

function getExportInfo() {
  const kelas = selectedKelas || "Semua Kelas";
  const rombel = selectedRombel || "Semua Rombel";

  return {
    kelas,
    rombel,
    tanggal: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

// ============================================================
// PREVIEW EXPORT
// ============================================================

let currentExportFormat = null;

function createExportModal() {
  if (document.getElementById("exportStatModal")) {
    return;
  }

  const modal = document.createElement("div");

  modal.id = "exportStatModal";

  modal.innerHTML = `
        <div class="export-modal-overlay">

            <div class="export-modal">

                <div class="export-modal-header">

                    <div>
                        <h3 id="exportModalTitle">
                            Preview Statistik
                        </h3>

                        <p id="exportModalSubtitle">
                            Preview sebelum download
                        </p>
                    </div>

                    <button type="button"
                        class="export-modal-close"
                        id="closeExportModal">

                        <i class="bi bi-x-lg"></i>

                    </button>

                </div>


                <div class="export-modal-body"
                    id="exportPreview">

                </div>


                <div class="export-modal-footer">

                    <button type="button"
                        class="export-cancel-btn"
                        id="cancelExport">

                        Batal

                    </button>

                    <button type="button"
                        class="export-confirm-btn"
                        id="confirmExport">

                        <i class="bi bi-download"></i>
                        Download

                    </button>

                </div>

            </div>

        </div>
    `;

  document.body.appendChild(modal);

  document.getElementById("closeExportModal").onclick = closeExportModal;

  document.getElementById("cancelExport").onclick = closeExportModal;
}

function openExportPreview(format) {
  currentExportFormat = format;

  createExportModal();

  const modal = document.getElementById("exportStatModal");

  const preview = document.getElementById("exportPreview");

  const title = document.getElementById("exportModalTitle");

  const subtitle = document.getElementById("exportModalSubtitle");

  const confirmButton = document.getElementById("confirmExport");

  const chart = document.getElementById("trendChart");

  if (!chart) {
    alert("Grafik tidak ditemukan.");

    return;
  }

  const svg = chart.querySelector("svg");

  if (!svg) {
    alert("Grafik belum selesai dibuat.");

    return;
  }

  const info = getExportInfo();

  // Judul modal

  title.textContent = format === "pdf" ? "Preview PDF" : "Preview PNG";

  subtitle.textContent =
    format === "pdf"
      ? "Preview laporan sebelum mengunduh PDF."
      : "Preview gambar sebelum mengunduh PNG.";

  confirmButton.innerHTML = `
        <i class="bi bi-download"></i>
        Download ${format.toUpperCase()}
    `;

  // Clone SVG grafik

  const svgClone = svg.cloneNode(true);

  preview.innerHTML = `

        <div class="export-preview-page">

            <div class="export-preview-title">
                Statistik Kehadiran Siswa
            </div>

            <div class="export-preview-info">

                Kelas:
                <strong>${info.kelas}</strong>

                &nbsp; • &nbsp;

                Rombel:
                <strong>${info.rombel}</strong>

                &nbsp; • &nbsp;

                Periode:
                <strong>7 Hari Terakhir</strong>

            </div>


            <div class="export-preview-chart"
                id="previewChartContainer">
            </div>

        </div>

    `;

  document.getElementById("previewChartContainer").appendChild(svgClone);

  modal.style.display = "block";
}

function closeExportModal() {
  const modal = document.getElementById("exportStatModal");

  if (modal) {
    modal.style.display = "none";
  }

  currentExportFormat = null;
}

// ============================================================
// Ambil SVG grafik Kehadiran 7 Hari
// ============================================================

function getTrendSVG() {
  const chart = document.getElementById("trendChart");

  if (!chart) {
    throw new Error("Grafik kehadiran tidak ditemukan.");
  }

  const svg = chart.querySelector("svg");

  if (!svg) {
    throw new Error("SVG grafik belum tersedia.");
  }

  return svg;
}

// ============================================================
// Konversi SVG → Canvas
// ============================================================

function svgToCanvas(svg, width = 1400, height = 560) {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer();

    let svgString = serializer.serializeToString(svg);

    // Tambahkan namespace jika belum ada
    if (!svgString.includes("xmlns=")) {
      svgString = svgString.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);

    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      // Background putih
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      // Gambar SVG
      ctx.drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(url);

      resolve(canvas);
    };

    img.onerror = function (error) {
      URL.revokeObjectURL(url);
      reject(error);
    };

    img.src = url;
  });
}

// ============================================================
// DOWNLOAD PNG
// ============================================================

async function exportTrendPNG() {
  const svg = getTrendSVG();
  const svgCanvas = await svgToCanvas(svg, 1600, 650);
  const info = getExportInfo();

  // Buat canvas baru dengan ukuran lebih besar untuk menampung teks
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = 1700;
  finalCanvas.height = 950;
  const ctx = finalCanvas.getContext("2d");

  // Background putih
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

  // Header Teks
  ctx.fillStyle = "#000000";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("Statistik Kehadiran Siswa", 50, 70);

  ctx.font = "24px sans-serif";
  ctx.fillText(`Kelas: ${info.kelas}`, 50, 120);
  ctx.fillText(`Rombel: ${info.rombel}`, 50, 160);
  ctx.fillText(`Periode: 7 Hari Terakhir`, 50, 200);
  ctx.fillText(`Dicetak: ${info.tanggal}`, 50, 240);

  // Gambar grafik (svgCanvas)
  ctx.drawImage(svgCanvas, 50, 270, 1600, 650);

  // Footer Teks
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#666666";
  ctx.fillText("Laporan Statistik Absensi", 50, 930);

  const rombelName = info.rombel.replace(/\s+/g, "-").toLowerCase();
  const link = document.createElement("a");
  link.download = `statistik-kehadiran-7-hari-${rombelName}.png`;
  link.href = finalCanvas.toDataURL("image/png");
  link.click();
}

// ============================================================
// DOWNLOAD PDF
// ============================================================

async function exportTrendPDF() {
  if (typeof html2pdf === "undefined") {
    throw new Error("Library html2pdf belum dimuat!");
  }

  const svg = getTrendSVG();
  const canvas = await svgToCanvas(svg, 1600, 650);
  const imageData = canvas.toDataURL("image/png");
  const info = getExportInfo();

  // Buat wadah sementara untuk di-render oleh html2pdf
  const container = document.createElement("div");
  container.style.padding = "20px";
  container.style.fontFamily = "sans-serif";
  container.style.width = "1000px"; // Ukuran relatif lebar
  container.style.backgroundColor = "#ffffff";

  container.innerHTML = `
    <h2 style="margin: 0 0 5px 0;">Statistik Kehadiran Siswa</h2>
    <p style="margin: 0; font-size: 14px;">Kelas: ${info.kelas}</p>
    <p style="margin: 0; font-size: 14px;">Rombel: ${info.rombel}</p>
    <p style="margin: 0; font-size: 14px;">Periode: 7 Hari Terakhir</p>
    <p style="margin: 0 0 15px 0; font-size: 14px;">Dicetak: ${info.tanggal}</p>
    <img src="${imageData}" style="width: 100%; border-radius: 8px;" alt="Grafik Statistik" />
    <p style="margin-top: 20px; font-size: 12px; color: #666;">Laporan Statistik Absensi</p>
  `;

  const rombelName = info.rombel.replace(/\s+/g, "-").toLowerCase();
  const filename = `statistik-kehadiran-7-hari-${rombelName}.pdf`;

  const opt = {
    margin: 10,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
  };

  await html2pdf().set(opt).from(container).save();
}

// ============================================================
// KONFIRMASI DOWNLOAD
// ============================================================

document.addEventListener("click", function (e) {
  // Tutup dropdown jika klik di luar
  const wrapper = document.querySelector(".download-wrapper");

  if (wrapper && !wrapper.contains(e.target)) {
    const menu = document.getElementById("downloadStatMenu");

    if (menu) {
      menu.classList.remove("show");
    }
  }

  // Tombol download modal
  if (e.target.closest && e.target.closest("#confirmExport")) {
    const button = document.getElementById("confirmExport");

    if (!currentExportFormat) {
      return;
    }

    button.disabled = true;

    button.innerHTML = `
            <i class="bi bi-hourglass-split"></i>
            Memproses...
        `;

    setTimeout(async () => {
      try {
        if (currentExportFormat === "png") {
          await exportTrendPNG();
        } else if (currentExportFormat === "pdf") {
          await exportTrendPDF();
        }

        closeExportModal();
      } catch (error) {
        console.error("Export gagal:", error);

        alert("Gagal membuat file: " + error.message);
      } finally {
        button.disabled = false;

        button.innerHTML = `
                    <i class="bi bi-download"></i>
                    Download ${(currentExportFormat || "").toUpperCase()}
                `;
      }
    }, 100);
  }
});
