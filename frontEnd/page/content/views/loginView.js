function renderLoginView(type) {
  const suffix = type === "guru" ? "-guru" : "-siswa";
  const modalId = "loginViewModal" + suffix;

  return `
    <div class="login-view-container animate__animated animate__fadeIn">
      <div class="login-view-card">
        <a href="javascript:void(0)" class="login-view-back-link mt-3 ms-2" onclick="navigateTo('dashboard')">
          <i class="Fbi bi-arrow-left"></i> Kembali ke Dashboard
        </a>
        <div class="login-view-left-panel">
          <div class="login-view-logo">
            <a href="/frontEnd/page/structure/dashboard.html" class="d-flex gap-2 justify-content-center">
              <img src="/frontEnd/assets/logo/partners/wikrama.png" alt="wikrama logo" width="50px">
              <img src="/frontEnd/assets/logo/partners/pplg.png" alt="pplg logo" width="50px">
            </a>
          </div>

          <h1 class="login-view-title">Masuk</h1>
          <p class="login-view-subtitle">Anda perlu hak akses untuk masuk ke halaman ini</p>

          <div class="login-view-field-group">
            <label for="lv-email${suffix}">Email</label>
            <input type="email" class="" id="lv-email${suffix}" placeholder="Masukkan email" autocomplete="email" />
          </div>

          <div class="login-view-field-group">
            <div class="login-view-field-header">
              <label for="lv-password${suffix}">Password</label>
              <a href="#" data-bs-toggle="modal" data-bs-target="#${modalId}" class="login-view-forgot-link">Butuh Bantuan?</a>
            </div>
            <div class="login-view-password-wrapper">
              <input type="password" id="lv-password${suffix}" placeholder="Masukkan password" autocomplete="current-password" />
              <i class="bi bi-eye-slash login-view-toggle-pw" id="lv-togglePassword${suffix}"></i>
            </div>
          </div>

          <button class="login-view-btn-signin" id="lv-btnSignIn${suffix}">Masuk</button>

          <p class="login-view-create-account">Tidak memiliki akun? <a href="#">Hubungi staf Scango</a></p>
        </div>

        <div class="login-view-right-panel">
          <img src="/frontEnd/assets/background/9333f00957425e173ae553ca70f5b930.webp" alt="Login Banner" fetchpriority="high" decoding="async">
        </div>
      </div>

      <div class="modal fade" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Silahkan untuk menghubungi staf Scango untuk mengganti password!</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="w-100 btn btn-success" data-bs-dismiss="modal">Mengerti</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initLoginView(type) {
  const suffix = type === "guru" ? "-guru" : "-siswa";
  const togglePw = document.getElementById("lv-togglePassword" + suffix);
  const pwInput = document.getElementById("lv-password" + suffix);
  const btnSignIn = document.getElementById("lv-btnSignIn" + suffix);
  const emailInput = document.getElementById("lv-email" + suffix);

  if (!togglePw || !pwInput || !btnSignIn || !emailInput) return;

  togglePw.addEventListener("click", function () {
    const type =
      pwInput.getAttribute("type") === "password" ? "text" : "password";
    pwInput.setAttribute("type", type);
    this.classList.toggle("bi-eye");
    this.classList.toggle("bi-eye-slash");
  });

  btnSignIn.addEventListener("click", async function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const passwordValue = pwInput.value.trim();

    if (!email || !passwordValue) {
      showToast("Email dan Password tidak boleh kosong!", "danger");
      Swal.fire({
        title: "Login Gagal",
        icon: "error",
        draggable: true,
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-error",
        },
        buttonsStyling: false,
      });
      return;
    }

    btnSignIn.innerText = "Memproses...";
    btnSignIn.disabled = true;

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: passwordValue }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal Login!");

      const userRole = data.user.role
        ? data.user.role.trim().toLowerCase()
        : "";

      const isStudent =
        userRole === "student" || userRole === "user" || userRole === "siswa";

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.user.role);
      sessionStorage.setItem("username", data.user.username || data.user.email);
      sessionStorage.setItem("nis", String(data.user.nis ?? ""));
      sessionStorage.setItem("email", data.user.email || "");

      showToast("Login Berhasil! Selamat Datang.", "success");

      let destination;

      if (isStudent) {
        if (typeof window.routerState !== "object" || !window.routerState) {
          window.routerState = {};
        }
        window.routerState.nis = data.user.nis;
        window.routerState.email = data.user.email;
        destination = "detail-siswa";
      } else {
        destination = type === "guru" ? "data-guru" : "data-siswa";
      }

      Swal.fire({
        title: "Login Berhasil!",
        icon: "success",
        draggable: true,
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-success",
        },
        buttonsStyling: false,
      }).then(() => {
        showToast(
          isStudent
            ? "Menuju halaman profil Anda"
            : "Menuju halaman dashboard (Admin)",
          "success",
        );

        navigateTo(destination);
      });
    } catch {
      Swal.fire({
        title: "Login Gagal!",
        icon: "error",
        draggable: true,
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-error",
        },
        buttonsStyling: false,
      });
      showToast("Terdapat kesalahan, Coba Kembali!", "danger");
    }
  });
}
