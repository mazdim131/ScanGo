function renderDashboard() {
  return `
  <!-- Tempat Stat Cards (Atas) -->
  <div id="top-stats-container"></div>
  
  <div class="dashboard-layout">
  <!-- panel kiri -->
    <aside class="left-panel">
      <div class="scan-rfid-container">

        <div class="scan-card" id="container-scan-rfid" style="margin: 0; padding: 30px 24px; max-width: 100%;">
          <div class="scan-header">
            <h3>Scan RFID</h3>
            <p>Tempelkan kartu RFID siswa untuk mencatat kehadiran</p>
          </div>

          <div class="scan-icon-wrapper">
            <i class="bi bi-upc-scan"></i>
          </div>

          <div id="scan-status">
            <span class="scan-status-badge idle">
              <i class="bi bi-radio"></i> Menunggu scan kartu...
            </span>
          </div>

          <div class="scan-input-group">
            <input
              type="text"
              id="card-id-input"
              class="form-control"
              placeholder="Tempelkan kartu RFID..."
              autofocus
            >
            <button class="scan-btn" onclick="submitScan()">
              <i class="bi bi-upc-scan"></i> Scan Sekarang
            </button>

            <div class="scan-divider">atau</div>

            <button class="inputManual-btn" onclick="toggleAbsenMode('manual')">
              <i class="bi bi-pencil-square"></i> Input Manual
            </button>
          </div>

          <div id="scan-result"></div>
        </div>

        <div class="scan-card" id="container-input-manual" style="display: none; margin: 0; padding: 30px 24px; max-width: 100%;">
          <div class="scan-header" style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <h3>Input Manual</h3>
            <p>Pilih nama dan isi keterangan absensi siswa</p>
          </div>

          <div class="scan-input-group" style="text-align: left; gap: 15px;">
          
            <div>
              <label style="font-size: 0.85rem; font-weight: 600; color: #444; display: block; margin-bottom: 5px;">Nama Siswa</label>
              <input type="text" id="manual-nama" class="form-control" placeholder="Ketik nama siswa..." list="daftar-siswa" style="width: 100%;">
            </div>

            <div>
              <label style="font-size: 0.85rem; font-weight: 600; color: #444; display: block; margin-bottom: 5px;">Status Kehadiran</label>
              <select id="manual-status" class="form-control" style="width: 100%; background-color: #fff;">
                <option value="Hadir">Hadir</option>
                <option value="Sakit">Sakit</option>
                <option value="Izin">Izin</option>
                <option value="Alfa">Alfa</option>
              </select>
            </div>

            <div>
              <label style="font-size: 0.85rem; font-weight: 600; color: #444; display: block; margin-bottom: 5px;">Keterangan</label>
              <textarea id="manual-keterangan" class="form-control" rows="3" placeholder="Tulis alasan atau keterangan di sini..." style="width: 100%; height: auto; padding: 8px 12px;"></textarea>
              <datalist id="daftar-siswa"></datalist>
            </div>

            <button class="scan-btn" onclick="submitManual()">
              <i class="bi bi-check-circle"></i> Simpan Absen
            </button>

            <button class="inputManual-btn" onclick="toggleAbsenMode('scan')">
              Batal
            </button>

          </div>

          <div id="manual-result" style="margin-top: 15px;"></div>
        </div>

      </div>
    </aside>
  <!-- panel kanan-->
    <div class="right-panel" id="absensi-table-content">
    </div>
  </div>
  `;
}

if (typeof window.clockInterval === "undefined") window.clockInterval = null;
if (typeof window.currentSelectedClass === "undefined") window.currentSelectedClass = "X";
if (typeof window.currentSelectedRombel === "undefined") window.currentSelectedRombel = null;
if (typeof window.currentSelectedDate === "undefined") window.currentSelectedDate = new Date().toLocaleDateString("sv-SE");

async function initDashboardListener() {
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

  initTabs();
}

async function fetchAttendanceData() {
  try {
    const response = await fetch(`${API_BASE}/api/attendances`, {
      method: "GET",
      credentials: "include"
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getStatusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "hadir":
      return "status-present";
    case "terlambat":
      return "status-late";
    case "sakit":
    case "izin":
      return "status-late";
    case "alfa":
    case "alpa":
      return "status-absent";
    default:
      return "status-present";
  }
}

function generateKontenKelasTemplate(namaKelas, dataAbsensi) {
  let dataFiltered = dataAbsensi.filter((row) => {
    if (!row.created_at) return false;

    const tanggalAbsen = new Date(row.created_at).toLocaleDateString("sv-SE");
    const rombel = String(row.rombel || "").toUpperCase();
    const cocokKelas = rombel.includes(namaKelas.toUpperCase());
    const cocokTanggal = tanggalAbsen === currentSelectedDate;

    return cocokKelas && cocokTanggal;
  });

  if (currentSelectedRombel && currentSelectedRombel !== "all") {
    dataFiltered = dataFiltered.filter((row) => {
      const rombelText = String(row.rombel || "").toUpperCase();
      const rombelKey = currentSelectedRombel.toUpperCase();
      return rombelText === rombelKey;
    });
  }

  const totalHadir = dataFiltered.filter(
    (r) =>
      (r.status || "").toLowerCase() === "hadir" ||
      (r.status || "").toLowerCase() === "terlambat",
  ).length;
  const totalSakit = dataFiltered.filter(
    (r) => (r.status || "").toLowerCase() === "sakit",
  ).length;
  const totalIzin = dataFiltered.filter(
    (r) => (r.status || "").toLowerCase() === "izin",
  ).length;
  const totalAlpa = dataFiltered.filter(
    (r) =>
      (r.status || "").toLowerCase() === "alfa" ||
      (r.status || "").toLowerCase() === "alpa",
  ).length;
  const emptyMessage = currentSelectedRombel
    ? "Siswa belum absen"
    : "Belum ada riwayat tap kartu pada tanggal ini";

  const tableRowsHtml =
    dataFiltered.length === 0
      ? `<tr><td colspan="7" class="text-center text-muted py-4">${emptyMessage}</td></tr>`
      : dataFiltered
        .map((row) => {
          const jamAbsen = row.created_at
            ? new Date(row.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
            : "-";

          const jamKeluar = row.time_finish
            ? new Date(row.time_finish).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
            : "-";

          const namaSiswa = row.users
            ? Array.isArray(row.users)
              ? row.users[0]?.username
              : row.users.username
            : null;
          const displayNama = namaSiswa || row.idcard || "Tidak Dikenal";

          return `
                <tr>
                    <td class="text-muted d-none d-md-table-cell">${row.id}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <span class="fw-semibold" style="color: var(--color-teks);">${displayNama}</span>
                        </div>
                    </td>
                    <td class="text-muted">${row.idcard || "-"}</td>
                    <td class="fw-semibold">${row.rombel || "-"}</td>
                    <td class="fw-semibold">${jamAbsen || "-"}</td>
                    <td class="fw-semibold">${jamKeluar || "-"}</td>
                    <td class="text-muted">${row.note || "-"}</td>
                    <td><span class="status-badge ${getStatusClass(row.status)}">${row.status || "Hadir"}</span></td>
                </tr>
            `;
        })
        .join("");

  return {
    statsHtml: `
        <div class="row g-3 mb-4">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="stat-card">
                    <div class="stat-label text-primary">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Total Siswa Hadir</span>
                    </div>
                    <div class="stat-value">${totalHadir}</div>
                    <div class="stat-indicator">
                        <span class="text-success fw-semibold"><i class="bi bi-arrow-up-short"></i> Live</span>
                        <span class="text-muted ms-1" style="color: var(--color-teks) !important;">dari database</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div class="stat-card">
                    <div class="stat-label text-info">
                        <i class="bi bi-clock-history"></i>
                        <span>Total Siswa Sakit</span>
                    </div>
                    <div class="stat-value">${totalSakit}</div>
                    <div class="stat-indicator">
                        <span class="text-muted" style="color: var(--color-teks) !important;">Live rekap</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div class="stat-card">
                    <div class="stat-label text-danger">
                        <i class="bi bi-person-x-fill"></i>
                        <span>Total Siswa Tidak Hadir (Alfa)</span>
                    </div>
                    <div class="stat-value">${totalAlpa}</div>
                    <div class="stat-indicator">
                        <span class="text-muted" style="color: var(--color-teks) !important;">Live rekap</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div class="stat-card">
                    <div class="stat-label text-warning" style="color: #ffc107 !important;">
                        <i class="bi bi-stopwatch-fill"></i>
                        <span>Total Siswa Izin</span>
                    </div>
                    <div class="stat-value">${totalIzin}</div>
                    <div class="stat-indicator">
                        <span class="text-muted" style="color: var(--color-teks) !important;">Live rekap</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    tableHtml: `
        <div class="data-card" style="margin-top: 0;">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div class="d-flex align-items-center gap-2">
                    <h5 class="fw-bold m-0" style="color: var(--color-teks); font-size: 1.05rem;">Riwayat Absensi Kelas ${namaKelas}</h5>
                </div>
                <div class="d-flex gap-2 flex-wrap align-items-center">
                    <select id="pilihanRombel" class="form-select form-select-sm bg-light border-0 text-muted rounded-3" style="width: auto; height: 34px; font-size: 0.85rem;">
                      <option value="">Rombel</option>
                      <optgroup label="PPLG X">
                        <option value="X_1">PPLG X-1</option>
                        <option value="X_2">PPLG X-2</option>
                        <option value="X_3">PPLG X-3</option>
                        <option value="X_4">PPLG X-4</option>
                        <option value="X_5">PPLG X-5</option>
                      </optgroup>
                      <optgroup label="PPLG XI">
                        <option value="XI_1">PPLG XI-1</option>
                        <option value="XI_2">PPLG XI-2</option>
                        <option value="XI_3">PPLG XI-3</option>
                        <option value="XI_4">PPLG XI-4</option>
                        <option value="XI_5">PPLG XI-5</option>
                      </optgroup>
                      <optgroup label="PPLG XII">
                        <option value="XII_1">PPLG XII-1</option>
                        <option value="XII_2">PPLG XII-2</option>
                        <option value="XII_3">PPLG XII-3</option>
                        <option value="XII_4">PPLG XII-4</option>
                        <option value="XII_5">PPLG XII-5</option>
                      </optgroup>
                    </select>
                    <div class="d-flex align-items-center bg-light rounded-3 px-2 border-0" style="height: 34px;">
                        <i class="bi bi-calendar3 text-muted me-2" style="font-size: 0.85rem;"></i>
                        <input type="date" id="filterTanggal" class="form-control form-control-sm bg-transparent border-0 text-muted p-0" style="font-size: 0.85rem; width: 120px; outline: none; box-shadow: none;" value="${currentSelectedDate}">
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table align-middle custom-table mb-0 w-100">
                    <thead>
                        <tr>
                            <th class="d-none d-md-table-cell" style="width: 10%;">ID Log</th>
                            <th style="width: 15%;">Nama Lengkap</th>
                            <th class="d-none d-md-table-cell" style="width: 15%;">Id RFID</th>
                            <th style="width: 15%;">Rombel</th>
                            <th style="width: 12%;">Absen Masuk</th>
                            <th style="width: 12%;">Absen Keluar</th>
                            <th style="width: 12%;">Keterangan</th>
                            <th style="width: 12%;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `
  };
}

async function initTabs() {
  const tabs = document.querySelectorAll(".header-nav-tabs .nav-tab-item");
  const tableContainer = document.getElementById("absensi-table-content");
  const statsContainer = document.getElementById("top-stats-container");

  if (tableContainer && statsContainer) {
    tableContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Memuat data absensi...</p></div>`;
    const dataTerbaru = await fetchAttendanceData();
    const result = generateKontenKelasTemplate(currentSelectedClass, dataTerbaru);
    statsContainer.innerHTML = result.statsHtml;
    tableContainer.innerHTML = result.tableHtml;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", async function (e) {
      e.preventDefault();
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      currentSelectedClass = this.getAttribute("data-kelas");
      currentSelectedRombel = null;

      if (tableContainer && statsContainer) {
        tableContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Memeriksa database...</p></div>`;
        const dataTerbaru = await fetchAttendanceData();
        const result = generateKontenKelasTemplate(currentSelectedClass, dataTerbaru);
        statsContainer.innerHTML = result.statsHtml;
        tableContainer.innerHTML = result.tableHtml;
        attachFilters();
      }
    });
  });

  attachFilters();
}

function attachFilters() {
  const select = document.getElementById("pilihanRombel");
  if (select) {
    select.removeEventListener("change", handleRombelFilter);
    select.addEventListener("change", handleRombelFilter);
  }

  const dateInput = document.getElementById("filterTanggal");
  if (dateInput) {
    dateInput.removeEventListener("change", handleTanggalFilter);
    dateInput.addEventListener("change", handleTanggalFilter);
  }
}

async function handleRombelFilter() {
  const selectElement = document.getElementById("pilihanRombel");
  if (!selectElement) return;
  const val = selectElement.value;
  currentSelectedRombel = val || null;
  const tableContainer = document.getElementById("absensi-table-content");
  const statsContainer = document.getElementById("top-stats-container");

  if (tableContainer && statsContainer) {
    tableContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Menyaring rombel...</p></div>`;
    const dataTerbaru = await fetchAttendanceData();
    const result = generateKontenKelasTemplate(currentSelectedClass, dataTerbaru);
    statsContainer.innerHTML = result.statsHtml;
    tableContainer.innerHTML = result.tableHtml;
    attachFilters();
  }
}

async function handleTanggalFilter() {
  const dateInputElement = document.getElementById("filterTanggal");
  if (!dateInputElement) return;

  currentSelectedDate = dateInputElement.value;
  const tableContainer = document.getElementById("absensi-table-content");
  const statsContainer = document.getElementById("top-stats-container");

  if (tableContainer && statsContainer) {
    tableContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Menyaring tanggal...</p></div>`;
    const dataTerbaru = await fetchAttendanceData();
    const result = generateKontenKelasTemplate(currentSelectedClass, dataTerbaru);
    statsContainer.innerHTML = result.statsHtml;
    tableContainer.innerHTML = result.tableHtml;
    attachFilters();
  }
}

async function editAttendancesStatus(id, currentStatus) {
  const statusBaru = prompt(
    "Ubah status absensi (Hadir / Sakit / Izin / Alpa): ",
    currentStatus,
  );
  if (statusBaru === null) return;

  const statusValid = ["Hadir", "Sakit", "Izin", "Alpa"];
  if (!statusValid.includes(statusBaru.trim())) {
    alert("Status tidak valid! Masukkan: Hadir, Sakit, Izin, atau Alpa");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/api/attendances/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: statusBaru.trim() }),
      },
    );

    const result = await response.json();
    if (response.ok && result.success) {
      alert("Status absensi berhasil diperbarui!");
      initTabs();
    } else {
      alert("Gagal memperbarui status: " + (result.message || "Error server"));
    }
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan koneksi saat memperbarui data");
  }
}

async function deleteAttendanceLog(id) {
  if (!confirm("Apakah anda yakin ingin menghapus data log absensi ini?"))
    return;

  try {
    const response = await fetch(
      `${API_BASE}/api/attendances/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    const result = await response.json();
    if (response.ok && result.success) {
      alert("Log absensi berhasil dihapus!");
      initTabs();
    } else {
      alert("Gagal menghapus log: " + (result.message || "Error server"));
    }
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan koneksi saat menghapus data");
  }
}

const profileInput = document.getElementById("profileInput");
const previewImage = document.getElementById("previewImage");
const profileImgElement = document.getElementById("profileImage");

const savedImage = localStorage.getItem("profileImageBase64");
if (savedImage) {
  if (profileImgElement) profileImgElement.src = savedImage;
  if (previewImage) previewImage.src = savedImage;
}

let selectedImageBase64 = null;

if (profileInput) {
  profileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      selectedImageBase64 = e.target.result;
      if (previewImage) previewImage.src = selectedImageBase64;
    };
    reader.readAsDataURL(file);
  });
}

const saveBtn = document.getElementById("saveProfile");
if (saveBtn) {
  saveBtn.addEventListener("click", function () {
    if (!selectedImageBase64) return;

    localStorage.setItem("profileImageBase64", selectedImageBase64);
    if (profileImgElement) profileImgElement.src = selectedImageBase64;

    if (typeof showAlert === "function") {
      showAlert("success", "Foto profil berhasil diperbarui!");
    }
  });
}
