/* =========================================
   MUTASI PENDUDUK CONTROLLER
========================================= */

const MutasiPendudukController = {
  /* =====================================
     STATE
  ===================================== */

  state: {
    mutasi: [],

    penduduk: [],

    pendudukSearchResults: [],

    kk: [],

    filtered: [],

    currentPage: 1,

    perPage: 10,

    filters: {
      search: "",
      jenis: "",
      tanggal: "",
      lingkungan: "",
    },

    loading: false,
  },

  /* =====================================
     INIT
  ===================================== */

  async init() {
    console.log("[MutasiPendudukController] init");

    Skeleton.mutasi("#mutasiSkeleton");

    this.bindEvents();

    await this.loadData();
  },

  /* =====================================
     LOAD DATA
  ===================================== */

  async loadData() {
    this.setLoading(true);

    try {
      console.log("[MutasiPendudukController] Mengambil data mutasi...");

      const [mutasi, penduduk, kk] = await Promise.all([
        MutasiPendudukService.getMutasi(),
        MutasiPendudukService.getPenduduk(),
        MutasiPendudukService.getKK(),
      ]);

      this.state.mutasi = Array.isArray(mutasi) ? mutasi : [];

      this.state.penduduk = Array.isArray(penduduk) ? penduduk : [];

      this.state.kk = Array.isArray(kk) ? kk : [];

      console.log("[MutasiPendudukController] Data mutasi:", this.state.mutasi);

      console.log(
        "[MutasiPendudukController] Data penduduk:",
        this.state.penduduk,
      );

      this.applyFilter();
    } catch (error) {
      console.error("[MutasiPendudukController] loadData:", error);

      Toast.error(error?.message || "Gagal mengambil data mutasi.");
    } finally {
      this.setLoading(false);
    }
  },

  /* =====================================
     FILTER
  ===================================== */

  applyFilter() {
    const { search, jenis, tanggal, lingkungan } = this.state.filters;

    const keyword = String(search || "")
      .trim()
      .toLowerCase();

    let result = [...this.state.mutasi];

    /* -------------------------------------
 SEARCH
------------------------------------- */

    if (keyword) {
      result = result.filter((item) => {
        /* ================================
       CARI DATA PENDUDUK
    ================================= */

        const penduduk = this.state.penduduk.find(
          (p) =>
            String(p.ID_PENDUDUK || "").trim() ===
            String(item.ID_PENDUDUK || "").trim(),
        );

        const namaPenduduk = String(penduduk?.NAMA || "").toLowerCase();

        /* ================================
       DATA YANG DAPAT DICARI
    ================================= */

        const values = [
          item.ID_MUTASI,
          item.ID_PENDUDUK,
          item.ID_KK,
          item.NIK,
          item.JENIS_MUTASI,
          item.KETERANGAN,
          namaPenduduk,
        ];

        /* ================================
       MATCH
    ================================= */

        return values.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(keyword),
        );
      });
    }

    /* -------------------------------------
     JENIS MUTASI
  ------------------------------------- */

    if (jenis) {
      result = result.filter(
        (item) =>
          String(item.JENIS_MUTASI || "").toUpperCase() ===
          String(jenis).toUpperCase(),
      );
    }

    /* -------------------------------------
     TANGGAL
  ------------------------------------- */

    if (tanggal) {
      result = result.filter((item) => {
        return this.normalizeDate(item.TANGGAL_MUTASI) === tanggal;
      });
    }

    /* -------------------------------------
        LINGKUNGAN
      ------------------------------------- */

    if (lingkungan) {
      result = result.filter((item) => {
        const idKK = String(item.ID_KK || "").trim();

        const kk = this.state.kk.find(
          (k) => String(k.ID_KK || "").trim() === idKK,
        );

        const idLingkungan = String(kk?.ID_LINGKUNGAN || "")
          .trim()
          .toUpperCase();

        return idLingkungan === String(lingkungan).trim().toUpperCase();
      });
    }

    /* -------------------------------------
     SAVE FILTERED DATA
  ------------------------------------- */

    this.state.filtered = result;

    /* -------------------------------------
     RESET PAGE IF NEEDED
  ------------------------------------- */

    const totalPages = Math.max(
      1,
      Math.ceil(result.length / this.state.perPage),
    );

    if (this.state.currentPage > totalPages) {
      this.state.currentPage = totalPages;
    }

    this.render();
  },

  /* =====================================
     RENDER
  ===================================== */

  render() {
    /*
     * Controller tidak lagi
     * menggambar HTML.
     *
     * Semua urusan tampilan
     * diserahkan ke View.
     */

    if (typeof MutasiPendudukView === "undefined") {
      console.error(
        "[MutasiPendudukController] MutasiPendudukView tidak ditemukan.",
      );

      return;
    }

    MutasiPendudukView.render({
      mutasi: this.state.mutasi,

      filtered: this.state.filtered,

      penduduk: this.state.penduduk,

      kk: this.state.kk,

      currentPage: this.state.currentPage,

      perPage: this.state.perPage,

      filters: this.state.filters,

      loading: this.state.loading,
    });
  },

  /* =====================================
     PAGINATION
  ===================================== */

  goToPage(page) {
    const totalPages = Math.max(
      1,
      Math.ceil(this.state.filtered.length / this.state.perPage),
    );

    const target = Number(page);

    if (target < 1 || target > totalPages) {
      return;
    }

    this.state.currentPage = target;

    this.render();
  },

  /* =====================================
     NEXT PAGE
  ===================================== */

  nextPage() {
    this.goToPage(this.state.currentPage + 1);
  },

  /* =====================================
     PREVIOUS PAGE
  ===================================== */

  prevPage() {
    this.goToPage(this.state.currentPage - 1);
  },

  /* =====================================
     SEARCH
  ===================================== */

  handleSearch(value) {
    this.state.filters.search = String(value || "");

    this.state.currentPage = 1;

    this.applyFilter();
  },

  /* =====================================
     FILTER JENIS
  ===================================== */

  /* =====================================
   FILTER JENIS MUTASI
===================================== */

  handleJenisFilter(value) {
    const jenis = String(value || "").trim();

    console.log("[MutasiPendudukController] Filter jenis mutasi:", jenis);

    /* ---------------------------------
     SIMPAN FILTER
  --------------------------------- */

    this.state.filters = this.state.filters || {};

    this.state.filters.jenis = jenis;

    /* ---------------------------------
     RESET HALAMAN
  --------------------------------- */

    this.state.currentPage = 1;

    /* ---------------------------------
     JALANKAN FILTER
  --------------------------------- */

    this.applyFilter();
  },

  /* =====================================
     FILTER TANGGAL
  ===================================== */

  handleTanggalFilter(value) {
    this.state.filters.tanggal = String(value || "");

    this.state.currentPage = 1;

    this.applyFilter();
  },

  /* =====================================
     FILTER LINGKUNGAN
  ===================================== */

  handleLingkunganFilter(value) {
    const lingkungan = String(value || "").trim();

    console.log("[MutasiPendudukController] Filter lingkungan:", lingkungan);

    /* ---------------------------------
     SIMPAN FILTER
  --------------------------------- */

    this.state.filters = this.state.filters || {};

    this.state.filters.lingkungan = lingkungan;

    /* ---------------------------------
     RESET HALAMAN
  --------------------------------- */

    this.state.currentPage = 1;

    /* ---------------------------------
     JALANKAN FILTER
  --------------------------------- */

    this.applyFilter();
  },

  /* =====================================
     RESET FILTER
  ===================================== */

  resetFilter() {
    this.state.filters = {
      search: "",
      jenis: "",
      tanggal: "",
    };

    this.state.currentPage = 1;

    /* ---------------------------------
       SEARCH
    --------------------------------- */

    const search = document.querySelector(".mutasi-page .filter-search input");

    if (search) {
      search.value = "";
    }

    /* ---------------------------------
       FILTER FIELD
    --------------------------------- */

    const fields = document.querySelectorAll(".mutasi-page .filter-field");

    fields.forEach((field) => {
      const input = field.querySelector("input, select");

      if (!input) {
        return;
      }

      if (input.tagName === "SELECT") {
        input.selectedIndex = 0;
      } else {
        input.value = "";
      }
    });

    this.applyFilter();
  },

  /* =====================================
     EVENT BINDING
  ===================================== */

  bindEvents() {
    /*
     * Hindari binding dua kali.
     */

    if (this._eventsBound) {
      return;
    }

    this._eventsBound = true;

    /* =====================================
     CLICK
  ===================================== */

    document.addEventListener("click", (event) => {
      /* ---------------------------------
       DATA ACTION
    --------------------------------- */

      const actionElement = event.target.closest("[data-action]");

      if (actionElement) {
        const action = actionElement.dataset.action;

        switch (action) {
          /* ==============================
           TAMBAH MUTASI
        ============================== */

          case "tambah-mutasi":
            this.tambahMutasi();
            break;

          /* ==============================
           VIEW MUTASI
        ============================== */

          case "view-mutasi":
            this.viewMutasi(actionElement.dataset.mutasiId);
            break;

          /* ==============================
           EDIT MUTASI
        ============================== */

          case "edit-mutasi":
            console.log(
              "[MutasiPendudukController] Klik edit:",
              actionElement.dataset.mutasiId,
            );

            this.editMutasi(actionElement.dataset.mutasiId);
            break;

          /* ==============================
           DELETE MUTASI
        ============================== */

          case "delete-mutasi":
            this.deleteMutasi(actionElement.dataset.mutasiId);
            break;
        }
      }

      /* ---------------------------------
       PAGINATION
    --------------------------------- */

      const pagination = event.target.closest("[data-pagination]");

      if (pagination) {
        const value = pagination.dataset.pagination;

        if (value === "next") {
          this.nextPage();
        } else if (value === "prev") {
          this.prevPage();
        } else {
          this.goToPage(Number(value));
        }
      }
    });

    /* =====================================
     CLOSE MODAL MUTASI
  ===================================== */

    document.addEventListener("click", (event) => {
      /* ---------------------------------
       TOMBOL X
    --------------------------------- */

      const closeButton = event.target.closest(
        "#modalTambahMutasi .modal-close",
      );

      if (closeButton) {
        this.closeMutasiModal();
        return;
      }

      /* ---------------------------------
       TOMBOL BATAL
    --------------------------------- */

      const cancelButton = event.target.closest(
        '#modalTambahMutasi [data-modal-action="cancel"]',
      );

      if (cancelButton) {
        this.closeMutasiModal();
        return;
      }
    });

    /* =====================================
     SEARCH FILTER
  ===================================== */

    /*
     * Event delegation.
     *
     * Jangan pasang listener langsung
     * ke .mutasi-page karena View dapat
     * merender ulang halaman.
     */

    document.addEventListener("input", (event) => {
      const input = event.target;

      if (!input) {
        return;
      }

      if (!input.matches(".mutasi-page .filter-search input")) {
        return;
      }

      this.handleSearch(input.value);
    });

    /* =====================================
     FILTER
  ===================================== */

    /*
     * Gunakan document delegation.
     *
     * Dengan begitu filter tetap bekerja
     * walaupun .mutasi-page dirender ulang.
     */

    document.addEventListener("change", (event) => {
      const input = event.target;

      if (!input) {
        return;
      }

      /* ================================
       FILTER HALAMAN MUTASI
    ================================= */

      const isMutasiPage = input.closest(".mutasi-page") !== null;

      if (isMutasiPage) {
        /* ================================
         SELECT
      ================================= */

        if (input.tagName === "SELECT") {
          const field = input.closest(
            ".filter-field, .filter-group, .filter-item",
          );

          const label =
            field?.querySelector("label")?.textContent?.trim()?.toLowerCase() ||
            "";

          console.log("[MutasiPendudukController] Filter change:", {
            id: input.id,
            label,
            value: input.value,
            selectedText: input.options?.[input.selectedIndex]?.text,
            options: Array.from(input.options || []).map((option) => ({
              value: option.value,
              text: option.textContent.trim(),
            })),
          });

          /* =================================
           FILTER JENIS MUTASI
        ================================= */

          if (
            input.id === "filterJenisMutasi" ||
            label.includes("jenis mutasi")
          ) {
            const jenis = String(input.value || "").trim();

            console.log("[MutasiPendudukController] Jenis mutasi:", jenis);

            /*
             * Simpan ke STATE yang memang
             * dibaca oleh applyFilter().
             */

            this.state.filters.jenis = jenis;

            /*
             * Kembali ke halaman pertama.
             */

            this.state.currentPage = 1;

            /*
             * Jalankan filter.
             */

            this.applyFilter();

            return;
          }

          /* =================================
           FILTER LINGKUNGAN
          ================================= */

          if (input.id === "filterLingkungan" || label.includes("lingkungan")) {
            const lingkungan = String(input.value || "").trim();

            console.log("[MutasiPendudukController] Lingkungan:", lingkungan);

            this.state.filters.lingkungan = lingkungan;

            this.state.currentPage = 1;

            this.applyFilter();

            return;
          }
        }

        /* ================================
         FILTER TANGGAL
      ================================= */

        if (input.tagName === "INPUT" && input.type === "date") {
          this.handleTanggalFilter(input.value);

          return;
        }
      }

      /* =====================================
       FORM TAMBAH / EDIT MUTASI
    ===================================== */

      if (input.id === "formMutasiPenduduk") {
        const idPenduduk = String(input.value || "").trim();

        console.log("[MutasiPendudukController] Penduduk dipilih:", idPenduduk);

        const penduduk = this.state.penduduk.find(
          (item) => String(item.ID_PENDUDUK || "").trim() === idPenduduk,
        );

        console.log(
          "[MutasiPendudukController] Data penduduk terpilih:",
          penduduk,
        );

        if (typeof MutasiPendudukView !== "undefined") {
          MutasiPendudukView.renderPendudukPreview(penduduk || null);
        }
      }
    });

    /* =====================================
     PENCARIAN PENDUDUK
  ===================================== */

    document.addEventListener("click", (event) => {
      const button = event.target.closest("#btnCariPenduduk");

      if (!button) {
        return;
      }

      this.cariPenduduk();
    });

    /* =====================================
     ENTER → CARI PENDUDUK
  ===================================== */

    document.addEventListener("keydown", (event) => {
      const input = event.target;

      if (!input || input.id !== "searchPenduduk") {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();

        this.cariPenduduk();
      }
    });

    /* =====================================
     PILIH HASIL PENDUDUK
  ===================================== */

    document.addEventListener("click", (event) => {
      const button = event.target.closest(
        '[data-action="pilih-penduduk-mutasi"]',
      );

      if (!button) {
        return;
      }

      const idPenduduk = String(button.dataset.pendudukId || "").trim();

      this.pilihPenduduk(idPenduduk);
    });

    /* =====================================
     SAVE / UPDATE MUTASI
  ===================================== */

    document.addEventListener("click", (event) => {
      const button = event.target.closest('[data-modal-action="save-mutasi"]');

      if (!button) {
        return;
      }

      /* ---------------------------------
       CEK MODAL
    --------------------------------- */

      const modal = document.getElementById("modalTambahMutasi");

      if (!modal) {
        return;
      }

      /* ---------------------------------
       MODE
    --------------------------------- */

      const mode = String(modal.dataset.mode || "add").trim();

      console.log("[MutasiPendudukController] Save mutasi mode:", mode);

      /* ---------------------------------
       TAMBAH
    --------------------------------- */

      if (mode === "add") {
        this.simpanMutasi();
        return;
      }

      /* ---------------------------------
       EDIT
    --------------------------------- */

      if (mode === "edit") {
        this.updateMutasi();
        return;
      }
    });

    /* =====================================
     RESET
  ===================================== */

    document.addEventListener("click", (event) => {
      const resetButton = event.target.closest(".mutasi-page .btn-secondary");

      if (!resetButton) {
        return;
      }

      this.resetFilter();
    });

    document.addEventListener("click", (event) => {
      const closeButton = event.target.closest(
        "#modalDetailMutasi .modal-close",
      );

      const cancelButton = event.target.closest(
        '#modalDetailMutasi [data-modal-action="close-detail-mutasi"]',
      );

      if (!closeButton && !cancelButton) {
        return;
      }

      const modal = document.getElementById("modalDetailMutasi");

      if (modal) {
        modal.hidden = true;
      }
    });
  },

  /* =====================================
   CARI PENDUDUK
===================================== */

  cariPenduduk() {
    const input = document.getElementById("searchPenduduk");
    const container = document.getElementById("hasilPencarianPenduduk");

    if (!input || !container) {
      return;
    }

    const keyword = String(input.value || "")
      .trim()
      .toLowerCase();

    console.log("[MutasiPendudukController] Cari penduduk:", keyword);

    /* ---------------------------------
     KEYWORD KOSONG
  --------------------------------- */

    if (!keyword) {
      container.hidden = true;
      container.innerHTML = "";

      return;
    }

    /* ---------------------------------
     FILTER DATA PENDUDUK
  --------------------------------- */

    const results = this.state.penduduk.filter((item) => {
      const nama = String(item.NAMA || "").toLowerCase();

      const nik = String(item.NIK || "").toLowerCase();

      return nama.includes(keyword) || nik.includes(keyword);
    });

    console.log("[MutasiPendudukController] Hasil pencarian:", results);

    /* ---------------------------------
     SIMPAN HASIL PENCARIAN
  --------------------------------- */

    this.state.pendudukSearchResults = results;

    /* ---------------------------------
     RENDER HASIL
  --------------------------------- */

    if (
      typeof MutasiPendudukView !== "undefined" &&
      typeof MutasiPendudukView.renderPendudukSearchResults === "function"
    ) {
      MutasiPendudukView.renderPendudukSearchResults(results);
    }
  },

  /* =====================================
   PILIH PENDUDUK
===================================== */

  pilihPenduduk(idPenduduk) {
    if (!idPenduduk) {
      return;
    }

    const penduduk = this.state.penduduk.find(
      (item) => String(item.ID_PENDUDUK || "").trim() === idPenduduk,
    );

    if (!penduduk) {
      Toast.error("Data penduduk tidak ditemukan.");

      return;
    }

    console.log("[MutasiPendudukController] Penduduk dipilih:", penduduk);

    /* ---------------------------------
     SIMPAN PENDUDUK TERPILIH
  --------------------------------- */

    this.state.selectedPenduduk = penduduk;

    /* ---------------------------------
     TAMPILKAN PREVIEW
  --------------------------------- */

    if (typeof MutasiPendudukView !== "undefined") {
      MutasiPendudukView.renderPendudukPreview(penduduk);
    }

    /* ---------------------------------
     SEMBUNYIKAN HASIL PENCARIAN
  --------------------------------- */

    const hasil = document.getElementById("hasilPencarianPenduduk");

    if (hasil) {
      hasil.hidden = true;
    }

    /* ---------------------------------
     UPDATE INPUT
  --------------------------------- */

    const input = document.getElementById("searchPenduduk");

    if (input) {
      input.value = penduduk.NAMA || "";
    }
  },

  /* =====================================
     TAMBAH MUTASI
  ===================================== */

  tambahMutasi() {
    console.log("[MutasiPendudukController] tambahMutasi()");

    const modal = document.getElementById("modalTambahMutasi");

    if (!modal) {
      Toast.error("Modal Tambah Mutasi tidak ditemukan.");

      return;
    }

    /* ---------------------------------
     RESET STATE PENDUDUK
  --------------------------------- */

    this.state.selectedPenduduk = null;

    this.state.pendudukSearchResults = [];

    /* ---------------------------------
     RESET SEARCH INPUT
  --------------------------------- */

    const searchInput = document.getElementById("searchPenduduk");

    if (searchInput) {
      searchInput.value = "";
    }

    /* ---------------------------------
     RESET HASIL PENCARIAN
  --------------------------------- */

    const hasil = document.getElementById("hasilPencarianPenduduk");

    if (hasil) {
      hasil.innerHTML = "";
      hasil.hidden = true;
    }

    /* ---------------------------------
     RESET PREVIEW
  --------------------------------- */

    if (typeof MutasiPendudukView !== "undefined") {
      MutasiPendudukView.renderPendudukPreview(null);
    }

    /* ---------------------------------
     BUKA MODAL
  --------------------------------- */

    modal.hidden = false;

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    const searchPenduduk = document.getElementById("mutasiPendudukSearch");

    if (searchPenduduk) {
      searchPenduduk.hidden = false;
    }
  },

  /* =========================================
   EDIT MUTASI
========================================= */

  /* =========================================
   CLOSE MODAL MUTASI
========================================= */

  closeMutasiModal() {
    const modal = document.getElementById("modalTambahMutasi");

    if (!modal) {
      return;
    }

    /* ---------------------------------
     HIDE MODAL
  --------------------------------- */

    modal.hidden = true;

    /* ---------------------------------
     RESET MODE
  --------------------------------- */

    modal.dataset.mode = "";
    modal.dataset.mutasiId = "";
    modal.dataset.pendudukId = "";

    /* ---------------------------------
     RESET JUDUL
  --------------------------------- */

    const title = modal.querySelector(".modal-header h2");

    const subtitle = modal.querySelector(".modal-header p");

    if (title) {
      title.textContent = "Tambah Mutasi Penduduk";
    }

    if (subtitle) {
      subtitle.textContent = "Catat riwayat mutasi penduduk.";
    }

    /* ---------------------------------
     RESET BUTTON
  --------------------------------- */

    const saveButton = modal.querySelector('[data-modal-action="save-mutasi"]');

    if (saveButton) {
      saveButton.innerHTML = `
      <i data-lucide="save"></i>
      Simpan Mutasi
    `;
    }

    /* ---------------------------------
     TAMPILKAN KEMBALI SEARCH
     MODE TAMBAH
  --------------------------------- */

    const searchWrapper = modal.querySelector(".search-penduduk");

    if (searchWrapper) {
      searchWrapper.hidden = false;
    }

    /* ---------------------------------
     RESET SEARCH INPUT
  --------------------------------- */

    const searchInput = document.getElementById("searchPenduduk");

    if (searchInput) {
      searchInput.value = "";
    }

    /* ---------------------------------
     RESET HASIL PENCARIAN
  --------------------------------- */

    const hasilPencarian = document.getElementById("hasilPencarianPenduduk");

    if (hasilPencarian) {
      hasilPencarian.innerHTML = "";

      hasilPencarian.hidden = true;
    }

    /* ---------------------------------
     RESET PREVIEW PENDUDUK
  --------------------------------- */

    if (typeof MutasiPendudukView !== "undefined") {
      MutasiPendudukView.renderPendudukPreview(null);
    }

    /* ---------------------------------
     LUCIDE
  --------------------------------- */

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  },

  /* =====================================
   SIMPAN MUTASI
===================================== */

  async simpanMutasi() {
    console.log("[MutasiPendudukController] simpanMutasi()");

    /* ---------------------------------
     SELECTED PENDUDUK
  --------------------------------- */

    const selectedPenduduk = this.state.selectedPenduduk;

    if (!selectedPenduduk?.ID_PENDUDUK) {
      Toast.warning("Penduduk wajib dipilih.");

      return;
    }

    /* ---------------------------------
     AMBIL FORM
  --------------------------------- */

    const jenisElement = document.getElementById("formMutasiJenis");

    const tanggalElement = document.getElementById("formMutasiTanggal");

    const keteranganElement = document.getElementById("formMutasiKeterangan");

    const jenisMutasi = String(jenisElement?.value || "").trim();

    const tanggalMutasi = String(tanggalElement?.value || "").trim();

    const keterangan = String(keteranganElement?.value || "").trim();

    /* ---------------------------------
     DATA
  --------------------------------- */

    const user = typeof Auth !== "undefined" ? Auth.getUser() : null;

    const createdBy = String(
      user?.username || user?.USERNAME || user?.nama || user?.NAMA || "",
    ).trim();

    const data = {
      ID_PENDUDUK: selectedPenduduk.ID_PENDUDUK,

      JENIS_MUTASI: jenisMutasi,

      TANGGAL_MUTASI: tanggalMutasi,

      KETERANGAN: keterangan,

      CREATED_BY: createdBy,
    };

    console.log("[MutasiPendudukController] Data mutasi yang disimpan:", data);

    /* ---------------------------------
     VALIDASI CLIENT
  --------------------------------- */

    const validation = MutasiPendudukService.validateMutasi(data);

    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];

      Toast.warning(firstError || "Data mutasi belum lengkap.");

      return;
    }

    /* ---------------------------------
     LOADING
  --------------------------------- */

    const button = document.querySelector('[data-modal-action="save-mutasi"]');

    const originalHTML = button?.innerHTML || "";

    if (button) {
      button.disabled = true;

      button.innerHTML = `
      <i data-lucide="loader-circle"></i>
      Menyimpan...
    `;

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }

    try {
      /* ---------------------------------
       SAVE
    --------------------------------- */

      const result = await MutasiPendudukService.saveMutasi(data);

      console.log(
        "[MutasiPendudukController] Mutasi berhasil disimpan:",
        result,
      );

      /* ---------------------------------
       TUTUP MODAL
    --------------------------------- */

      const modal = document.getElementById("modalTambahMutasi");

      if (modal) {
        modal.hidden = true;
      }

      /* ---------------------------------
       TOAST
    --------------------------------- */

      Toast.success("Data mutasi berhasil disimpan.");

      /* ---------------------------------
       RESET STATE
    --------------------------------- */

      this.state.selectedPenduduk = null;

      this.state.pendudukSearchResults = [];

      /* ---------------------------------
       RELOAD DATA
    --------------------------------- */

      await this.loadData();
    } catch (error) {
      console.error("[MutasiPendudukController] simpanMutasi:", error);

      Toast.error(error?.message || "Gagal menyimpan data mutasi.");
    } finally {
      /* ---------------------------------
       RESTORE BUTTON
    --------------------------------- */

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
   UPDATE MUTASI
===================================== */

  async updateMutasi() {
    console.log("[MutasiPendudukController] updateMutasi()");

    /* ---------------------------------
     MODAL
  --------------------------------- */

    const modal = document.getElementById("modalTambahMutasi");

    if (!modal) {
      Toast.error("Modal Mutasi tidak ditemukan.");

      return;
    }

    /* ---------------------------------
     ID MUTASI
  --------------------------------- */

    const idMutasi = String(modal.dataset.mutasiId || "").trim();

    if (!idMutasi) {
      Toast.warning("ID mutasi tidak ditemukan.");

      return;
    }

    /* ---------------------------------
     SELECTED PENDUDUK
  --------------------------------- */

    const idPenduduk = String(modal.dataset.pendudukId || "").trim();

    if (!idPenduduk) {
      Toast.warning("Penduduk tidak ditemukan.");

      return;
    }

    /* ---------------------------------
     FORM
  --------------------------------- */

    const jenisElement = document.getElementById("formMutasiJenis");

    const tanggalElement = document.getElementById("formMutasiTanggal");

    const keteranganElement = document.getElementById("formMutasiKeterangan");

    const jenisMutasi = String(jenisElement?.value || "").trim();

    const tanggalMutasi = String(tanggalElement?.value || "").trim();

    const keterangan = String(keteranganElement?.value || "").trim();

    /* ---------------------------------
     USER
  --------------------------------- */

    const user = typeof Auth !== "undefined" ? Auth.getUser() : null;

    const updatedBy = String(
      user?.username || user?.USERNAME || user?.nama || user?.NAMA || "",
    ).trim();

    /* ---------------------------------
     DATA UPDATE
  --------------------------------- */

    const data = {
      ID_MUTASI: idMutasi,

      ID_PENDUDUK: idPenduduk,

      JENIS_MUTASI: jenisMutasi,

      TANGGAL_MUTASI: tanggalMutasi,

      KETERANGAN: keterangan,

      UPDATED_BY: updatedBy,
    };

    console.log("[MutasiPendudukController] Data mutasi yang diupdate:", data);

    /* ---------------------------------
     VALIDASI CLIENT
  --------------------------------- */

    const validation = MutasiPendudukService.validateMutasi(data);

    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];

      Toast.warning(firstError || "Data mutasi belum lengkap.");

      return;
    }

    /* ---------------------------------
     BUTTON
  --------------------------------- */

    const button = modal.querySelector('[data-modal-action="save-mutasi"]');

    const originalHTML = button?.innerHTML || "";

    if (button) {
      button.disabled = true;

      button.innerHTML = `
      <i data-lucide="loader-circle"></i>
      Menyimpan...
    `;

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }

    try {
      /* ---------------------------------
       UPDATE
    --------------------------------- */

      const result = await MutasiPendudukService.updateMutasi(data);

      console.log(
        "[MutasiPendudukController] Mutasi berhasil diupdate:",
        result,
      );

      /* ---------------------------------
       TUTUP MODAL
    --------------------------------- */

      modal.hidden = true;

      /* ---------------------------------
       RESET MODE
    --------------------------------- */

      modal.dataset.mode = "add";

      modal.dataset.mutasiId = "";

      modal.dataset.pendudukId = "";

      /* ---------------------------------
       TOAST
    --------------------------------- */

      Toast.success("Data mutasi berhasil diperbarui.");

      /* ---------------------------------
       RELOAD
    --------------------------------- */

      await this.loadData();
    } catch (error) {
      console.error("[MutasiPendudukController] updateMutasi:", error);

      Toast.error(error?.message || "Gagal memperbarui data mutasi.");
    } finally {
      /* ---------------------------------
       RESTORE BUTTON
    --------------------------------- */

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
   DELETE MUTASI
===================================== */

  async deleteMutasi(idMutasi) {
    if (!idMutasi) {
      return;
    }

    try {
      console.log("[MutasiPendudukController] Hapus mutasi:", idMutasi);

      const data = await MutasiPendudukService.getMutasiById(idMutasi);

      if (!data) {
        Toast.error("Data mutasi tidak ditemukan.");

        return;
      }

      const namaPenduduk =
        this.state.penduduk.find(
          (item) =>
            String(item.ID_PENDUDUK || "").trim() ===
            String(data.ID_PENDUDUK || "").trim(),
        )?.NAMA || "penduduk ini";

      const jenisMutasi = String(data.JENIS_MUTASI || "").replaceAll("_", " ");

      const confirmed = window.confirm(
        `Hapus data mutasi ini?\n\n` +
          `Penduduk: ${namaPenduduk}\n` +
          `Jenis: ${jenisMutasi}\n` +
          `Tanggal: ${this.formatDate(data.TANGGAL_MUTASI)}\n\n` +
          `Data yang dihapus tidak dapat dikembalikan.`,
      );

      if (!confirmed) {
        return;
      }

      await MutasiPendudukService.deleteMutasi(idMutasi);

      Toast.success("Data mutasi berhasil dihapus.");

      /* ---------------------------------
       REFRESH DATA
    --------------------------------- */

      this.state.mutasi = await MutasiPendudukService.getMutasi();

      this.applyFilter();
    } catch (error) {
      console.error("[MutasiPendudukController] deleteMutasi:", error);

      Toast.error(error?.message || "Gagal menghapus data mutasi.");
    }
  },

  /* =====================================
     VIEW MUTASI
  ===================================== */

  async viewMutasi(idMutasi) {
    if (!idMutasi) {
      return;
    }

    try {
      const data = await MutasiPendudukService.getMutasiById(idMutasi);

      console.log("[MutasiPendudukController] Detail mutasi:", data);

      if (!data) {
        Toast.error("Data mutasi tidak ditemukan.");
        return;
      }

      MutasiPendudukView.renderDetailMutasi(data);
    } catch (error) {
      console.error("[MutasiPendudukController] viewMutasi:", error);

      Toast.error(error?.message || "Gagal mengambil detail mutasi.");
    }
  },

  /* =====================================
   EDIT MUTASI
===================================== */

  async editMutasi(idMutasi) {
    console.log("[MutasiPendudukController] editMutasi:", idMutasi);

    /* ---------------------------------
     VALIDASI ID
  --------------------------------- */

    if (!idMutasi) {
      Toast.warning("ID mutasi tidak ditemukan.");

      return;
    }

    /* ---------------------------------
     LOADING
  --------------------------------- */

    try {
      /* ---------------------------------
       AMBIL DATA MUTASI
    --------------------------------- */

      const mutasi = await MutasiPendudukService.getMutasiById(idMutasi);

      console.log("[MutasiPendudukController] Data mutasi edit:", mutasi);

      if (!mutasi) {
        throw new Error("Data mutasi tidak ditemukan.");
      }

      /* ---------------------------------
       BUKA MODAL EDIT
    --------------------------------- */

      if (
        typeof MutasiPendudukView !== "undefined" &&
        typeof MutasiPendudukView.openEditMutasi === "function"
      ) {
        MutasiPendudukView.openEditMutasi(mutasi);

        return;
      }

      /* ---------------------------------
       VIEW BELUM TERSEDIA
    --------------------------------- */

      console.warn(
        "[MutasiPendudukController] MutasiPendudukView.openEditMutasi() belum tersedia.",
      );

      Toast.warning("Form edit mutasi belum tersedia.");
    } catch (error) {
      console.error("[MutasiPendudukController] editMutasi:", error);

      Toast.error(error?.message || "Gagal membuka data mutasi.");
    }
  },

  /* =====================================
     DELETE MUTASI
  ===================================== */

  /* =========================================
   DELETE MUTASI
========================================= */

  async deleteMutasi(idMutasi) {
    if (!idMutasi) {
      Toast.warning("ID mutasi tidak ditemukan.");
      return;
    }

    try {
      console.log("[MutasiPendudukController] Hapus mutasi:", idMutasi);

      /* ---------------------------------
       KONFIRMASI
    --------------------------------- */

      const confirmed = confirm(
        "Apakah Anda yakin ingin menghapus data mutasi ini?",
      );

      if (!confirmed) {
        return;
      }

      /* ---------------------------------
       DELETE
    --------------------------------- */

      await MutasiPendudukService.deleteMutasi(idMutasi);

      /* ---------------------------------
       SUCCESS
    --------------------------------- */

      Toast.success("Data mutasi berhasil dihapus.");

      /* ---------------------------------
       REFRESH DATA
    --------------------------------- */

      await this.loadData();
    } catch (error) {
      console.error("[MutasiPendudukController] deleteMutasi:", error);

      Toast.error(error?.message || "Gagal menghapus data mutasi.");
    }
  },

  /* =====================================
     GET NAMA PENDUDUK
  ===================================== */

  getNamaPenduduk(idPenduduk) {
    if (!idPenduduk) {
      return "-";
    }

    const penduduk = this.state.penduduk.find(
      (item) => String(item.ID_PENDUDUK).trim() === String(idPenduduk).trim(),
    );

    return penduduk?.NAMA || "-";
  },

  /* =====================================
     MUTATION BADGE
  ===================================== */

  getMutationBadgeClass(jenisMutasi) {
    switch (String(jenisMutasi || "").toUpperCase()) {
      case "LAHIR":
        return "lahir";

      case "MENINGGAL":
        return "meninggal";

      case "PINDAH_DATANG":
        return "datang";

      case "PINDAH_KELUAR":
        return "keluar";

      default:
        return "";
    }
  },

  /* =====================================
     GET KK BY ID
  ===================================== */

  getKKById(idKK) {
    if (!idKK) {
      return null;
    }

    return (
      this.state.kk.find(
        (item) => String(item.ID_KK || "").trim() === String(idKK).trim(),
      ) || null
    );
  },

  /* =====================================
     DATE FORMAT
  ===================================== */

  formatDate(value) {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  },

  /* =====================================
     NORMALIZE DATE
  ===================================== */

  normalizeDate(value) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  },

  /* =====================================
     ESCAPE HTML
  ===================================== */

  escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  /* =====================================
     LOADING
  ===================================== */

  setLoading(isLoading) {
    this.state.loading = Boolean(isLoading);

    const page = document.querySelector(".mutasi-page");

    if (!page) {
      return;
    }

    page.classList.toggle("is-loading", this.state.loading);
  },
};

/* =========================================
   AUTO INIT
========================================= */

// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", () => {
//     MutasiPendudukController.init();
//   });
// } else {
//   MutasiPendudukController.init();
// }
