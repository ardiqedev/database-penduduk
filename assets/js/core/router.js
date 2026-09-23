/* =========================================
   ROUTER MODULE
========================================= */

const Router = {
  /* =====================================
       ROUTES
  ===================================== */

  routes: {
    dashboard: "pages/dashboard.html",

    "keluarga-penduduk": "pages/kartu-keluarga.html",

    mutasi: "pages/mutasi.html",

    laporan: "pages/laporan.html",

    pengguna: "pages/pengguna.html",

    pengaturan: "pages/pengaturan.html",
  },

  currentPage: null,

  /* =====================================
       LOAD COMPONENT
  ===================================== */

  async loadComponent(file, targetId) {
    try {
      const res = await fetch(file);

      if (!res.ok) {
        throw new Error(`Component tidak ditemukan : ${file}`);
      }

      document.getElementById(targetId).innerHTML = await res.text();

      lucide.createIcons();
    } catch (err) {
      console.error(err);
    }
  },

  /* =====================================
       LOAD PAGE
  ===================================== */

  async loadPage(file) {
    try {
      const res = await fetch(file);

      if (!res.ok) {
        throw new Error(`Page tidak ditemukan : ${file}`);
      }

      document.getElementById("content").innerHTML = await res.text();

      lucide.createIcons();
    } catch (err) {
      this.show404();

      console.error(err);
    }
  },

  /* =====================================
       NAVIGATE
  ===================================== */

  async navigate(page) {
    if (!this.routes[page]) {
      console.error(`Route "${page}" tidak ditemukan.`);
      return;
    }

    this.currentPage = page;

    this.saveCurrentPage(page);

    await this.loadPage(this.routes[page]);

    this.initModule(page);
  },

  /* =====================================
       INIT MODULE
  ===================================== */

  /* =====================================
     INIT MODULE
===================================== */

  initModule(page) {
    const modules = {
      dashboard: typeof Dashboard !== "undefined" ? Dashboard : null,

      "keluarga-penduduk":
        typeof KartuKeluargaController !== "undefined"
          ? KartuKeluargaController
          : null,

      mutasi:
        typeof MutasiPendudukController !== "undefined"
          ? MutasiPendudukController
          : null,

      laporan: typeof Laporan !== "undefined" ? Laporan : null,

      pengguna: typeof Pengguna !== "undefined" ? Pengguna : null,

      pengaturan: typeof Pengaturan !== "undefined" ? Pengaturan : null,
    };

    const module = modules[page];

    if (module?.init) {
      module.init();
    }
  },

  /* =====================================
       SAVE PAGE
  ===================================== */

  saveCurrentPage(page) {
    localStorage.setItem("lastPage", page);
  },

  /* =====================================
       GET LAST PAGE
  ===================================== */

  getLastPage() {
    return localStorage.getItem("lastPage") || "dashboard";
  },

  /* =====================================
       SHOW 404
  ===================================== */

  show404() {
    document.getElementById("content").innerHTML = `

      <div class="page-error">

        <h2>404</h2>

        <p>Halaman tidak ditemukan.</p>

      </div>

    `;
  },

  /* =====================================
       GET INITIAL PAGE
  ===================================== */

  getInitialPage() {
    return this.getLastPage();
  },

  /* =====================================
       START
  ===================================== */

  async start() {
    const page = this.getInitialPage();

    console.log("INITIAL PAGE:", page);

    await this.navigate(page);
  },
};
