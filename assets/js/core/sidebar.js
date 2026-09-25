/* =========================================
   SIDEBAR MODULE
========================================= */
/* =========================================
   SIDEBAR MODULE
========================================= */

const Sidebar = {
  currentPage: "dashboard",

  /* =====================================
     INIT
  ===================================== */

  init() {
    this.applyRole();

    this.restoreSidebarState();

    this.restoreLastPage();

    this.bindEvents();
  },

  /* =====================================
   ROLE ACCESS
===================================== */

  /* =====================================
     ROLE ACCESS
  ===================================== */

  getAllowedPages() {
    const role = String(Auth.getRole() || "")
      .trim()
      .toUpperCase();

    /* ===================================
       ADMIN
       Semua menu
    =================================== */

    if (role === "ADMIN") {
      return [
        "dashboard",
        "keluarga-penduduk",
        "mutasi",
        "laporan",
        "pengguna",
      ];
    }

    /* ===================================
       LINGKUNGAN
       Hanya Dashboard + Keluarga
    =================================== */

    if (role === "LINGKUNGAN") {
      return ["dashboard", "keluarga-penduduk"];
    }

    /* ===================================
       ROLE TIDAK DIKENAL
    =================================== */

    return ["dashboard", "keluarga-penduduk"];
  },

  /* =====================================
     APPLY ROLE
  ===================================== */

  /* =====================================
   APPLY ROLE
===================================== */

  applyRole() {
    const role = String(Auth.getRole() || "")
      .trim()
      .toUpperCase();

    const allowedPages = this.getAllowedPages();

    console.log("[Sidebar] Role:", role);
    console.log("[Sidebar] Allowed pages:", allowedPages);

    /* ===================================
     MENU ITEM
  =================================== */

    document.querySelectorAll(".menu-item").forEach((menu) => {
      const page = menu.dataset.page;

      /* ===============================
       LOGOUT
    =============================== */

      if (menu.dataset.action === "logout") {
        menu.hidden = false;
        menu.style.display = "";
        return;
      }

      /* ===============================
       MENU TANPA PAGE
    =============================== */

      if (!page) {
        menu.hidden = false;
        menu.style.display = "";
        return;
      }

      /* ===============================
       CEK AKSES
    =============================== */

      const allowed = allowedPages.includes(page);

      menu.hidden = !allowed;
      menu.style.display = allowed ? "" : "none";

      console.log(`[Sidebar] ${page}:`, allowed ? "SHOW" : "HIDE");
    });

    /* ===================================
     HIDE EMPTY SECTION
  =================================== */

    document.querySelectorAll(".menu-section").forEach((section) => {
      const menus = section.querySelectorAll(".menu-item");

      if (!menus.length) {
        section.style.display = "";
        return;
      }

      const hasVisibleMenu = Array.from(menus).some(
        (menu) => !menu.hidden && menu.style.display !== "none",
      );

      section.hidden = !hasVisibleMenu;
      section.style.display = hasVisibleMenu ? "" : "none";
    });
  },

  /* =====================================
     BIND EVENTS
  ===================================== */

  /* =====================================
   BIND EVENTS
===================================== */

  bindEvents() {
    document.addEventListener("click", (e) => {
      /* =================================
       SIDEBAR TOGGLE
    ================================= */

      const sidebarToggle = e.target.closest("#btnSidebar");

      if (sidebarToggle) {
        e.preventDefault();

        this.toggle();

        return;
      }

      /* =================================
      MOBILE CLICK OUTSIDE
    ================================= */

      if (
        window.innerWidth <= 768 &&
        sidebar?.classList.contains("mobile-open") &&
        !e.target.closest(".sidebar")
      ) {
        sidebar.classList.remove("mobile-open");

        console.log("[Sidebar] Mobile: CLOSED");

        return;
      }

      /* =================================
       LOGOUT
    ================================= */

      const menu = e.target.closest(".menu-item");

      if (!menu) return;

      if (menu.dataset.action === "logout") {
        e.preventDefault();

        this.logout();

        return;
      }

      /* =================================
       PAGE
    ================================= */

      const page = menu.dataset.page;

      if (!page) return;

      this.changePage(page);
    });
  },

  /* =====================================
   SIDEBAR TOGGLE
===================================== */

  toggle() {
    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) {
      console.warn("[Sidebar] Sidebar tidak ditemukan.");
      return;
    }

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      sidebar.classList.toggle("mobile-open");

      console.log(
        "[Sidebar] Mobile:",
        sidebar.classList.contains("mobile-open") ? "OPEN" : "CLOSED",
      );

      return;
    }

    sidebar.classList.toggle("collapsed");

    console.log(
      "[Sidebar] Desktop:",
      sidebar.classList.contains("collapsed") ? "COLLAPSED" : "EXPANDED",
    );
  },

  /* =====================================
     CHANGE PAGE
  ===================================== */

  changePage(page) {
    const allowedPages = this.getAllowedPages();

    /* ===================================
       SECURITY UI
       Jangan izinkan navigasi ke menu
       yang tidak dimiliki role.
    =================================== */

    if (!allowedPages.includes(page)) {
      console.warn("[Sidebar] Akses halaman ditolak:", page);

      this.currentPage = "dashboard";

      this.setActive("dashboard");

      localStorage.setItem("lastPage", "dashboard");

      Router.navigate("dashboard");

      return;
    }

    this.currentPage = page;

    this.setActive(page);

    localStorage.setItem("lastPage", page);

    Router.navigate(page);
  },

  /* =====================================
     ACTIVE MENU
  ===================================== */

  setActive(page) {
    document.querySelectorAll(".menu-item").forEach((menu) => {
      menu.classList.remove("active");

      if (menu.dataset.page === page && !menu.hidden) {
        menu.classList.add("active");
      }
    });
  },

  /* =====================================
   RESTORE SIDEBAR STATE
===================================== */

  /* =====================================
   RESTORE SIDEBAR STATE
===================================== */

  restoreSidebarState() {
    const sidebar = document.querySelector("#sidebar");

    if (!sidebar) {
      console.warn("[Sidebar] Element #sidebar tidak ditemukan.");
      return;
    }

    const collapsed = localStorage.getItem("sidebarCollapsed") === "1";

    sidebar.classList.toggle("collapsed", collapsed);

    console.log("[Sidebar] State:", collapsed ? "COLLAPSED" : "EXPANDED");
  },

  /* =====================================
     RESTORE LAST PAGE
  ===================================== */

  restoreLastPage() {
    let page = localStorage.getItem("lastPage") || "dashboard";

    const role = typeof Auth !== "undefined" ? Auth.getRole() : "";

    /* =====================================
     LINGKUNGAN HANYA BOLEH:
     dashboard
     keluarga-penduduk
  ===================================== */

    if (
      role === "LINGKUNGAN" &&
      !["dashboard", "keluarga-penduduk"].includes(page)
    ) {
      page = "dashboard";

      localStorage.setItem("lastPage", page);
    }

    this.currentPage = page;

    this.setActive(page);

    Router.navigate(page);
  },

  /* =====================================
     LOGOUT
  ===================================== */

  logout() {
    try {
      console.log("[Sidebar] Logout...");

      /* ===============================
       HAPUS SESSION
    =============================== */

      Auth.logout();

      /* ===============================
       HAPUS LAST PAGE
    =============================== */

      localStorage.removeItem("lastPage");

      /* ===============================
       MASUK MODE LOGIN
    =============================== */

      document.body.classList.add("login-mode");

      /* ===============================
       KEMBALI KE LOGIN
    =============================== */

      Router.navigate("login");
    } catch (error) {
      console.error("[Sidebar] Logout gagal:", error);

      Toast.error(error?.message || "Gagal melakukan logout.");
    }
  },
};
