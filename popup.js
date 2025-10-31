const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzMrUfAg4BB0rii_syMfWOg58383bgDUaT8Ixr9VO-rHcbuLYr6clo42BcY1TcJp5Gf/exec";

document.addEventListener("DOMContentLoaded", () => {
  let activePopup = null;

  // Attach click listener to every image popup button
  document.querySelectorAll(".img-popup-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgSrc = btn.getAttribute("data-img");
      const accent = btn.getAttribute("data-accent");
      const name = btn.textContent.trim();

      // Log click to Google Sheet
      logClick(name);

      // Handle popup visibility
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

  // Function to create and show the popup
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

    // Border color using CSS accent variable
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

      // Position popup slightly above the button
      const top = window.scrollY + btnRect.top - popupRect.height - offset;
      const left =
        window.scrollX + btnRect.left + btnRect.width / 2 - popupRect.width / 2;

      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;

      popup.classList.add("show");
      activePopup = popup;
    });

    // Clicking the popup closes it
    popup.addEventListener("click", () => {
      popup.classList.remove("show");
      setTimeout(() => {
        popup.remove();
        activePopup = null;
      }, 600);
    });
  }

  // Function to log clicks to Google Sheets
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
  }
});
