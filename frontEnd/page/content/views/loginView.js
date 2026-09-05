function renderLogin() {
  return `
    <div class="login-view-container animate__animated animate__fadeIn">
      <div class="login-view-card">
        <a href="javascript:void(0)" class="login-view-back-link" onclick="navigateTo('dashboard')">
          <i class="bi bi-arrow-left"></i> Kembali ke Dashboard
        </a>
        <div class="login-view-left-panel">
          <div class="login-view-logo">
            <a href="/frontEnd/page/structure/dashboard.html" class="d-flex gap-2 justify-content-center">
              <img src="/frontEnd/assets/logo/partners/wikrama.png" alt="wikrama logo" width="50px">
              <img src="/frontEnd/assets/logo/partners/pplg.png" alt="pplg logo" width="50px">
            </a>
          </div>

          <h1 class="login-view-title">Masuk</h1>
          <p class="login-view-subtitle">Masuk untuk memulai absensi</p>

          <div class="login-view-field-group">
            <label for="lv-email">Email</label>
            <input type="email" id="lv-email" placeholder="Masukkan email" autocomplete="email" />
          </div>

          <div class="login-view-field-group">
            <div class="login-view-field-header">
              <label for="lv-password">Password</label>
              <a href="#" data-bs-toggle="modal" data-bs-target="#loginViewModal" class="login-view-forgot-link">Lupa Password?</a>
            </div>
            <div class="login-view-password-wrapper">
              <input type="password" id="lv-password" placeholder="Masukkan password" autocomplete="current-password" />
              <i class="bi bi-eye-slash login-view-toggle-pw" id="lv-togglePassword"></i>
            </div>
          </div>

          <button class="login-view-btn-signin" id="lv-btnSignIn">Masuk</button>

          <p class="login-view-create-account">Tidak memiliki akun? <a href="#">Hubungi staf Scango</a></p>
        </div>

        <div class="login-view-right-panel">
          <img src="/frontEnd/assets/background/9333f00957425e173ae553ca70f5b930.webp" alt="Login Banner" fetchpriority="high" decoding="async">
        </div>
      </div>

      <div class="modal fade" id="loginViewModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
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

function initLoginView() {
  const togglePw = document.getElementById("lv-togglePassword");
  const pwInput = document.getElementById("lv-password");
  const btnSignIn = document.getElementById("lv-btnSignIn");
  const emailInput = document.getElementById("lv-email");

  if (!togglePw || !pwInput || !btnSignIn || !emailInput) return;

  togglePw.addEventListener("click", function () {
    const type = pwInput.getAttribute("type") === "password" ? "text" : "password";
    pwInput.setAttribute("type", type);
    this.classList   .toggle("bi-eye");
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
        customClass: { popup: "sweetalert-popup", confirmButton: "sweetalert-btn-error" },
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

      const userRole = data.user.role ? data.user.role.trim().toLowerCase() : "";

      if (userRole === "student" || userRole === "siswa") {
        showToast("Akses ditolak! Akun Student tidak diizinkan masuk ke panel ini.", "danger");
        Swal.fire({
          title: "Login Gagal",
          text: "Anda tidak memiliki hak akses administrator.",
          icon: "error",
          draggable: true,
          customClass: { popup: "sweetalert-popup", confirmButton: "sweetalert-btn-error" },
          buttonsStyling: false,
        });
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.user.role);
      sessionStorage.setItem("username", data.user.username || data.user.email);
      showToast("Login Berhasil! Selamat Datang.", "success");

      Swal.fire({
        title: "Login Berhasil",
        icon: "success",
        draggable: true,
        customClass: { popup: "sweetalert-popup", confirmButton: "sweetalert-btn-success" },
        buttonsStyling: false,
      }).then(() => {
        showToast("Menuju halaman dashboard (Admin)", "success");
        navigateTo("data-siswa");
      });
    } catch (error) {
      showToast(`Error: ${error.message}`, "danger");
      Swal.fire({
        title: "Login Gagal",
        text: error.message,
        icon: "error",
        draggable: true,
        customClass: { popup: "sweetalert-popup", confirmButton: "sweetalert-btn-error" },
        buttonsStyling: false,
      });
      console.error("Error: ", error.message);
    } finally {
      btnSignIn.innerText = "Masuk";
      btnSignIn.disabled = false;
    }
  });
}
