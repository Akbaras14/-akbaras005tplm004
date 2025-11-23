

(() => {
  "use strict";
  const $ = (q, ctx = document) => ctx.querySelector(q);
  const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));
  const exists = el => el !== null && el !== undefined;
  /* NAVBAR */
  const navbar = $(".navbar");
  const menuBtn = $("#menu-btn"); 
  const navLinks = $("#nav-links");
  const overlay = $("#overlay");

  if (!exists(menuBtn) && exists(navLinks)) {
    const fallback = document.createElement("div");
    fallback.id = "menu-btn";
    fallback.className = "navmenubtn";
    fallback.innerHTML = '<i class="fas fa-bars"></i>';
    navbar.querySelector(".navheader")?.appendChild(fallback);
  }

  const _menuBtn = $("#menu-btn");
  const _navLinks = $("#nav-links");
  const _overlay = $("#overlay");

  function toggleMenu() {
    if (!_navLinks) return;
    const nowActive = _navLinks.classList.toggle("active");
    if (_overlay) _overlay.classList.toggle("active", nowActive);

    _menuBtn.innerHTML = nowActive
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  }

  if (_menuBtn) {
    _menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  if (_overlay) {
    _overlay.addEventListener("click", () => {
      if (_navLinks) _navLinks.classList.remove("active");
      _overlay.classList.remove("active");
      if (_menuBtn) _menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  }

  // NAVBAR MOBILE LINK CLICK
  if (_navLinks) {
    _navLinks.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a && _navLinks.classList.contains("active")) {
        _navLinks.classList.remove("active");
        _overlay?.classList.remove("active");
        _menuBtn && (_menuBtn.innerHTML = '<i class="fas fa-bars"></i>');
      }
    });
  }

  /* STICKY SCROLL */
  const STICKY_THRESHOLD = 20;
  function handleSticky() {
    if (!navbar) return;
    if (window.scrollY > STICKY_THRESHOLD) navbar.classList.add("sticky");
    else navbar.classList.remove("sticky");
  }
  window.addEventListener("scroll", handleSticky, { passive: true });
  handleSticky();

  /* LINK */
  const sections = $$("section[id]");
  function handleActiveLinkOnScroll() {
    if (!sections.length) return;
    let current = "";
    const offset = 120; 
    sections.forEach(section => {
      const top = section.offsetTop - offset;
      if (window.pageYOffset >= top) current = section.getAttribute("id");
    });

    // update active
    $$(".links a").forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  }
  window.addEventListener("scroll", handleActiveLinkOnScroll, { passive: true });
  handleActiveLinkOnScroll();

  /* SCROLL */
  const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
  };
  if (typeof ScrollReveal !== "undefined") {
    try {
      ScrollReveal().reveal(".headercontainer img", { ...scrollRevealOption });
      ScrollReveal().reveal(".headercontainer h1", { ...scrollRevealOption, delay: 500 });
      ScrollReveal().reveal(".headercontainer p", { ...scrollRevealOption, delay: 1000 });
      ScrollReveal().reveal(".btnscv", { ...scrollRevealOption, delay: 1500 });
      ScrollReveal().reveal(".matericard", { ...scrollRevealOption, interval: 500 });
      ScrollReveal().reveal(".footer__container h2", { ...scrollRevealOption });
      ScrollReveal().reveal(".footer__container p", { ...scrollRevealOption, delay: 500 });
      ScrollReveal().reveal(".footer__container .kirimemail", { ...scrollRevealOption, delay: 1000 });
      ScrollReveal().reveal(".footer__socials", { ...scrollRevealOption, delay: 1500 });
    } catch (err) {
      console.warn("ScrollReveal error:", err);
    }
  }

  /* RUNNING TEXT */
  const runningText = $(".running-text");
  if (runningText) {
    runningText.addEventListener("mouseenter", () => {
      runningText.style.animationPlayState = "paused";
    });
    runningText.addEventListener("mouseleave", () => {
      runningText.style.animationPlayState = "running";
    });
  }

  /* BUTTON UP */
  const SCROLL_TOP_ID = "btn-scroll-top";
  function createScrollTopButton() {
    if (document.getElementById(SCROLL_TOP_ID)) return;
    const btn = document.createElement("button");
    btn.id = SCROLL_TOP_ID;
    btn.title = "Kembali ke atas";
    btn.setAttribute("aria-label", "Scroll to top");
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.style.display = "none";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 300) btn.style.display = "block";
        else btn.style.display = "none";
      },
      { passive: true }
    );
  }
  createScrollTopButton();

  /* POST SPREEDSHETT */
  const scriptURL = "https://script.google.com/macros/s/AKfycbzC7_x-G9Ia1oNEoV5vyD3YzQjNwBWn-V2pjRdSsPnNE65Dgh5KLtk3aDTNDYbNu8s/exec";
  let lastSubmitTime = 0;
  const saranForm = $("#saranForm");
  const loadingEl = $("#loading");

  if (saranForm) {
    saranForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const namaInput = $("#nama");
      const saranInput = $("#saran");
      const ratingInput = document.querySelector("input[name='rating']:checked");

      const nama = namaInput ? namaInput.value.trim() : "";
      const saran = saranInput ? saranInput.value.trim() : "";
      const now = Date.now();

      // VALIDASI INPUT
      if (!nama || nama.length < 3) {
        return Swal ? Swal.fire("Nama kurang!", "Minimal 3 karakter.", "warning") : alert("Nama kurang! (minimal 3 karakter)");
      }
      if (!ratingInput) {
        return Swal ? Swal.fire("Rating kosong!", "Pilih rating bintang.", "warning") : alert("Pilih rating.");
      }
      if (!saran || saran.length < 5) {
        return Swal ? Swal.fire("Saran kurang!", "Minimal 5 karakter.", "warning") : alert("Saran kurang! (minimal 5 karakter)");
      }

      // Anti-spam 30 detik
      if (now - lastSubmitTime < 30000) {
        return Swal ? Swal.fire("Terlalu cepat!", "Kirim lagi dalam 30 detik.", "error") : alert("Terlalu cepat! Tunggu 30 detik.");
      }
      lastSubmitTime = now;

      //loading
      if (loadingEl) loadingEl.style.display = "block";

      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("rating", ratingInput.value);
      formData.append("saran", saran);

      try {
        await fetch(scriptURL, {
          method: "POST",
          body: formData,
          mode: "no-cors"
        });

        if (loadingEl) loadingEl.style.display = "none";

        if (typeof Swal !== "undefined") {
          Swal.fire("Terkirim!", "Terima kasih atas saran Anda!", "success");
        } else {
          alert("Terkirim! Terima kasih.");
        }
        saranForm.reset();
      } catch (error) {
        if (loadingEl) loadingEl.style.display = "none";
        if (typeof Swal !== "undefined") {
          Swal.fire("Error!", "Tidak dapat mengirim data.", "error");
        } else {
          alert("Error mengirim data.");
        }
        console.error("Form submit error:", error);
      }
    });
  }


  window.addEventListener("load", () => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      _navLinks?.classList.remove("active");
      _overlay?.classList.remove("active");
      _menuBtn && (_menuBtn.innerHTML = '<i class="fas fa-bars"></i>');
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      _navLinks?.classList.remove("active");
      _overlay?.classList.remove("active");
      _menuBtn && (_menuBtn.innerHTML = '<i class="fas fa-bars"></i>');
    }
  });

  // End of IIFE
})();

// === LOAD DATA DARI GOOGLE SPREADSHEET ===
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzxgUKHqhejkLKfldgLDXX5W1hk-ztRqUvMzEcHsRtklCwdxZwLIev60Jc_LBSWSF6F/exec";
let allFeedback = [];
let filteredFeedback = [];
let itemsPerPage = 5;
let currentIndex = 0;

// === LOAD DATA FROM GOOGLE SHEET ===
async function loadFeedback() {
  const feedbackContainer = document.getElementById("feedbackContainer");
  if (!feedbackContainer) return;

  try {
    const res = await fetch(SHEET_API_URL);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Data loaded:", data);

    // Handle case ketika data bukan array atau kosong
    if (!Array.isArray(data)) {
      console.warn("Data is not an array:", data);
      allFeedback = [];
    } else {
      allFeedback = data.reverse();
    }
    
    filteredFeedback = [...allFeedback];
    currentIndex = 0;
    feedbackContainer.innerHTML = "";

    // Tampilkan pesan jika tidak ada data
    if (allFeedback.length === 0) {
      feedbackContainer.innerHTML = "<p style='text-align: center; color: #666;'>Belum ada feedback.</p>";
      toggleLoadMore();
      return;
    }

    renderFeedback();
    toggleLoadMore();

  } catch(err) {
    console.error("Error loading feedback:", err);
    feedbackContainer.innerHTML = "<p style='color:red;'>Gagal memuat data.</p>";
  }
}

// === RENDER FEEDBACK CARD ===
function renderFeedback() {
  const container = document.getElementById("feedbackContainer");
  if (!container) return;

  const nextItems = filteredFeedback.slice(currentIndex, currentIndex + itemsPerPage);

  nextItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "feedback-card";

    // Pastikan rating berupa number dan valid
    const rating = parseInt(item.rating) || 0;
    const maxRating = 5;
    
    card.innerHTML = `
      <div class="name">${escapeHtml(item.nama)}</div>
      <div class="rating-stars">
        ${"★".repeat(rating)}${"☆".repeat(maxRating - rating)}
        <span class="rating-number">(${rating}/5)</span>
      </div>
      <div class="text">${escapeHtml(item.saran)}</div>
      <div class="timestamp">${formatDate(item.timestamp)}</div>
    `;

    container.appendChild(card);
  });

  currentIndex += itemsPerPage;
  toggleLoadMore();
}
// Security: Escape HTML untuk mencegah XSS
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Format tanggal yang lebih readable
function formatDate(timestamp) {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return timestamp; // fallback ke original timestamp
  }
}

// === LOAD MORE BUTTON ===
function toggleLoadMore() {
  const btn = document.getElementById("loadMoreBtn");
  if (btn) {
    btn.style.display = currentIndex < filteredFeedback.length ? "block" : "none";
  }
}

// === SETUP EVENT LISTENERS === 
function setupEventListeners() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const ratingFilter = document.getElementById("ratingFilter");
  
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", renderFeedback);
  }
  
  if (ratingFilter) {
    ratingFilter.addEventListener("change", (e) => {
      const value = e.target.value;

      if (value === "all") {
        filteredFeedback = [...allFeedback];
      } else {
        filteredFeedback = allFeedback.filter(item => parseInt(item.rating) == parseInt(value));
      }

      currentIndex = 0;
      const feedbackContainer = document.getElementById("feedbackContainer");
      if (feedbackContainer) {
        feedbackContainer.innerHTML = "";
      }
      renderFeedback();
    });
  }
}

// === LOAD DATA WHEN PAGE READY ===
document.addEventListener("DOMContentLoaded", function() {
  setupEventListeners();
  loadFeedback();
});
// === FILTER RATING ===
document.getElementById("ratingFilter").addEventListener("change", (e) => {
  const value = e.target.value;

  if (value === "all") {
    filteredFeedback = [...allFeedback];
  } else {
    filteredFeedback = allFeedback.filter(item => item.rating == value);
  }

  currentIndex = 0;
  document.getElementById("feedbackContainer").innerHTML = "";
  renderFeedback();
});

// === LOAD DATA WHEN PAGE READY ===
document.addEventListener("DOMContentLoaded", loadFeedback);


var VideoAku = document.getElementById("videoku");

function tekanPause() {
  if (VideoAku.paused)
    VideoAku.play();
      else
        VideoAku.pause();
    }

    function menjadiBig() {
      VideoAku.width = 560;
    }

    function menjadiSmall() {
      VideoAku.width = 320;
    }

    function menjadiNormal() {
      VideoAku.width = 430;
    }