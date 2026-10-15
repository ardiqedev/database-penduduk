/* =========================================
   DATABASE WARGA
   THEME MODULE
========================================= */

const Theme = {
  STORAGE_KEY: "dbwarga_theme",

  /* =====================================
     INIT
  ===================================== */

  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);

    this.apply(savedTheme === "dark" ? "dark" : "light");

    const button = document.getElementById("btnTheme");

    if (!button || button.dataset.themeBound === "true") {
      return;
    }

    button.dataset.themeBound = "true";

    button.addEventListener("click", () => {
      const currentTheme = document.documentElement.dataset.theme || "light";

      this.apply(currentTheme === "dark" ? "light" : "dark");
    });
  },

  /* =====================================
     APPLY THEME
  ===================================== */

  apply(theme) {
    const normalizedTheme = theme === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = normalizedTheme;

    localStorage.setItem(this.STORAGE_KEY, normalizedTheme);

    const button = document.getElementById("btnTheme");

    if (button) {
      const icon = button.querySelector("[data-lucide]");

      if (icon) {
        icon.setAttribute(
          "data-lucide",
          normalizedTheme === "dark" ? "sun" : "moon",
        );

        if (window.lucide?.createIcons) {
          window.lucide.createIcons();
        }
      }

      button.title =
        normalizedTheme === "dark"
          ? "Gunakan tema terang"
          : "Gunakan tema gelap";

      button.setAttribute("aria-label", button.title);
    }
  },
};

window.Theme = Theme;
