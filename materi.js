fetch("assets/data/materi.json")
  .then((res) => res.json())
  .then((materi) => {
    const container = document.getElementById("materi-list");

    materi.forEach((item) => {
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
  })
  .catch(err => console.error("Gagal memuat data:", err));
document.addEventListener("DOMContentLoaded", loadFeedback);

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
