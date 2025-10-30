document.addEventListener("DOMContentLoaded", () => {
  let activePopup = null;

  document.querySelectorAll(".img-popup-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgSrc = btn.getAttribute("data-img");
      const accent = btn.getAttribute("data-accent");

      if (activePopup && activePopup.dataset.img === imgSrc) {
        activePopup.classList.remove("show");
        setTimeout(() => {
          activePopup.remove();
          activePopup = null;
        }, 600);
        return;
      }

      if (activePopup) {
        activePopup.classList.remove("show");
        setTimeout(() => {
          activePopup.remove();
          activePopup = null;
          openPopup(btn, imgSrc, accent);
        }, 600);
      } else {
        openPopup(btn, imgSrc, accent);
      }
    });
  });

  function openPopup(btn, imgSrc, accent) {
    const popup = document.createElement("div");
    popup.className = "image-popup";
    popup.dataset.accent = accent;
    popup.dataset.img = imgSrc;

    popup.innerHTML = `
      <div class="image-popup-box">
        <img src="${imgSrc}" alt="popup image">
      </div>
    `;

    // border color from accent variable
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${accent}`)
      .trim();
    if (accentColor) {
      popup.style.borderColor = `rgba(${accentColor}, 0.4)`;
    }

    document.body.appendChild(popup);

    requestAnimationFrame(() => {
      const btnRect = btn.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();

      const offset = 30;
      const top = window.scrollY + btnRect.top - popupRect.height - offset;
      const left =
        window.scrollX + btnRect.left + btnRect.width / 2 - popupRect.width / 2;

      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;

      popup.classList.add("show");
      activePopup = popup;
    });

    popup.addEventListener("click", () => {
      popup.classList.remove("show");
      setTimeout(() => {
        popup.remove();
        activePopup = null;
      }, 600);
    });
  }
});
