let routerState = {};
if (typeof window.routerState === "undefined") {
  window.routerState = routerState;
}

function navigateTo(page) {
  const content = document.getElementById("content");
  if (!content) return;

  const role = String(sessionStorage.getItem("role") || "").trim().toLowerCase();
  const token = sessionStorage.getItem("token");
  const isStudent = role === "student" || role === "user" || role === "siswa";

  if (isStudent && page !== "detail-siswa") {
    page = "detail-siswa";
    if (typeof window.routerState !== "object" || !window.routerState) {
      window.routerState = {};
    }
    
    const savedNis = sessionStorage.getItem("nis");
    if (savedNis) window.routerState.nis = savedNis;
  }

  const PROTECTED_PAGES = [
    "detail-siswa",
    "data-siswa",
    "data-guru",
    "print",
    "grafik",
    "statistika",
    "input-siswa",
  ];

  if (!token && PROTECTED_PAGES.includes(page)) {
    if (typeof renderLoginView !== "undefined") {
      const loginType = page === "data-guru" ? "guru" : "siswa";
      content.innerHTML = renderLoginView(loginType);
      if (typeof initLoginView !== "undefined")initLoginView(loginType);
      return;
    }
    window.location.href = "/frontEnd/page/structure/dashboard.html";
    return;
  }

  // Auto-close print preview overlay if open
  const printOverlay = document.getElementById("printPreviewModal");
  if (printOverlay && printOverlay.classList.contains("active")) {
    printOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  content.innerHTML = "";

  switch (page) {
    case "dashboard":
      if (typeof renderDashboard !== "undefined") {
        content.innerHTML = renderDashboard();
        if (typeof initDashboardListener !== "undefined")
          initDashboardListener();
        if (typeof setScanMode === "function") {
          setScanMode(window.currentScanMode || "masuk");
        }
      } else {
        window.location.href = "/frontEnd/page/structure/dashboard.html";
      }
      break;
    case "input-siswa":
      if (typeof renderInputSiswa !== "undefined") {
        content.innerHTML = renderInputSiswa();
        if (typeof initInputSiswaListener !== "undefined")
          initInputSiswaListener();
      } else {
        window.location.href = "/frontEnd/page/structure/dashboard.html";
      }
      break;
    case "tentang":
      window.location.href = "/frontEnd/page/structure/home.html";
      break;
    // case "data-siswa":
    // case "data-guru":
    //   if (typeof renderDataSiswa !== "undefined") {
    //     content.innerHTML =
    //       page === "data-siswa" ? renderDataSiswa() : renderDataGuru();
    //     if (typeof initDataTableListener !== "undefined")
    //       initDataTableListener();
    //   } else {
    //     window.location.href = "/frontEnd/page/structure/dashboard.html";
    //   }
    //   break;
    case "data-siswa":
    case "data-guru": {
      const isGuru = page === "data-guru";
      if (sessionStorage.getItem("token")) {
        if (typeof renderDataSiswa !== "undefined") {
          content.innerHTML = isGuru ? renderDataGuru() : renderDataSiswa();
          if (typeof initDataTableListener !== "undefined")
            initDataTableListener();
        } else {
          window.location.href = "/frontEnd/page/structure/dashboard.html";
        }
      } else {
        if (typeof renderLoginView !== "undefined") {
          content.innerHTML = renderLoginView(isGuru ? "guru" : "siswa");
          if (typeof initLoginView !== "undefined")
            initLoginView(isGuru ? "guru" : "siswa");
        } else {
          window.location.href = "/frontEnd/page/structure/dashboard.html";
        }
      }
      break;
    }

    case "detail-siswa":
      if (typeof renderDetailSiswa !== "undefined") {
        content.innerHTML = renderDetailSiswa();

        if (typeof initDetailSiswaListener !== "undefined") {
          initDetailSiswaListener(routerState);
        }
      } else {
        window.location.href = "/frontEnd/page/structure/dashboard.html";
      }
      break;
    case "grafik":
    case "statistika":
      if (typeof renderGrafik !== "undefined") {
        content.innerHTML = renderGrafik();
        if (typeof initStatistikaListener !== "undefined")
          initStatistikaListener();
      } else {
        window.location.href = "/frontEnd/page/structure/statistika.html";
      }
      break;
    case "scan-rfid":
      if (typeof renderScanRfid !== "undefined") {
        content.innerHTML = renderScanRfid();
        if (typeof initScanRfid !== "undefined") initScanRfid();
        if (typeof setScanMode === "function") {
          setScanMode(window.currentScanMode || "masuk");
        }
      } else {
        window.location.href = "/frontEnd/page/structure/dashboard.html";
      }
      break;
    // case "login":
    //   if (typeof renderLogin !== "undefined") {
    //     content.innerHTML = renderLogin();
    //     if (typeof initLoginView !== "undefined") initLoginView();
    //   }
    //   break;
    case "print":
      if (typeof renderPrint !== "undefined") {
        content.innerHTML = renderPrint();
        if (typeof initPrint !== "undefined") initPrint();
      } else {
        window.location.href = "/frontEnd/page/structure/dashboard.html";
      }
      break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Sinkronisasi foto profil dari localStorage untuk semua halaman yang memuat router.js
  const savedImage = localStorage.getItem("profileImageBase64");
  if (savedImage) {
    const profileImg = document.getElementById("profileImage");
    if (profileImg) profileImg.src = savedImage;

    // Fallback untuk img profile yang mungkin tidak punya ID (di sidebar menu yang ada /profiles/)
    const sidebarImgs = document.querySelectorAll(
      '.sidebar-menu img[src*="profiles"]',
    );
    sidebarImgs.forEach((img) => (img.src = savedImage));
  }

  const path = window.location.pathname;
  if (path.includes("statistika")) {
    navigateTo("statistika");
  } else if (path.includes("input")) {
    navigateTo("input-siswa");
  } else {
    navigateTo("dashboard");
  }
});
