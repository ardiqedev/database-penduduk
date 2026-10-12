/* =========================================
   LAPORAN PENDUDUK CONTROLLER
========================================= */

const Laporan = {
  /* =====================================
     STATE
  ===================================== */

  state: {
    penduduk: [],
    mutasi: [],
    kk: [],
    filtered: [],

    filters: {
      jenisLaporan: "penduduk",
      jenisMutasi: "",
      bulan: "",
      tahun: "",
      lingkungan: "",
      rt: "",
    },

    pagination: {
      currentPage: 1,
      perPage: 10,
    },

    loading: false,
  },

  /* =====================================
     KONFIGURASI
  ===================================== */

  lingkunganMap: {
    L001: "Lingkungan I",

    L002: "Lingkungan II",

    L003: "Lingkungan III",

    L004: "Lingkungan IV",

    L005: "Lingkungan V",
  },

  /* =====================================
     INIT
  ===================================== */

  init() {
    console.log("[Laporan] init");

    this.bindEvents();

    this.bindPaginationEvents();

    this.prepareInitialUI();

    this.loadData();
  },

  /* =====================================
     LOAD DATA
  ===================================== */

  async loadData() {
    this.setLoading(true);

    try {
      console.log("[Laporan] Mengambil data laporan...");

      const [pendudukResponse, mutasiResponse, kkResponse] = await Promise.all([
        API.get("getPenduduk"),
        API.get("getMutasi"),
        API.get("getKK"),
      ]);

      this.state.penduduk = Array.isArray(pendudukResponse?.data)
        ? pendudukResponse.data
        : [];

      this.state.mutasi = Array.isArray(mutasiResponse?.data)
        ? mutasiResponse.data
        : [];

      this.state.kk = Array.isArray(kkResponse?.data) ? kkResponse.data : [];

      console.log("[Laporan] Penduduk:", this.state.penduduk);
      console.log("[Laporan] Mutasi:", this.state.mutasi);
      console.log("[Laporan] KK:", this.state.kk);

      console.log("[Laporan] Penduduk:", this.state.penduduk);

      console.log("[Laporan] Mutasi:", this.state.mutasi);

      console.log("[Laporan] KK:", this.state.kk);

      this.populateYearOptions();

      this.populateRTOptions();

      this.applyFilter();
    } catch (error) {
      console.error("[Laporan] loadData:", error);

      Toast.error(error?.message || "Gagal mengambil data laporan.");
    } finally {
      this.setLoading(false);
    }
  },

  /* =====================================
     INITIAL UI
  ===================================== */

  prepareInitialUI() {
    const jenisLaporan = document.getElementById("jenisLaporan");

    if (jenisLaporan) {
      jenisLaporan.value = "penduduk";
    }

    this.updateJenisMutasiVisibility();

    this.updateDateColumn();
  },

  /* =====================================
     EVENT BINDING
  ===================================== */

  bindEvents() {
    if (this._eventsBound) {
      return;
    }

    this._eventsBound = true;

    /* =================================
       CHANGE
    ================================= */

    document.addEventListener("change", (event) => {
      const target = event.target;

      /* ==============================
           JENIS LAPORAN
        ============================== */

      if (target?.id === "jenisLaporan") {
        this.state.filters.jenisLaporan = target.value || "penduduk";

        this.state.filters.jenisMutasi = "";

        const jenisMutasi = document.getElementById("jenisMutasiLaporan");

        if (jenisMutasi) {
          jenisMutasi.value = "";
        }

        this.updateJenisMutasiVisibility();

        this.updateDateColumn();

        this.applyFilter();

        return;
      }

      /* ==============================
           JENIS MUTASI
        ============================== */

      if (target?.id === "jenisMutasiLaporan") {
        this.state.filters.jenisMutasi = target.value || "";

        this.applyFilter();

        return;
      }

      /* ==============================
           BULAN
        ============================== */

      if (target?.id === "laporanBulan") {
        this.state.filters.bulan = target.value || "";

        this.applyFilter();

        return;
      }

      /* ==============================
           TAHUN
        ============================== */

      if (target?.id === "laporanTahun") {
        this.state.filters.tahun = target.value || "";

        this.applyFilter();

        return;
      }

      /* ==============================
           LINGKUNGAN
        ============================== */

      if (target?.id === "laporanLingkungan") {
        this.state.filters.lingkungan = target.value || "";

        this.state.filters.rt = "";

        this.populateRTOptions();

        this.applyFilter();

        return;
      }

      /* ==============================
           RT
        ============================== */

      if (target?.id === "laporanRT") {
        this.state.filters.rt = target.value || "";

        this.applyFilter();

        return;
      }
    });

    /* =================================
       CLICK
    ================================= */

    document.addEventListener("click", (event) => {
      const actionElement = event.target.closest("[data-action]");

      if (!actionElement) {
        return;
      }

      const action = actionElement.dataset.action;

      switch (action) {
        case "generate-laporan":
          this.generate();

          break;

        case "reset-laporan":
          this.reset();

          break;

        case "print-laporan":
          this.print();

          break;

        case "refresh-laporan":
          this.loadData();

          break;
      }
    });
  },

  /* =====================================
     GENERATE
  ===================================== */

  generate() {
    this.readFilters();

    this.applyFilter();
  },

  /* =====================================
     READ FILTERS
  ===================================== */

  readFilters() {
    const jenisLaporan = document.getElementById("jenisLaporan");

    const jenisMutasi = document.getElementById("jenisMutasiLaporan");

    const bulan = document.getElementById("laporanBulan");

    const tahun = document.getElementById("laporanTahun");

    const lingkungan = document.getElementById("laporanLingkungan");

    const rt = document.getElementById("laporanRT");

    this.state.filters = {
      jenisLaporan: jenisLaporan?.value || "penduduk",

      jenisMutasi: jenisMutasi?.value || "",

      bulan: bulan?.value || "",

      tahun: tahun?.value || "",

      lingkungan: lingkungan?.value || "",

      rt: rt?.value || "",
    };
  },

  /* =====================================
     APPLY FILTER
  ===================================== */

  applyFilter() {
    const filters = this.state.filters;

    let result = [];

    /* =================================
       SEMUA PENDUDUK
    ================================= */

    if (filters.jenisLaporan === "penduduk") {
      result = this.filterPenduduk(this.state.penduduk);
    } else if (filters.jenisLaporan === "kelahiran") {
      /* =================================
       KELAHIRAN
    ================================= */
      result = this.filterKelahiran(this.state.penduduk);
    } else if (filters.jenisLaporan === "mutasi") {
      /* =================================
       MUTASI
    ================================= */
      result = this.filterMutasi(this.state.mutasi);
    }

    this.state.filtered = result;

    this.renderSummary(result);

    this.renderTable(result);

    this.updatePaginationInfo(result);

    this.updateDescription(result);
  },

  /* =====================================
     FILTER PENDUDUK
  ===================================== */

  filterPenduduk(data) {
    const filters = this.state.filters;

    return data.filter((penduduk) => {
      const lokasi = this.getLokasiPenduduk(penduduk);

      if (filters.lingkungan && lokasi.ID_LINGKUNGAN !== filters.lingkungan) {
        return false;
      }

      if (
        filters.rt &&
        this.normalizeRT(lokasi.ID_RT) !== this.normalizeRT(filters.rt)
      ) {
        return false;
      }

      return true;
    });
  },

  /* =====================================
     FILTER KELAHIRAN
  ===================================== */

  filterKelahiran(data) {
    const filters = this.state.filters;

    return data.filter((penduduk) => {
      const tanggal = this.parseDate(penduduk.TANGGAL_LAHIR);

      if (!tanggal) {
        return false;
      }

      if (
        filters.bulan &&
        String(tanggal.getMonth() + 1) !== String(filters.bulan)
      ) {
        return false;
      }

      if (
        filters.tahun &&
        String(tanggal.getFullYear()) !== String(filters.tahun)
      ) {
        return false;
      }

      const lokasi = this.getLokasiPenduduk(penduduk);

      if (filters.lingkungan && lokasi.ID_LINGKUNGAN !== filters.lingkungan) {
        return false;
      }

      if (
        filters.rt &&
        this.normalizeRT(lokasi.ID_RT) !== this.normalizeRT(filters.rt)
      ) {
        return false;
      }

      return true;
    });
  },

  /* =====================================
     FILTER MUTASI
  ===================================== */

  filterMutasi(data) {
    const filters = this.state.filters;

    return data.filter((mutasi) => {
      const jenis = String(mutasi.JENIS_MUTASI || "")
        .trim()
        .toUpperCase();

      /* ==============================
           JENIS MUTASI
        ============================== */

      if (
        filters.jenisMutasi &&
        jenis !== String(filters.jenisMutasi).trim().toUpperCase()
      ) {
        return false;
      }

      /* ==============================
           TANGGAL MUTASI
        ============================== */

      const tanggal = this.parseDate(mutasi.TANGGAL_MUTASI);

      if (!tanggal) {
        return false;
      }

      if (
        filters.bulan &&
        String(tanggal.getMonth() + 1) !== String(filters.bulan)
      ) {
        return false;
      }

      if (
        filters.tahun &&
        String(tanggal.getFullYear()) !== String(filters.tahun)
      ) {
        return false;
      }

      /* ==============================
           LOKASI
        ============================== */

      const penduduk = this.getPendudukById(mutasi.ID_PENDUDUK);

      const lokasi = this.getLokasiPenduduk(penduduk);

      if (filters.lingkungan && lokasi.ID_LINGKUNGAN !== filters.lingkungan) {
        return false;
      }

      if (
        filters.rt &&
        this.normalizeRT(lokasi.ID_RT) !== this.normalizeRT(filters.rt)
      ) {
        return false;
      }

      return true;
    });
  },

  /* =====================================
     GET PENDUDUK BY ID
  ===================================== */

  getPendudukById(idPenduduk) {
    if (!idPenduduk) {
      return null;
    }

    return (
      this.state.penduduk.find(
        (item) =>
          String(item.ID_PENDUDUK || "").trim() ===
          String(idPenduduk || "").trim(),
      ) || null
    );
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
        (item) => String(item.ID_KK || "").trim() === String(idKK || "").trim(),
      ) || null
    );
  },

  /* =====================================
     GET LOKASI PENDUDUK
  ===================================== */

  getLokasiPenduduk(penduduk) {
    if (!penduduk) {
      return {
        ID_LINGKUNGAN: "",

        ID_RT: "",
      };
    }

    const kk = this.getKKById(penduduk.ID_KK);

    if (!kk) {
      return {
        ID_LINGKUNGAN: penduduk.ID_LINGKUNGAN || "",

        ID_RT: penduduk.ID_RT || "",
      };
    }

    return {
      ID_LINGKUNGAN: kk.ID_LINGKUNGAN || "",

      ID_RT: kk.ID_RT || "",
    };
  },

  /* =====================================
     POPULATE RT
  ===================================== */

  populateRTOptions() {
    const select = document.getElementById("laporanRT");

    if (!select) {
      return;
    }

    const lingkungan =
      document.getElementById("laporanLingkungan")?.value || "";

    const currentValue = this.state.filters.rt || "";

    let rtList = this.state.kk
      .filter((kk) => {
        if (!lingkungan) {
          return true;
        }

        return (
          String(kk.ID_LINGKUNGAN || "").trim() === String(lingkungan).trim()
        );
      })
      .map((kk) => this.normalizeRT(kk.ID_RT))
      .filter(Boolean);

    rtList = [...new Set(rtList)].sort((a, b) => Number(a) - Number(b));

    select.innerHTML = `

      <option value="">
        Semua RT
      </option>

      ${rtList
        .map(
          (rt) => `
            <option value="${rt}">
              RT ${rt}
            </option>
          `,
        )
        .join("")}

    `;

    if (rtList.includes(this.normalizeRT(currentValue))) {
      select.value = this.normalizeRT(currentValue);
    } else {
      select.value = "";
    }
  },

  /* =====================================
     POPULATE TAHUN
  ===================================== */

  populateYearOptions() {
    const select = document.getElementById("laporanTahun");

    if (!select) {
      return;
    }

    const years = new Set();

    /* =================================
       TAHUN LAHIR
    ================================= */

    this.state.penduduk.forEach((item) => {
      const date = this.parseDate(item.TANGGAL_LAHIR);

      if (date) {
        years.add(date.getFullYear());
      }
    });

    /* =================================
       TAHUN MUTASI
    ================================= */

    this.state.mutasi.forEach((item) => {
      const date = this.parseDate(item.TANGGAL_MUTASI);

      if (date) {
        years.add(date.getFullYear());
      }
    });

    const sortedYears = [...years].sort((a, b) => b - a);

    const currentValue = select.value || "";

    select.innerHTML = `

      <option value="">
        Semua Tahun
      </option>

      ${sortedYears
        .map(
          (year) => `
            <option value="${year}">
              ${year}
            </option>
          `,
        )
        .join("")}

    `;

    if (sortedYears.includes(Number(currentValue))) {
      select.value = currentValue;
    }
  },

  /* =====================================
     UPDATE JENIS MUTASI VISIBILITY
  ===================================== */

  updateJenisMutasiVisibility() {
    const group = document.getElementById("jenisMutasiGroup");

    if (!group) {
      return;
    }

    const jenisLaporan =
      document.getElementById("jenisLaporan")?.value || "penduduk";

    group.style.display = jenisLaporan === "mutasi" ? "" : "none";
  },

  /* =====================================
     UPDATE TABLE DATE COLUMN
  ===================================== */

  updateDateColumn() {
    const table = document.getElementById("tableLaporan");

    if (!table) {
      return;
    }

    const headers = table.querySelectorAll("thead th");

    if (headers.length < 5) {
      return;
    }

    headers[4].textContent =
      this.state.filters.jenisLaporan === "mutasi"
        ? "Tanggal Mutasi"
        : "Tanggal Lahir";
  },

  /* =====================================
     RENDER SUMMARY
  ===================================== */

  renderSummary(data) {
    const rows = Array.isArray(data) ? data : [];

    const totalPenduduk = document.getElementById("laporanTotalPenduduk");

    const totalLahir = document.getElementById("laporanTotalLahir");

    const totalMeninggal = document.getElementById("laporanTotalMeninggal");

    const totalPindahDatang = document.getElementById(
      "laporanTotalPindahDatang",
    );

    const totalPindahKeluar = document.getElementById(
      "laporanTotalPindahKeluar",
    );

    const tableTotal = document.getElementById("laporanTableTotal");

    const jenisLaporan = this.state.filters.jenisLaporan;

    /* =====================================
     TOTAL DATA HASIL LAPORAN
  ===================================== */

    if (totalPenduduk) {
      totalPenduduk.textContent = rows.length;
    }

    if (tableTotal) {
      tableTotal.textContent = rows.length;
    }

    /* =====================================
     RESET SUMMARY
  ===================================== */

    if (totalLahir) {
      totalLahir.textContent = "0";
    }

    if (totalMeninggal) {
      totalMeninggal.textContent = "0";
    }

    if (totalPindahDatang) {
      totalPindahDatang.textContent = "0";
    }

    if (totalPindahKeluar) {
      totalPindahKeluar.textContent = "0";
    }

    /* =====================================
     LAPORAN KELAHIRAN
  ===================================== */

    if (jenisLaporan === "kelahiran") {
      if (totalLahir) {
        totalLahir.textContent = rows.length;
      }

      return;
    }

    /* =====================================
     LAPORAN MUTASI
  ===================================== */

    if (jenisLaporan === "mutasi") {
      let jumlahMeninggal = 0;

      let jumlahPindahDatang = 0;

      let jumlahPindahKeluar = 0;

      rows.forEach((item) => {
        const jenis = String(item.JENIS_MUTASI || "")
          .trim()
          .toUpperCase();

        if (jenis === "MENINGGAL") {
          jumlahMeninggal++;
        }

        if (jenis === "PINDAH_DATANG") {
          jumlahPindahDatang++;
        }

        if (jenis === "PINDAH_KELUAR") {
          jumlahPindahKeluar++;
        }
      });

      if (totalMeninggal) {
        totalMeninggal.textContent = jumlahMeninggal;
      }

      if (totalPindahDatang) {
        totalPindahDatang.textContent = jumlahPindahDatang;
      }

      if (totalPindahKeluar) {
        totalPindahKeluar.textContent = jumlahPindahKeluar;
      }
    }
  },

  /* =====================================
     RENDER TABLE
  ===================================== */

  renderTable(data) {
    const tbody = document.getElementById("laporanTableBody");

    if (!tbody) return;

    const rows = Array.isArray(data) ? data : [];

    const currentPage = this.state.pagination.currentPage;

    const perPage = this.state.pagination.perPage;

    const startIndex = (currentPage - 1) * perPage;

    const endIndex = startIndex + perPage;

    const pageData = rows.slice(startIndex, endIndex);

    const jenisLaporan = this.state.filters.jenisLaporan;

    /* =====================================
     DATA KOSONG
  ===================================== */

    if (!rows.length) {
      tbody.innerHTML = `
      <tr>
        <td
          colspan="9"
          class="table-empty"
        >
          <div class="laporan-empty-state">

            <i data-lucide="file-search"></i>

            <strong>
              Belum ada laporan
            </strong>

            <span>
              Tidak ada data berdasarkan filter.
            </span>

          </div>
        </td>
      </tr>
    `;

      this.renderPagination(0);

      this.refreshIcons();

      return;
    }

    /* =====================================
     RENDER HALAMAN AKTIF
  ===================================== */

    tbody.innerHTML = pageData
      .map((item, index) =>
        this.buildRow(item, startIndex + index, jenisLaporan),
      )
      .join("");

    /* =====================================
     PAGINATION
  ===================================== */

    this.renderPagination(rows.length);

    this.refreshIcons();
  },

  /* =====================================
     BUILD ROW
  ===================================== */

  buildRow(item, index, jenisLaporan) {
    let penduduk = item;

    let tanggal = "";

    let status = "";

    let keterangan = "";

    /* =================================
       PENDUDUK
    ================================= */

    if (jenisLaporan === "penduduk") {
      tanggal = item.TANGGAL_LAHIR;

      status = item.STATUS_PENDUDUK || "AKTIF";

      keterangan = item.HUBUNGAN_KELUARGA || "-";
    } else if (jenisLaporan === "kelahiran") {
      /* =================================
       KELAHIRAN
    ================================= */
      tanggal = item.TANGGAL_LAHIR;

      status = "LAHIR";

      keterangan = "Kelahiran berdasarkan data penduduk.";
    } else if (jenisLaporan === "mutasi") {
      /* =================================
       MUTASI
    ================================= */
      penduduk = this.getPendudukById(item.ID_PENDUDUK) || {};

      tanggal = item.TANGGAL_MUTASI;

      status = this.formatJenisMutasi(item.JENIS_MUTASI);

      keterangan = item.KETERANGAN || "-";
    }

    const lokasi = this.getLokasiPenduduk(penduduk);

    const lingkungan = this.getLingkunganLabel(lokasi.ID_LINGKUNGAN);

    const rt = this.normalizeRT(lokasi.ID_RT);

    return `

      <tr>

        <td>
          ${index + 1}
        </td>

        <td>
          ${this.escape(penduduk.NIK || item.NIK || "-")}
        </td>

        <td>
          ${this.escape(penduduk.NAMA || "-")}
        </td>

        <td>
          ${this.escape(penduduk.JENIS_KELAMIN || "-")}
        </td>

        <td>
          ${this.formatDate(tanggal)}
        </td>

        <td>
          ${this.escape(lingkungan)}
        </td>

        <td>
          ${this.escape(rt ? `RT ${rt}` : "-")}
        </td>

        <td>

          <span class="badge">

            ${this.escape(status)}

          </span>

        </td>

        <td>
          ${this.escape(keterangan)}
        </td>

      </tr>

    `;
  },

  renderPagination(totalData) {
    const container = document.getElementById("laporanPagination");

    const info = document.getElementById("laporanPaginationInfo");

    if (!container) return;

    const perPage = this.state.pagination.perPage;

    const currentPage = this.state.pagination.currentPage;

    const totalPages = Math.ceil(totalData / perPage);

    /* =====================================
     INFO
  ===================================== */

    if (info) {
      if (!totalData) {
        info.textContent = "Menampilkan 0 data";
      } else {
        const start = (currentPage - 1) * perPage + 1;

        const end = Math.min(currentPage * perPage, totalData);

        info.textContent = `Menampilkan ${start} - ${end} dari ${totalData} data`;
      }
    }

    /* =====================================
     TIDAK ADA PAGINATION
  ===================================== */

    if (totalPages <= 1) {
      container.innerHTML = "";

      return;
    }

    /* =====================================
     HELPER BUTTON
  ===================================== */

    const button = (page, label, disabled = false, active = false) => {
      return `
      <button
        type="button"
        class="pagination-btn${active ? " active" : ""}"
        data-page="${page}"
        ${disabled ? "disabled" : ""}
      >
        ${label}
      </button>
    `;
    };

    let html = "";

    /* =====================================
     PREVIOUS
  ===================================== */

    html += button(currentPage - 1, "‹", currentPage === 1);

    /* =====================================
     NOMOR HALAMAN
  ===================================== */

    const pages = this.getPaginationPages(currentPage, totalPages);

    pages.forEach((page) => {
      if (page === "...") {
        html += `
        <span class="pagination-ellipsis">
          ...
        </span>
      `;

        return;
      }

      html += button(page, page, false, page === currentPage);
    });

    /* =====================================
     NEXT
  ===================================== */

    html += button(currentPage + 1, "›", currentPage === totalPages);

    container.innerHTML = html;
  },

  getPaginationPages(currentPage, totalPages) {
    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      );
    }

    const pages = [];

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);

    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  },

  bindPaginationEvents() {
    const container = document.getElementById("laporanPagination");

    if (!container) return;

    if (container.dataset.bound === "true") {
      return;
    }

    container.dataset.bound = "true";

    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");

      if (!button) return;

      const page = Number(button.dataset.page);

      if (!Number.isFinite(page)) {
        return;
      }

      const totalData = this.state.filtered.length;

      const totalPages = Math.ceil(totalData / this.state.pagination.perPage);

      if (page < 1 || page > totalPages) {
        return;
      }

      this.state.pagination.currentPage = page;

      this.renderTable(this.state.filtered);

      const resultCard = document.querySelector(".laporan-result-card");

      if (resultCard) {
        resultCard.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  },

  /* =====================================
     UPDATE DESCRIPTION
  ===================================== */

  updateDescription(data) {
    const title = document.getElementById("laporanTitle");

    const description = document.getElementById("laporanDescription");

    const jenisLaporan = this.state.filters.jenisLaporan;

    let label = "Semua Penduduk";

    if (jenisLaporan === "kelahiran") {
      label = "Kelahiran";
    }

    if (jenisLaporan === "mutasi") {
      label = "Mutasi Penduduk";

      if (this.state.filters.jenisMutasi) {
        label += " - " + this.formatJenisMutasi(this.state.filters.jenisMutasi);
      }
    }

    if (title) {
      title.textContent = "Hasil Laporan";
    }

    if (description) {
      description.textContent = `${label} · ${data.length} data ditemukan.`;
    }

    const totalData = document.querySelector(
      "#tableLaporan" + " .laporan-total",
    );

    if (totalData) {
      totalData.textContent = `Total Data ${data.length}`;
    }
  },

  /* =====================================
     RESET
  ===================================== */

  reset() {
    this.state.filters = {
      jenisLaporan: "penduduk",

      jenisMutasi: "",

      bulan: "",

      tahun: "",

      lingkungan: "",

      rt: "",
    };

    const jenisLaporan = document.getElementById("jenisLaporan");

    const jenisMutasi = document.getElementById("jenisMutasiLaporan");

    const bulan = document.getElementById("laporanBulan");

    const tahun = document.getElementById("laporanTahun");

    const lingkungan = document.getElementById("laporanLingkungan");

    if (jenisLaporan) {
      jenisLaporan.value = "penduduk";
    }

    if (jenisMutasi) {
      jenisMutasi.value = "";
    }

    if (bulan) {
      bulan.value = "";
    }

    if (tahun) {
      tahun.value = "";
    }

    if (lingkungan) {
      lingkungan.value = "";
    }

    this.populateRTOptions();

    this.updateJenisMutasiVisibility();

    this.updateDateColumn();

    this.applyFilter();
  },

  /* =====================================
     PRINT
  ===================================== */

  print() {
    const data = Array.isArray(this.state.filtered) ? this.state.filtered : [];

    if (!data.length) {
      Toast.warning("Tidak ada data laporan untuk dicetak.");
      return;
    }

    const filters = this.state.filters;

    const jenisLaporan = filters.jenisLaporan || "penduduk";

    let judul = "LAPORAN PENDUDUK";

    if (jenisLaporan === "kelahiran") {
      judul = "LAPORAN KELAHIRAN PENDUDUK";
    }

    if (jenisLaporan === "mutasi") {
      judul = "LAPORAN MUTASI PENDUDUK";
    }

    /* =====================================
     LABEL FILTER
  ===================================== */

    let periode = "Semua Periode";

    if (filters.bulan && filters.tahun) {
      periode = `${this.getNamaBulan(filters.bulan)} ${filters.tahun}`;
    } else if (filters.bulan) {
      periode = this.getNamaBulan(filters.bulan);
    } else if (filters.tahun) {
      periode = String(filters.tahun);
    }

    let lingkungan = "Semua Lingkungan";

    if (filters.lingkungan) {
      lingkungan = this.getLingkunganLabel(filters.lingkungan);
    }

    let rt = "Semua RT";

    if (filters.rt) {
      const normalizedRT = this.normalizeRT(filters.rt);

      rt = normalizedRT ? `RT ${normalizedRT}` : filters.rt;
    }

    let jenisMutasi = "";

    if (jenisLaporan === "mutasi" && filters.jenisMutasi) {
      jenisMutasi = this.formatJenisMutasi(filters.jenisMutasi);
    }

    /* =====================================
     TABLE ROW
  ===================================== */

    const rows = data
      .map((item, index) => {
        let penduduk = item;

        let tanggal = "";

        let status = "";

        let keterangan = "";

        /* =================================
         PENDUDUK
      ================================= */

        if (jenisLaporan === "penduduk") {
          tanggal = item.TANGGAL_LAHIR;

          status = item.STATUS_PENDUDUK || "AKTIF";

          keterangan = item.HUBUNGAN_KELUARGA || "-";
        }

        /* =================================
         KELAHIRAN
      ================================= */

        if (jenisLaporan === "kelahiran") {
          tanggal = item.TANGGAL_LAHIR;

          status = "LAHIR";

          keterangan = "Kelahiran berdasarkan data penduduk.";
        }

        /* =================================
         MUTASI
      ================================= */

        if (jenisLaporan === "mutasi") {
          penduduk = this.getPendudukById(item.ID_PENDUDUK) || {};

          tanggal = item.TANGGAL_MUTASI;

          status = this.formatJenisMutasi(item.JENIS_MUTASI);

          keterangan = item.KETERANGAN || "-";
        }

        const lokasi = this.getLokasiPenduduk(penduduk);

        const lingkunganLabel = this.getLingkunganLabel(lokasi.ID_LINGKUNGAN);

        const rtValue = this.normalizeRT(lokasi.ID_RT);

        return `
        <tr>

          <td class="center">
            ${index + 1}
          </td>

          <td>
            ${this.escape(penduduk.NIK || item.NIK || "-")}
          </td>

          <td>
            ${this.escape(penduduk.NAMA || "-")}
          </td>

          <td>
            ${this.escape(penduduk.JENIS_KELAMIN || "-")}
          </td>

          <td>
            ${this.escape(this.formatDate(tanggal))}
          </td>

          <td>
            ${this.escape(lingkunganLabel)}
          </td>

          <td class="center">
            ${this.escape(rtValue ? `RT ${rtValue}` : "-")}
          </td>

          <td>
            ${this.escape(status)}
          </td>

          <td>
            ${this.escape(keterangan)}
          </td>

        </tr>
      `;
      })
      .join("");

    /* =====================================
     FILTER MUTASI
  ===================================== */

    const mutasiInfo = jenisMutasi
      ? `
        <div class="filter-item">
          <span>Jenis Mutasi</span>
          <strong>${this.escape(jenisMutasi)}</strong>
        </div>
      `
      : "";

    /* =====================================
     PRINT HTML
  ===================================== */

    const printWindow = window.open("", "_blank", "width=1200,height=800");

    if (!printWindow) {
      Toast.error(
        "Popup diblokir browser. Izinkan popup untuk mencetak laporan.",
      );

      return;
    }

    printWindow.document.open();

    printWindow.document.write(`
    <!DOCTYPE html>

    <html lang="id">

    <head>

      <meta charset="UTF-8">

      <title>
        ${this.escape(judul)}
      </title>

      <style>

        * {
          box-sizing: border-box;
        }


        body {
          margin: 0;
          padding: 24px;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #111827;
          background: #ffffff;
          font-size: 11px;
        }


        .report-header {
          text-align: center;
          margin-bottom: 18px;
        }


        .report-header h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }


        .report-header h2 {
          margin: 5px 0 0;
          font-size: 13px;
          font-weight: 500;
          color: #4b5563;
        }


        .report-header .line {
          width: 100%;
          height: 2px;
          margin-top: 12px;
          background: #111827;
        }


        .filter-box {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 16px;
        }


        .filter-title {
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 8px;
        }


        .filter-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 8px 18px;
        }


        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }


        .filter-item span {
          font-size: 9px;
          color: #6b7280;
        }


        .filter-item strong {
          font-size: 10px;
          font-weight: 600;
        }


        .summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }


        .summary-title {
          font-size: 12px;
          font-weight: 700;
        }


        .summary-total {
          font-size: 11px;
          color: #374151;
        }


        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }


        th,
        td {
          border: 1px solid #d1d5db;
          padding: 6px 7px;
          vertical-align: top;
          word-wrap: break-word;
        }


        th {
          background: #f3f4f6;
          font-size: 9px;
          font-weight: 700;
          text-align: left;
        }


        td {
          font-size: 9px;
        }


        .center {
          text-align: center;
        }


        th:nth-child(1),
        td:nth-child(1) {
          width: 4%;
        }


        th:nth-child(2),
        td:nth-child(2) {
          width: 13%;
        }


        th:nth-child(3),
        td:nth-child(3) {
          width: 16%;
        }


        th:nth-child(4),
        td:nth-child(4) {
          width: 10%;
        }


        th:nth-child(5),
        td:nth-child(5) {
          width: 10%;
        }


        th:nth-child(6),
        td:nth-child(6) {
          width: 11%;
        }


        th:nth-child(7),
        td:nth-child(7) {
          width: 7%;
        }


        th:nth-child(8),
        td:nth-child(8) {
          width: 10%;
        }


        th:nth-child(9),
        td:nth-child(9) {
          width: 19%;
        }


        .report-footer {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #6b7280;
        }


        @page {
          size: A4 landscape;
          margin: 10mm;
        }


        @media print {

          body {
            padding: 0;
          }

          .no-print {
            display: none !important;
          }

          thead {
            display: table-header-group;
          }

          tr {
            page-break-inside: avoid;
          }

        }

      </style>

    </head>


    <body>

      <div class="report-header">

        <h1>
          ${this.escape(judul)}
        </h1>

        <h2>
          DATABASE WARGA KELURAHAN AERTEMBAGA DUA
        </h2>

        <div class="line"></div>

      </div>


      <div class="filter-box">

        <div class="filter-title">
          Parameter Laporan
        </div>

        <div class="filter-grid">

          <div class="filter-item">
            <span>Jenis Laporan</span>
            <strong>
              ${
                jenisLaporan === "kelahiran"
                  ? "Kelahiran"
                  : jenisLaporan === "mutasi"
                    ? "Mutasi"
                    : "Semua Penduduk"
              }
            </strong>
          </div>


          ${jenisMutasi ? mutasiInfo : ""}


          <div class="filter-item">
            <span>Periode</span>
            <strong>
              ${this.escape(periode)}
            </strong>
          </div>


          <div class="filter-item">
            <span>Lingkungan</span>
            <strong>
              ${this.escape(lingkungan)}
            </strong>
          </div>


          <div class="filter-item">
            <span>RT</span>
            <strong>
              ${this.escape(rt)}
            </strong>
          </div>

        </div>

      </div>


      <div class="summary">

        <div class="summary-title">
          Hasil Laporan
        </div>

        <div class="summary-total">
          Total Data:
          <strong>${data.length}</strong>
        </div>

      </div>


      <table>

        <thead>

          <tr>

            <th>No</th>

            <th>NIK</th>

            <th>Nama</th>

            <th>Jenis Kelamin</th>

            <th>
              ${jenisLaporan === "mutasi" ? "Tanggal Mutasi" : "Tanggal Lahir"}
            </th>

            <th>Lingkungan</th>

            <th>RT</th>

            <th>Status</th>

            <th>Keterangan</th>

          </tr>

        </thead>


        <tbody>

          ${rows}

        </tbody>

      </table>


      <div class="report-footer">

        <span>
          Dicetak dari Sistem Database Warga
        </span>

        <span>
          ${new Date().toLocaleString("id-ID")}
        </span>

      </div>


      <script>

        window.onload = function() {

          setTimeout(function() {

            window.print();

          }, 300);

        };


        window.onafterprint = function() {

          setTimeout(function() {

            window.close();

          }, 300);

        };

      <\/script>

    </body>

    </html>
  `);

    printWindow.document.close();
  },

  updatePaginationInfo(data) {
    const info = document.getElementById("laporanPaginationInfo");

    if (!info) {
      return;
    }

    const rows = Array.isArray(data) ? data : [];
    const total = rows.length;

    if (total === 0) {
      info.textContent = "Menampilkan 0 data";
      return;
    }

    info.textContent = `Menampilkan 1 - ${total} dari ${total} data`;
  },

  /* =====================================
     REFRESH
  ===================================== */

  refresh() {
    this.loadData();
  },

  /* =====================================
     DATE PARSER
  ===================================== */

  parseDate(value) {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    const text = String(value).trim();

    if (!text) {
      return null;
    }

    /* =================================
       YYYY-MM-DD
    ================================= */

    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoMatch) {
      const year = Number(isoMatch[1]);

      const month = Number(isoMatch[2]) - 1;

      const day = Number(isoMatch[3]);

      const date = new Date(year, month, day);

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    /* =================================
       GOOGLE DATE STRING
    ================================= */

    const date = new Date(text);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  },

  /* =====================================
     FORMAT DATE
  ===================================== */

  formatDate(value) {
    const date = this.parseDate(value);

    if (!date) {
      return "-";
    }

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",

      month: "short",

      year: "numeric",
    });
  },

  /* =====================================
     FORMAT JENIS MUTASI
  ===================================== */

  formatJenisMutasi(value) {
    const jenis = String(value || "")
      .trim()
      .toUpperCase();

    switch (jenis) {
      case "MENINGGAL":
        return "Meninggal";

      case "PINDAH_DATANG":
        return "Pindah Datang";

      case "PINDAH_KELUAR":
        return "Pindah Keluar";

      default:
        return value || "-";
    }
  },

  /* =====================================
     GET LINGKUNGAN LABEL
  ===================================== */

  getLingkunganLabel(id) {
    const key = String(id || "").trim();

    return this.lingkunganMap[key] || key || "-";
  },

  /* =====================================
     NORMALIZE RT
  ===================================== */

  normalizeRT(value) {
    if (value === null || value === undefined) {
      return "";
    }

    let rt = String(value).trim().toUpperCase();

    if (rt.startsWith("RT")) {
      rt = rt.substring(2).trim();
    }

    if (!/^\d+$/.test(rt)) {
      return "";
    }

    return rt.padStart(3, "0");
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

    const page = document.querySelector(".laporan-page");

    if (!page) {
      return;
    }

    page.classList.toggle("is-loading", this.state.loading);
  },

  /* =====================================
     REFRESH ICON
  ===================================== */

  refreshIcons() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  },
};
