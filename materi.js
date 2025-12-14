let materiData = [];
const materiPerPage = 4;
let currentPage = 1;

// Ambil element container
const container = document.getElementById("materi-list"); // Pastikan ID ini ada di HTML

// Ambil data JSON
fetch("assets/data/materi.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Data loaded:", data); // Debug: cek data di console
    materiData = data;
    renderMateri(currentPage);
    renderPagination();
  })
  .catch(error => {
    console.error("Gagal load materi:", error);
    // Tampilkan pesan error di UI
    container.innerHTML = `<p class="error">Gagal memuat materi: ${error.message}</p>`;
  });

function renderMateri(page) {
  // Pastikan container ada
  if (!container) {
    console.error("Element dengan ID 'materi-container' tidak ditemukan!");
    return;
  }

  // Kosongkan container terlebih dahulu
  container.innerHTML = "";

  const start = (page - 1) * materiPerPage;
  const end = start + materiPerPage;
  const data = materiData.slice(start, end);

  // Cek jika data kosong
  if (data.length === 0) {
    container.innerHTML = `<p>Tidak ada materi untuk ditampilkan.</p>`;
    return;
  }

  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("matericard");

    card.innerHTML = `
      <img src="${item.image}" alt="materi" />
      <div class="matericarddetails">
        <div>
          <p>${item.subtitle}</p>
          <h4>${item.title}</h4>
        </div>
        <a href="${item.link}">
          <i class="ri-arrow-right-up-line"></i>
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  
  if (!pagination) {
    console.error("Element dengan ID 'pagination' tidak ditemukan!");
    return;
  }
  
  pagination.innerHTML = "";

  const totalPage = Math.ceil(materiData.length / materiPerPage);

  for (let i = 1; i <= totalPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) btn.classList.add("active");

    btn.onclick = () => {
      currentPage = i;
      renderMateri(currentPage);
      renderPagination();
    };

    pagination.appendChild(btn);
  }
}



// salin
const copyBtn = document.getElementById("copyBtn");
const codeDisplay = document.querySelector(".code-display");

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(codeDisplay.innerText);
    copyBtn.textContent = "Tersalin!";
    setTimeout(() => { copyBtn.textContent = "Salin"; }, 1500);
  } catch(err) {
    console.error("Gagal menyalin:", err);
  }
});
