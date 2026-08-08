const content = document.getElementById("content");
content.innerHTML = `
<section class="py-5 px-3" style="margin-top: 8%;">
    <div class="container">

    <!-- Header -->
    <div class="text-center mb-5">
        <h1 class="section-title">Jelajahi fitur tanpa kebingungan</h1>
        <p class="section-subtitle mt-3">
        Kami menyediakan beberapa panduan dasar mengenai fitur pada platform ini
        </p>
    </div>

    <div class="row g-4 justify-content-center animate__animated animate__fadeIn">

        <!-- Card 1 -->
        <div class="col-12 col-sm-10 col-md-6 col-lg-4">
    <div class="trail-card" onclick="openVideo('/frontEnd/assets/videos/login.mp4')">
    <div class="trail-thumb">
        <img src="GANTI_PATH_GAMBAR.jpg"
            onerror="this.src='/frontEnd/assets/images/bgGuide.png'"
            alt="GANTI_NAMA_TRAIL">
        <div class="play-overlay">
        <div class="play-btn-circle">
            <i class="bi bi-play-fill"></i>
        </div>
        </div>
    </div>
    <div class="trail-body">
        <span class="badge-level bg-primary">Fitur Inti</span>
        <p class="trail-name">Login Dashboard</p>
        <p class="trail-desc">Masuk menuju akun anda</p>
    </div>
    </div>
</div>

<div class="col-12 col-sm-10 col-md-6 col-lg-4">
    <div class="trail-card" onclick="openVideo('/frontEnd/assets/videos/inputStudent.mp4')">
    <div class="trail-thumb">
        <img src="GANTI_PATH_GAMBAR.jpg"
            onerror="this.src='/frontEnd/assets/images/bgGuide.png'"
            alt="GANTI_NAMA_TRAIL">
        <div class="play-overlay">
        <div class="play-btn-circle"> 
            <i class="bi bi-play-fill"></i>   
        </div>
        </div>
    </div>
    <div class="trail-body">
        <span class="badge-level bg-primary">Fitur Inti</span>
        <p class="trail-name">Register Akun</p>
        <p class="trail-desc">Daftarkan anak didik baru untuk pencatatan absensi</p>
    </div>
    </div>
</div>
<div class="col-12 col-sm-10 col-md-6 col-lg-4">
    <div class="trail-card" onclick="openVideo('/frontEnd/assets/videos/scan.mp4')">
    <div class="trail-thumb">
        <img src="GANTI_PATH_GAMBAR.jpg"
            onerror="this.src='/frontEnd/assets/images/bgGuide.png'"
            alt="GANTI_NAMA_TRAIL">
        <div class="play-overlay">
        <div class="play-btn-circle">
            <i class="bi bi-play-fill"></i>
        </div>
        </div>
    </div>
    <div class="trail-body">
        <span class="badge-level bg-primary">Fitur Inti</span>
        <p class="trail-name">Absensi</p>
        <p class="trail-desc">Mulai absensi dengan tap kartu anda</p>
    </div>
    </div>
</div>
    </div>

    <!-- CTA -->
    <div class="text-center mt-5">
        <button class="btn-adventure" id="btnAnotherCard" onclick="anotherGuide()">Lihat Panduan Selengkapnya</button>
    </div>
</div>

<!-- panduan optional -->

<div id="anotherCard" class="animate__animated animate__fadeIn container mt-5" style="display: none;">
        <div class="row g-4 justify-content-center">

        <!-- Card 1 -->
        <div class="col-12 col-sm-10 col-md-6 col-lg-4">
    <div class="trail-card" onclick="openVideo('/frontEnd/assets/videos/about.mp4')">
    <div class="trail-thumb">
        <img src="GANTI_PATH_GAMBAR.jpg"
            onerror="this.src='/frontEnd/assets/images/bgGuide.png'"
            alt="GANTI_NAMA_TRAIL">
        <div class="play-overlay">
        <div class="play-btn-circle">
            <i class="bi bi-play-fill"></i>
        </div>
        </div>
    </div>
    <div class="trail-body">
        <span class="badge-level bg-secondary">Halaman Lainnya</span>
        <p class="trail-name">Tentang ScanGo</p>
        <p class="trail-desc">Melihat lebih detail lagi apa itu ScanGo</p>
    </div>
    </div>
</div>

<div class="col-12 col-sm-10 col-md-6 col-lg-4">
    <div class="trail-card" onclick="openVideo('/frontEnd/assets/videos/founder.mp4')">
    <div class="trail-thumb">
        <img src="GANTI_PATH_GAMBAR.jpg"
            onerror="this.src='/frontEnd/assets/images/bgGuide.png'"
            alt="GANTI_NAMA_TRAIL">
        <div class="play-overlay">
        <div class="play-btn-circle"> 
            <i class="bi bi-play-fill"></i>
        </div>
        </div>
    </div>
    <div class="trail-body">
        <span class="badge-level bg-secondary">Halaman Lainnya</span>
        <p class="trail-name">Pengembang ScanGo</p>
        <p class="trail-desc">Mencari tahu siapa dibalik ScanGo</p>
    </div>
    </div>
</div>
<div class="col-12 col-sm-10 col-md-6 col-lg-4">
    <div class="trail-card" onclick="openVideo('/frontEnd/assets/videos/contact.mp4')">
    <div class="trail-thumb">
        <img src="GANTI_PATH_GAMBAR.jpg"
            onerror="this.src='/frontEnd/assets/images/bgGuide.png'"
            alt="GANTI_NAMA_TRAIL">
        <div class="play-overlay">
        <div class="play-btn-circle">
            <i class="bi bi-play-fill"></i>
        </div>
        </div>
    </div>
    <div class="trail-body">
        <span class="badge-level bg-secondary">Halaman Lainnya</span>
        <p class="trail-name">Hubungi Kami</p>
        <p class="trail-desc">Tetap terhubung dengan kami</p>
    </div>
    </div>
</div>
    </div>

</div>
</section>

<!-- ===================== VIDEO MODAL ===================== -->
<div class="modal fade" id="videoModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
        <div class="modal-header">
        <h6 class="modal-title mb-0" id="videoModalLabel">Trail Video</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
            <iframe id="modalVideo"
            src=""
            style="position:absolute;top:0;left:0;width:100%;height:100%;"
            allow="autoplay; fullscreen"
            allowfullscreen
            frameborder="0">
            </iframe>
        </div>
        </div>
    </div>
    </div>
</div>
`;

function anotherGuide() {
  const card = document.getElementById("anotherCard");
  const btn = document.getElementById("btnAnotherCard");

  if (card.style.display === "none" || card.style.display === "") {
    card.style.display = "block";
    btn.innerText = "Sembunyikan Panduan Lainnya";
  } else {
    card.style.display = "none";
    btn.innerText = "Lihat Panduan Lainnya";
  }
}
