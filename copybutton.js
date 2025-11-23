/* ---------------------------
   HIGHLIGHT HTML
----------------------------*/
function highlightHTML(code) {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="comment">$1</span>')
    .replace(/(&lt;\/?[a-zA-Z0-9\-]+)(.*?)(&gt;)/g, (match, p1, p2, p3) => {
      p2 = p2.replace(
        /([a-zA-Z\-:]+)(=)("[^"]*"|'[^']*')/g,
        '<span class="attr">$1</span>$2<span class="value">$3</span>'
      );
      return `<span class="tag">${p1}</span>${p2}<span class="tag">${p3}</span>`;
    });
}

/* ---------------------------
   HIGHLIGHT CSS
----------------------------*/
function highlightCSS(code) {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\/\*[\s\S]*?\*\//g, m => `<span class="comment">${m}</span>`)
    .replace(/^([^{]+)\{/gm, (m, selector) =>
      `<span class="selector">${selector.trim()}</span>{`
    )
    .replace(/([\w-]+)\s*:\s*([^;]+);/g, (m, prop, val) =>
      `<span class="property">${prop}</span>: <span class="value">${val}</span>;`
    );
}

/* ---------------------------
   GLOBAL HANDLER (unlimited blocks)
----------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".code-container").forEach(container => {
    
    const type = container.dataset.type;   // "html" / "css"
    const raw = container.querySelector(".raw");
    const pre = container.querySelector(".code-output");
    const btn = container.querySelector(".copy-btn");

    if (!raw || !pre || !btn) return;

    let text = raw.value.trim();

    // apply highlight
    pre.innerHTML =
      type === "html"
        ? highlightHTML(text)
        : type === "css"
        ? highlightCSS(text)
        : text;

    // copy handler
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        Swal.fire({
          icon: "success",
          title: "Disalin!",
          text: "Kode berhasil disalin.",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Tidak dapat menyalin kode.",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  });
});
