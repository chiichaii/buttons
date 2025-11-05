const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzv30pBsm6Og3DysfBaEuJG8THzl7udb9qcHyCms-024qBbkBIEzktIY0lROwwyoI8/exec";

/* ========================================
   MAIN EVENT LISTENER
======================================== */
document.addEventListener("DOMContentLoaded", () => {
  let activePopup = null; // track active popup

  /* ========================================
     IMAGE POPUP BUTTONS
  ======================================== */
  document.querySelectorAll(".img-popup-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgSrc = btn.getAttribute("data-img");
      const accent = btn.getAttribute("data-accent");
      const name = btn.textContent.trim();

      logClick(name);

      // close popup when x2 clicked
      if (activePopup && activePopup.dataset.img === imgSrc) {
        activePopup.classList.remove("show");
        setTimeout(() => {
          activePopup.remove();
          activePopup = null;
        }, 600);
        return;
      }

      // close old popup for new popup
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

  /* ========================================
     POPUP IMAGE
  ======================================== */
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

    // matching border
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${accent}`)
      .trim();
    if (accentColor) {
      popup.style.borderColor = `rgba(${accentColor}, 0.4)`;
    }

    document.body.appendChild(popup);

    // popup positions above button
    requestAnimationFrame(() => {
      const btnRect = btn.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();

      // popup positions based on button
      let offset = 30;
      if (btn.classList.contains("float")) offset = 35;
      if (btn.classList.contains("btn-transparent")) offset = 5;

      const top = window.scrollY + btnRect.top - popupRect.height - offset;
      const left =
        window.scrollX + btnRect.left + btnRect.width / 2 - popupRect.width / 2;

      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;

      popup.classList.add("show");
      activePopup = popup;
    });

    // close popup
    popup.addEventListener("click", () => {
      popup.classList.remove("show");
      setTimeout(() => {
        popup.remove();
        activePopup = null;
      }, 600);
    });
  }

  /* ========================================
     CLICK EFFECT
  ======================================== */
  function logClick(name) {
    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        buttonName: name,
        timestamp: new Date().toISOString(),
      }),
    })
      .then(() => {
        console.log(`✅ Logged click for "${name}"`);
      })
      .catch((err) => console.error("⚠️ Logging failed:", err));

    // hover for touch screens
    document.querySelectorAll(".hover-popup-btn").forEach((btn) => {
      btn.addEventListener("touchstart", () => {
        btn.classList.toggle("show-hover");
      });
    });
  }
});
