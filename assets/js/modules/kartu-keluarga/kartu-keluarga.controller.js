/* =========================================
   DATABASE WARGA
   KARTU KELUARGA & PENDUDUK
   CONTROLLER
   FRONTEND ONLY
========================================= */

(() => {
  "use strict";

  const KartuKeluargaController = {
    /* =====================================
       STATE
    ===================================== */

    state: {
      kk: [],

      selectedKK: null,

      anggota: [],

      activeMainTab: "kk",

      activeDetailTab: "anggota",

      viewMode: "list",

      filters: {
        search: "",

        lingkungan: "",

        status: "",

        sort: "terbaru",
      },

      currentPage: 1,

      perPage: 10,

      loading: false,
    },

    /* =====================================
       INIT
    ===================================== */

    init() {
      console.log("[KartuKeluargaController] init");

      Skeleton.keluarga("#keluargaSkeleton");

      document.getElementById("keluargaSkeleton")?.classList.add("active");

      this.bindEvents();

      this.loadData();
    },

    /* =====================================
       LOAD DATA
    ===================================== */

    async loadData() {
      this.state.loading = true;

      try {
        console.log("[KartuKeluargaController] Mengambil data KK...");

        this.state.kk = await KartuKeluargaService.getKKWithMemberCount();

        console.log("[KartuKeluargaController] Data KK:", this.state.kk);

        this.renderList();
      } catch (error) {
        console.error("[KartuKeluargaController] loadData:", error);

        this.state.kk = [];

        this.renderList();
      } finally {
        this.state.loading = false;

        document.getElementById("keluargaSkeleton")?.classList.remove("active");
      }
    },

    /* =====================================
       RENDER LIST
    ===================================== */

    renderList() {
      let filtered = [...this.state.kk];

      const { search, lingkungan, status, sort } = this.state.filters;

      /* ===============================
     SEARCH
  =============================== */

      const keyword = String(search || "")
        .trim()
        .toLowerCase();

      if (keyword) {
        filtered = filtered.filter((item) => {
          return (
            String(item.ID_KK || "")
              .toLowerCase()
              .includes(keyword) ||
            String(item.NO_KK || "")
              .toLowerCase()
              .includes(keyword) ||
            String(item.KEPALA_KELUARGA || "")
              .toLowerCase()
              .includes(keyword) ||
            String(item.ALAMAT || "")
              .toLowerCase()
              .includes(keyword)
          );
        });
      }

      /* ===============================
     LINGKUNGAN
  =============================== */

      if (lingkungan) {
        filtered = filtered.filter(
          (item) => String(item.ID_LINGKUNGAN) === String(lingkungan),
        );
      }

      /* ===============================
     STATUS
  =============================== */

      if (status) {
        filtered = filtered.filter(
          (item) => String(item.STATUS_KK) === String(status),
        );
      }

      /* ===============================
     SORT
  =============================== */

      if (sort === "nama") {
        filtered.sort((a, b) =>
          String(a.KEPALA_KELUARGA || "").localeCompare(
            String(b.KEPALA_KELUARGA || ""),
          ),
        );
      }

      if (sort === "terlama") {
        filtered.reverse();
      }

      /* ===============================
     PAGINATION
  =============================== */

      const total = filtered.length;

      const totalPages = Math.max(1, Math.ceil(total / this.state.perPage));

      if (this.state.currentPage > totalPages) {
        this.state.currentPage = totalPages;
      }

      const start = (this.state.currentPage - 1) * this.state.perPage;

      const items = filtered.slice(start, start + this.state.perPage);

      /* ===============================
     RENDER
  =============================== */

      KartuKeluargaView.renderList({
        items,

        total,

        currentPage: this.state.currentPage,

        totalPages,

        selectedKK: this.state.selectedKK,
      });
    },

    /* =====================================
       SELECT KK
    ===================================== */

    selectKK(idKK) {
      if (!idKK) {
        return;
      }

      this.loadKKDetail(idKK);
    },

    /* =====================================
       LOAD DETAIL KK
    ===================================== */

    async loadKKDetail(idKK) {
      if (!idKK) {
        return;
      }

      try {
        console.log("[KartuKeluargaController] Load detail:", idKK);

        const kk = await KartuKeluargaService.getKKById(idKK);

        if (!kk) {
          console.warn("[KartuKeluargaController] KK tidak ditemukan:", idKK);

          return;
        }

        const anggota = await KartuKeluargaService.getAnggota(idKK);

        this.state.selectedKK = idKK;

        this.state.anggota = anggota;

        KartuKeluargaView.renderDetail(kk);

        KartuKeluargaView.renderAnggota(anggota);

        KartuKeluargaView.setDetailTab(this.state.activeDetailTab);

        this.renderList();
      } catch (error) {
        console.error("[KartuKeluargaController] loadKKDetail:", error);
      }
    },

    /* =====================================
       SEARCH KK
    ===================================== */

    searchKK(value) {
      this.state.filters.search = String(value || "");

      this.state.currentPage = 1;

      this.renderList();
    },

    /* =====================================
       FILTER LINGKUNGAN
    ===================================== */

    filterLingkungan(value) {
      this.state.filters.lingkungan = String(value || "");

      this.state.currentPage = 1;

      this.renderList();
    },

    /* =====================================
       FILTER STATUS
    ===================================== */

    filterStatus(value) {
      this.state.filters.status = String(value || "");

      this.state.currentPage = 1;

      this.renderList();
    },

    /* =====================================
       SORT
    ===================================== */

    sortKK(value) {
      this.state.filters.sort = value || "terbaru";

      this.state.currentPage = 1;

      this.renderList();
    },

    /* =====================================
       RESET FILTER
    ===================================== */

    resetFilter() {
      this.state.filters = {
        search: "",

        lingkungan: "",

        status: "",

        sort: "terbaru",
      };

      this.state.currentPage = 1;

      /*
       * Reset nilai HTML.
       */

      const search = document.getElementById("kkSearch");

      if (search) {
        search.value = "";
      }

      const lingkungan = document.getElementById("kkFilterLingkungan");

      if (lingkungan) {
        lingkungan.value = "";
      }

      const status = document.getElementById("kkFilterStatus");

      if (status) {
        status.value = "";
      }

      const sort = document.getElementById("kkSort");

      if (sort) {
        sort.value = "terbaru";
      }

      this.renderList();
    },

    /* =====================================
       CHANGE PER PAGE
    ===================================== */

    changePerPage(value) {
      const perPage = Number(value);

      if (!Number.isInteger(perPage) || perPage <= 0) {
        return;
      }

      this.state.perPage = perPage;

      this.state.currentPage = 1;

      this.renderList();
    },

    /* =====================================
       PAGINATION NUMBER
    ===================================== */

    /* =====================================
   PAGINATION GO TO PAGE
===================================== */

    goToPage(page) {
      const target = Number(page);

      if (!Number.isInteger(target)) {
        return;
      }

      if (target < 1) {
        return;
      }

      this.state.currentPage = target;

      this.renderList();
    },

    /* =====================================
   HANDLE SAVE KK
===================================== */

    async handleSaveKK() {
      const data = this.getTambahKKFormData();

      /* ===============================
     VALIDASI
  =============================== */

      const validation = KartuKeluargaService.validateKK(data);

      if (!validation.valid) {
        const firstError = Object.values(validation.errors)[0];

        Toast.error(firstError || "Data Kartu Keluarga belum lengkap.");

        return;
      }

      /* ===============================
     BUTTON
  =============================== */

      const button = document.querySelector('[data-modal-action="save-kk"]');

      const originalHTML = button?.innerHTML;

      if (button) {
        button.disabled = true;

        button.innerHTML = `
      <i data-lucide="loader-circle"></i>
      <span>Menyimpan...</span>
    `;

        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      }

      try {
        console.log("[KartuKeluargaController] Save KK:", data);

        /* =============================
       SAVE BACKEND
    ============================= */

        const saved = await KartuKeluargaService.saveKK(data);

        console.log("[KartuKeluargaController] KK berhasil disimpan:", saved);

        /* =============================
       CLOSE MODAL
    ============================= */

        Modal.close();

        Toast.success("Kartu Keluarga berhasil ditambahkan.");

        /* =============================
       REFRESH DATA
    ============================= */

        await this.loadData();

        /* =============================
       SELECT KK BARU
    ============================= */

        if (saved?.ID_KK) {
          await this.selectKK(saved.ID_KK);
        }
      } catch (error) {
        console.error("[KartuKeluargaController] saveKK:", error);

        Toast.error(error.message || "Gagal menyimpan Kartu Keluarga.");
      } finally {
        if (button) {
          button.disabled = false;

          button.innerHTML = originalHTML;

          if (typeof lucide !== "undefined") {
            lucide.createIcons();
          }
        }
      }
    },

    /* =====================================
   HANDLE SAVE ANGGOTA
===================================== */

    async handleSaveAnggota() {
      if (!this.state.selectedKK) {
        Toast.error("Kartu Keluarga belum dipilih.");
        return;
      }

      /* =====================================
   AMBIL VALUE FORM
===================================== */

      const getValue = (id) => {
        const element = document.getElementById(id);

        return element ? String(element.value || "").trim() : "";
      };

      /* =====================================
   DATA PENDUDUK
===================================== */

      const data = {
        ID_KK: this.state.selectedKK,

        NIK: getValue("formAnggotaNIK"),

        NAMA: getValue("formAnggotaNama"),

        TEMPAT_LAHIR: getValue("formAnggotaTempatLahir"),

        TANGGAL_LAHIR: getValue("formAnggotaTanggalLahir"),

        JENIS_KELAMIN: getValue("formAnggotaJenisKelamin"),

        AGAMA: getValue("formAnggotaAgama"),

        KEWARGANEGARAAN: getValue("formAnggotaKewarganegaraan") || "WNI",

        NO_PASPOR: getValue("formAnggotaPaspor"),

        NO_KITAS: getValue("formAnggotaKitas"),

        PENDIDIKAN: getValue("formAnggotaPendidikan"),

        PEKERJAAN: getValue("formAnggotaPekerjaan"),

        STATUS_PERKAWINAN: getValue("formAnggotaStatusPerkawinan"),

        HUBUNGAN_KELUARGA: getValue("formAnggotaHubungan"),

        NAMA_AYAH: getValue("formAnggotaNamaAyah"),

        NAMA_IBU: getValue("formAnggotaNamaIbu"),
      };

      console.log("[KartuKeluargaController] Data anggota:", data);

      /* ===============================
   VALIDASI DASAR
=============================== */

      if (!data.NIK) {
        Toast.error("NIK wajib diisi.");
        return;
      }

      if (!/^\d{16}$/.test(data.NIK)) {
        Toast.error("NIK harus terdiri dari 16 digit.");
        return;
      }

      if (!data.NAMA) {
        Toast.error("Nama lengkap wajib diisi.");
        return;
      }

      if (!data.TEMPAT_LAHIR) {
        Toast.error("Tempat lahir wajib diisi.");
        return;
      }

      if (!data.TANGGAL_LAHIR) {
        Toast.error("Tanggal lahir wajib diisi.");
        return;
      }

      if (!data.JENIS_KELAMIN) {
        Toast.error("Jenis kelamin wajib dipilih.");
        return;
      }

      if (!data.AGAMA) {
        Toast.error("Agama wajib dipilih.");
        return;
      }

      if (!data.STATUS_PERKAWINAN) {
        Toast.error("Status perkawinan wajib dipilih.");
        return;
      }

      if (!data.HUBUNGAN_KELUARGA) {
        Toast.error("Hubungan keluarga wajib diisi.");
        return;
      }

      /* ===============================
     BUTTON
  =============================== */

      const button = document.querySelector(
        '[data-modal-action="save-anggota"]',
      );

      const originalHTML = button?.innerHTML;

      if (button) {
        button.disabled = true;

        button.innerHTML = `
      <i data-lucide="loader-circle"></i>
      <span>Menyimpan...</span>
    `;

        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      }

      try {
        console.log("[KartuKeluargaController] Menyimpan anggota...");

        const saved = await KartuKeluargaService.savePenduduk(data);

        console.log(
          "[KartuKeluargaController] Anggota berhasil disimpan:",
          saved,
        );

        /* ===============================
       CLOSE MODAL
    =============================== */

        Modal.close();

        Toast.success("Anggota keluarga berhasil ditambahkan.");

        /* ===============================
       REFRESH DETAIL KK
    =============================== */

        await this.loadKKDetail(this.state.selectedKK);
      } catch (error) {
        console.error("[KartuKeluargaController] savePenduduk:", error);

        Toast.error(error.message || "Gagal menyimpan anggota keluarga.");
      } finally {
        if (button) {
          button.disabled = false;

          button.innerHTML = originalHTML;

          if (typeof lucide !== "undefined") {
            lucide.createIcons();
          }
        }
      }
    },

    /* =====================================
   UPDATE ANGGOTA
===================================== */

    async handleUpdateAnggota() {
      console.log("✏️ handleUpdateAnggota()");

      const getValue = (id) => {
        const element = document.getElementById(id);
        return element ? String(element.value || "").trim() : "";
      };

      /* =====================================
     AMBIL ID
  ===================================== */

      const idPenduduk = getValue("formEditAnggotaId");

      if (!idPenduduk) {
        Toast.error("ID penduduk tidak ditemukan.");
        return;
      }

      if (!this.state.selectedKK) {
        Toast.error("Kartu Keluarga tidak ditemukan.");
        return;
      }

      /* =====================================
     AMBIL DATA FORM
  ===================================== */

      const data = {
        ID_PENDUDUK: idPenduduk,

        ID_KK: this.state.selectedKK,

        NIK: getValue("formAnggotaNIK"),

        NAMA: getValue("formAnggotaNama"),

        TEMPAT_LAHIR: getValue("formAnggotaTempatLahir"),

        TANGGAL_LAHIR: getValue("formAnggotaTanggalLahir"),

        JENIS_KELAMIN: getValue("formAnggotaJenisKelamin"),

        AGAMA: getValue("formAnggotaAgama"),

        KEWARGANEGARAAN: getValue("formAnggotaKewarganegaraan") || "WNI",

        NO_PASPOR: getValue("formAnggotaPaspor"),

        NO_KITAS: getValue("formAnggotaKitas"),

        PENDIDIKAN: getValue("formAnggotaPendidikan"),

        PEKERJAAN: getValue("formAnggotaPekerjaan"),

        STATUS_PERKAWINAN: getValue("formAnggotaStatusPerkawinan"),

        HUBUNGAN_KELUARGA: getValue("formAnggotaHubungan"),

        NAMA_AYAH: getValue("formAnggotaNamaAyah"),

        NAMA_IBU: getValue("formAnggotaNamaIbu"),
      };

      console.log("📦 Data update anggota:", data);

      /* =====================================
        VALIDASI
      ===================================== */

      const validation = KartuKeluargaService.validatePenduduk(data);

      if (!validation.valid) {
        console.warn("⚠️ Validasi gagal:", validation.errors);

        const firstError = Object.values(validation.errors)[0];

        Toast.warning(firstError);

        return;
      }

      /* =====================================
     BUTTON LOADING
  ===================================== */

      const button = document.querySelector(
        '[data-modal-action="update-anggota"]',
      );

      const originalHTML = button?.innerHTML;

      if (button) {
        button.disabled = true;

        button.innerHTML = `
      <i data-lucide="loader-circle"></i>
      Menyimpan...
    `;

        if (window.lucide) {
          lucide.createIcons();
        }
      }

      /* =====================================
     SAVE
  ===================================== */

      try {
        const result = await KartuKeluargaService.updatePenduduk(data);

        console.log("✅ Penduduk berhasil diperbarui:", result);

        Modal.close();

        Toast.success("Data anggota berhasil diperbarui.");

        /* =====================================
       REFRESH DATA
    ===================================== */

        await this.loadKKDetail(this.state.selectedKK);
      } catch (error) {
        console.error("❌ Gagal memperbarui anggota:", error);

        Toast.error(error?.message || "Gagal memperbarui data anggota.");
      } finally {
        if (button) {
          button.disabled = false;

          if (originalHTML) {
            button.innerHTML = originalHTML;

            if (window.lucide) {
              lucide.createIcons();
            }
          }
        }
      }
    },

    /* =====================================
   HANDLE UPDATE KK
===================================== */

    async handleUpdateKK() {
      const data = this.getEditKKFormData();

      console.log("[KartuKeluargaController] Update KK:", data);

      /* ===============================
     VALIDASI
  =============================== */

      const validation = KartuKeluargaService.validateKK(data);

      if (!validation.valid) {
        const firstError = Object.values(validation.errors)[0];

        Toast.error(firstError || "Data Kartu Keluarga belum lengkap.");

        return;
      }

      /* ===============================
     BUTTON
  =============================== */

      const button = document.querySelector('[data-modal-action="update-kk"]');

      const originalHTML = button?.innerHTML;

      if (button) {
        button.disabled = true;

        button.innerHTML = `
      <i data-lucide="loader-circle"></i>
      <span>Menyimpan...</span>
    `;

        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      }

      try {
        /* ===============================
       UPDATE BACKEND
    =============================== */

        const updated = await KartuKeluargaService.updateKK(data);

        console.log(
          "[KartuKeluargaController] KK berhasil diperbarui:",
          updated,
        );

        /* ===============================
       CLOSE MODAL
    =============================== */

        Modal.close();

        Toast.success("Kartu Keluarga berhasil diperbarui.");

        /* ===============================
       REFRESH DATA
    =============================== */

        await this.loadData();

        /* ===============================
       SELECT KEMBALI KK
    =============================== */

        if (data.ID_KK) {
          await this.selectKK(data.ID_KK);
        }
      } catch (error) {
        console.error("[KartuKeluargaController] updateKK:", error);

        Toast.error(error.message || "Gagal memperbarui Kartu Keluarga.");
      } finally {
        if (button) {
          button.disabled = false;

          button.innerHTML = originalHTML;

          if (typeof lucide !== "undefined") {
            lucide.createIcons();
          }
        }
      }
    },

    /* =====================================
   UPDATE RT OPTIONS
===================================== */

    updateRTOptions(idLingkungan) {
      const select = document.getElementById("formRT");

      if (!select) {
        return;
      }

      const mapping = {
        L001: ["RT001", "RT002", "RT003"],

        L002: ["RT004", "RT005", "RT006", "RT007"],

        L003: ["RT008", "RT009", "RT010"],

        L004: ["RT011", "RT012", "RT013", "RT014", "RT015"],

        L005: ["RT016", "RT017", "RT018", "RT019", "RT020"],
      };

      const rts = mapping[idLingkungan] || [];

      select.innerHTML = `
    <option value="">
      Pilih RT
    </option>
  `;

      rts.forEach(function (rt) {
        const option = document.createElement("option");

        option.value = rt;

        option.textContent = rt;

        select.appendChild(option);
      });

      select.disabled = rts.length === 0;
    },

    /* =====================================
   UPDATE RT OPTIONS - EDIT
===================================== */

    updateEditRTOptions(idLingkungan, selectedRT = "") {
      const select = document.getElementById("editRT");

      if (!select) {
        return;
      }

      const rtMap = {
        L001: ["RT001", "RT002", "RT003"],

        L002: ["RT004", "RT005", "RT006", "RT007"],

        L003: ["RT008", "RT009", "RT010"],

        L004: ["RT011", "RT012", "RT013", "RT014", "RT015"],

        L005: ["RT016", "RT017", "RT018", "RT019", "RT020"],
      };

      const options = rtMap[idLingkungan] || [];

      select.innerHTML = `

    <option value="">
      Pilih RT
    </option>

    ${options
      .map(
        (rt) => `
      <option
        value="${rt}"
        ${String(rt) === String(selectedRT) ? "selected" : ""}
      >
        ${rt}
      </option>
    `,
      )
      .join("")}

  `;

      select.disabled = options.length === 0;
    },

    /* =====================================
   GET FORM EDIT KK
===================================== */

    getEditKKFormData() {
      return {
        ID_KK: this.state.selectedKK,

        NO_KK: document.getElementById("editNoKK")?.value.trim() || "",

        ALAMAT: document.getElementById("editAlamat")?.value.trim() || "",

        ID_LINGKUNGAN: document.getElementById("editLingkungan")?.value || "",

        ID_RT: document.getElementById("editRT")?.value || "",

        STATUS_KK: document.getElementById("editStatusKK")?.value || "AKTIF",

        DESIL_DTSEN: document.getElementById("editDesil")?.value || "",
      };
    },

    /* =====================================
       PAGINATION PREVIOUS
    ===================================== */

    previousPage() {
      if (this.state.currentPage <= 1) {
        return;
      }

      this.state.currentPage--;

      this.renderList();
    },

    /* =====================================
       PAGINATION NEXT
    ===================================== */

    nextPage() {
      const { search, lingkungan, status } = this.state.filters;

      let filtered = [...this.state.kk];

      // SEARCH
      if (search) {
        const keyword = search.toLowerCase();

        filtered = filtered.filter((item) => {
          return (
            String(item.NO_KK || "")
              .toLowerCase()
              .includes(keyword) ||
            String(item.KEPALA_KELUARGA || "")
              .toLowerCase()
              .includes(keyword) ||
            String(item.ALAMAT || "")
              .toLowerCase()
              .includes(keyword)
          );
        });
      }

      // FILTER LINGKUNGAN
      if (lingkungan) {
        filtered = filtered.filter((item) => item.ID_LINGKUNGAN === lingkungan);
      }

      // FILTER STATUS
      if (status) {
        filtered = filtered.filter((item) => item.STATUS_KK === status);
      }

      const totalPages = Math.ceil(filtered.length / this.state.perPage);

      if (this.state.currentPage < totalPages) {
        this.state.currentPage++;

        this.renderList();
      }
    },

    /* =====================================
       CHANGE VIEW
    ===================================== */

    changeView(view) {
      if (view !== "list" && view !== "grid") {
        return;
      }

      this.state.viewMode = view;

      KartuKeluargaView.setView(view);
    },

    /* =====================================
       MAIN TAB
    ===================================== */

    changeMainTab(tab) {
      if (tab !== "kk" && tab !== "penduduk") {
        return;
      }

      this.state.activeMainTab = tab;

      KartuKeluargaView.setMainTab(tab);

      /*
       * Untuk sementara tab
       * Pencarian Penduduk masih
       * menggunakan placeholder View.
       */

      if (tab === "penduduk") {
        KartuKeluargaView.showComingSoon();

        return;
      }

      this.renderList();
    },

    /* =====================================
       DETAIL TAB
    ===================================== */

    changeDetailTab(tab) {
      if (tab !== "anggota" && tab !== "riwayat") {
        return;
      }

      this.state.activeDetailTab = tab;

      KartuKeluargaView.setDetailTab(tab);
    },

    /* =====================================
       TAMBAH KK
    ===================================== */

    openTambahKK() {
      KartuKeluargaView.openTambahKK();
    },

    /* =====================================
       SIMPAN KK
    ===================================== */

    /* =====================================
   GET FORM TAMBAH KK
===================================== */

    getTambahKKFormData() {
      return {
        NO_KK: document.getElementById("formNoKK")?.value.trim() || "",

        ALAMAT: document.getElementById("formAlamat")?.value.trim() || "",

        ID_LINGKUNGAN: document.getElementById("formLingkungan")?.value || "",

        ID_RT: document.getElementById("formRT")?.value || "",

        DESIL_DTSEN: document.getElementById("formDesil")?.value || "",
      };
    },

    /* =====================================
       EDIT KK
    ===================================== */

    /* =====================================
   EDIT KK
===================================== */

    async editKK() {
      console.log("[KartuKeluargaController] editKK()");

      if (!this.state.selectedKK) {
        Toast.warning("Pilih Kartu Keluarga terlebih dahulu.");

        return;
      }

      try {
        /* ===============================
       AMBIL DATA TERBARU
    =============================== */

        const kk = await KartuKeluargaService.getKKById(this.state.selectedKK);

        if (!kk) {
          Toast.error("Data Kartu Keluarga tidak ditemukan.");

          return;
        }

        console.log("[KartuKeluargaController] Data KK untuk edit:", kk);

        /* ===============================
       BUKA MODAL
    =============================== */

        KartuKeluargaView.openEditKK(kk);

        /* ===============================
       SET RT SESUAI LINGKUNGAN
    =============================== */

        setTimeout(() => {
          this.updateEditRTOptions(kk.ID_LINGKUNGAN, kk.ID_RT);
        }, 0);
      } catch (error) {
        console.error("[KartuKeluargaController] editKK:", error);

        Toast.error(error.message || "Gagal membuka data Kartu Keluarga.");
      }
    },

    /* =====================================
   TAMBAH ANGGOTA
===================================== */

    tambahAnggota() {
      console.log("[KartuKeluargaController] tambahAnggota()");

      if (!this.state.selectedKK) {
        Toast.warning("Pilih Kartu Keluarga terlebih dahulu.");
        return;
      }

      const idKK = this.state.selectedKK;

      const kk = this.state.kk.find(
        (item) => String(item.ID_KK) === String(idKK),
      );

      if (!kk) {
        Toast.error("Data Kartu Keluarga tidak ditemukan.");
        return;
      }

      console.log("Data KK untuk tambah anggota:", kk);

      KartuKeluargaView.openTambahAnggota(kk);
    },

    async editAnggota(idPenduduk) {
      console.log("✏️ Edit Anggota:", idPenduduk);

      if (!idPenduduk) {
        Toast.warning("ID penduduk tidak ditemukan.");
        return;
      }

      try {
        const anggota = await KartuKeluargaService.getPendudukById(idPenduduk);

        if (!anggota) {
          Toast.error("Data penduduk tidak ditemukan.");
          return;
        }

        console.log("📋 Data penduduk:", anggota);

        KartuKeluargaView.openEditAnggota(anggota);
      } catch (error) {
        console.error("❌ Gagal mengambil data penduduk:", error);
        Toast.error(error?.message || "Gagal mengambil data penduduk.");
      }
    },

    /* =====================================
       REFRESH
    ===================================== */

    refresh() {
      this.loadData();
    },

    /* =====================================
       EVENT BINDING
    ===================================== */

    /* =====================================
   EVENT BINDING
===================================== */

    bindEvents() {
      /*
       * Hindari bind dua kali.
       */
      if (this._eventsBound) {
        return;
      }

      this._eventsBound = true;

      /* ===================================
        CLICK
      =================================== */

      document.addEventListener("click", (event) => {
        /* ==============================
          DATA ACTION
        ============================== */

        const actionElement = event.target.closest("[data-action]");
        const action = actionElement?.dataset.action;

        if (action) {
          switch (action) {
            case "tambah-kk":
              this.openTambahKK();
              return;

            case "reset-filter":
              this.resetFilter();
              return;

            case "edit-kk":
              this.editKK();
              return;

            case "tambah-anggota":
              console.log("CLICK TAMBAH ANGGOTA");
              this.tambahAnggota();
              return;

            case "edit-anggota":
              this.editAnggota(actionElement.dataset.pendudukId);
              return;
          }
        }

        /* =====================================
   MODAL ACTION
===================================== */

        const modalAction = event.target.closest("[data-modal-action]");

        if (modalAction) {
          const modalActionType = modalAction.dataset.modalAction;

          /* ===============================
          CANCEL
        =============================== */

          if (modalActionType === "cancel") {
            Modal.close();

            return;
          }

          /* ===============================
            SAVE KK
          =============================== */

          if (modalActionType === "save-kk") {
            this.handleSaveKK();

            return;
          }

          /* ===============================
            UPDATE KK
          =============================== */

          if (modalActionType === "update-kk") {
            this.handleUpdateKK();

            return;
          }

          /* ===============================
          SAVE ANGGOTA
        ================================ */

          if (modalActionType === "save-anggota") {
            this.handleSaveAnggota();

            return;
          }

          /* ===============================
            UPDATE ANGGOTA
          =============================== */

          if (modalActionType === "update-anggota") {
            this.handleUpdateAnggota();

            return;
          }
        }

        /* ==============================
          KK ITEM
        ============================== */

        const kkItem = event.target.closest("[data-kk-id]");

        if (kkItem) {
          this.selectKK(kkItem.dataset.kkId);
          return;
        }

        /* ==============================
          PAGINATION NUMBER
        ============================== */

        const pageButton = event.target.closest("[data-page-number]");

        if (pageButton) {
          console.log("PAGINATION CLICK:", pageButton.dataset.pageNumber);
          this.goToPage(pageButton.dataset.pageNumber);
          return;
        }

        /* ==============================
          PAGINATION ACTION
        ============================== */

        const pageAction = event.target.closest("[data-page-action]");

        if (pageAction) {
          const pageActionType = pageAction.dataset.pageAction;

          if (pageActionType === "prev") {
            this.previousPage();
            return;
          }

          if (pageActionType === "next") {
            this.nextPage();
            return;
          }
        }

        /* ==============================
          VIEW SWITCHER
        ============================== */

        const viewButton = event.target.closest("[data-view]");

        if (viewButton) {
          this.changeView(viewButton.dataset.view);
          return;
        }

        /* ==============================
          MAIN TAB
        ============================== */

        const mainTab = event.target.closest("[data-tab]");

        if (mainTab) {
          this.changeMainTab(mainTab.dataset.tab);
          return;
        }

        /* ==============================
          DETAIL TAB
        ============================== */

        const detailTab = event.target.closest("[data-detail-tab]");

        if (detailTab) {
          this.changeDetailTab(detailTab.dataset.detailTab);
          return;
        }
      });

      /* ===================================
        INPUT
      =================================== */

      document.addEventListener("input", (event) => {
        if (event.target.id === "kkSearch") {
          this.searchKK(event.target.value);
        }
      });

      /* ===================================
        CHANGE
      =================================== */

      document.addEventListener("change", (event) => {
        /* ===============================
          FORM TAMBAH KK
        =============================== */

        if (event.target.id === "formLingkungan") {
          this.updateRTOptions(event.target.value);
          return;
        }

        /* ===============================
            FORM EDIT KK
          =============================== */

        if (event.target.id === "editLingkungan") {
          this.updateEditRTOptions(event.target.value);

          return;
        }

        /* ===============================
          FILTER KK
        =============================== */

        switch (event.target.id) {
          case "kkFilterLingkungan":
            this.filterLingkungan(event.target.value);
            break;

          case "kkFilterStatus":
            this.filterStatus(event.target.value);
            break;

          case "kkSort":
            this.sortKK(event.target.value);
            break;

          case "kkPerPage":
            this.changePerPage(event.target.value);
            break;
        }
      });
    },
  };

  /* =====================================
     GLOBAL
  ===================================== */

  window.KartuKeluargaController = KartuKeluargaController;
})();
