/* =========================================
   DATABASE WARGA
   NAVBAR UI
========================================= */

const NavbarUI = (() => {
  /* =====================================
     RENDER PROFILE
  ===================================== */

  function renderProfile() {
    if (typeof Auth === "undefined" || typeof Auth.getUser !== "function") {
      return;
    }

    const user = Auth.getUser();

    if (!user) return;

    const nameEl = document.getElementById("profileName");

    const roleEl = document.getElementById("profileRole");

    const avatarEl = document.querySelector(".profile-avatar");

    const role = String(user.ROLE || "")
      .trim()
      .toUpperCase();

    const name = String(user.NAMA || user.USERNAME || "Pengguna").trim();

    const roleLabels = {
      ADMIN: "Administrator",
      LINGKUNGAN: "Ketua Lingkungan",
    };

    if (nameEl) {
      nameEl.textContent = name;
    }

    if (roleEl) {
      roleEl.textContent = roleLabels[role] || role || "Pengguna";
    }

    if (avatarEl) {
      avatarEl.textContent = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(function (part) {
          return part.charAt(0).toUpperCase();
        })
        .join("");
    }
  }

  /* =====================================
     PUBLIC API
  ===================================== */

  return {
    renderProfile: renderProfile,
  };
})();

window.NavbarUI = NavbarUI;
