/* =========================================
   MUTASI PENDUDUK VIEW
========================================= */

const MutasiPendudukView = {
  /* =====================================
     RENDER
  ===================================== */

  render(data = {}) {
    this.renderStats(data.mutasi || []);

    this.renderTable(
      data.filtered || [],
      data.penduduk || [],
      data.currentPage || 1,
      data.perPage || 10,
    );

    this.renderPagination(
      data.filtered || [],
      data.currentPage || 1,
      data.perPage || 10,
    );
  },

  /* =====================================
     STATISTICS
  ===================================== */

  renderStats(mutasi = []) {
    const data = Array.isArray(mutasi) ? mutasi : [];

    const total = data.length;

    const lahir = data.filter(
      (item) => String(item.JENIS_MUTASI || "").toUpperCase() === "LAHIR",
    ).length;

    const meninggal = data.filter(
      (item) => String(item.JENIS_MUTASI || "").toUpperCase() === "MENINGGAL",
    ).length;

    const pindahDatang = data.filter(
      (item) =>
        String(item.JENIS_MUTASI || "").toUpperCase() === "PINDAH_DATANG",
    ).length;

    const pindahKeluar = data.filter(
      (item) =>
        String(item.JENIS_MUTASI || "").toUpperCase() === "PINDAH_KELUAR",
    ).length;

    const values = [total, lahir, meninggal, pindahDatang, pindahKeluar];

    const statElements = document.querySelectorAll(".mutasi-page .stat-value");

    statElements.forEach((element, index) => {
      if (values[index] !== undefined) {
        element.textContent = values[index];
      }
    });

    const descriptions = document.querySelectorAll(
      ".mutasi-page .stat-description",
    );

    if (descriptions.length >= 5) {
      descriptions[0].textContent = "Seluruh data mutasi";

      descriptions[1].textContent =
        this.getPercentage(lahir, total) + "% dari total";

      descriptions[2].textContent =
        this.getPercentage(meninggal, total) + "% dari total";

      descriptions[3].textContent =
        this.getPercentage(pindahDatang, total) + "% dari total";

      descriptions[4].textContent =
        this.getPercentage(pindahKeluar, total) + "% dari total";
    }
  },

  /* =====================================
     TABLE
  ===================================== */

  renderTable(filtered = [], penduduk = [], currentPage = 1, perPage = 10) {
    const tbody = document.querySelector(".mutasi-page .data-table tbody");

    if (!tbody) {
      console.warn("[MutasiPendudukView] tbody tidak ditemukan.");

      return;
    }

    const start = (currentPage - 1) * perPage;

    const end = start + perPage;

    const pageData = filtered.slice(start, end);

    /* ---------------------------------
       EMPTY
    --------------------------------- */

    if (!pageData.length) {
      tbody.innerHTML = `
        <tr>

          <td
            colspan="7"
            style="
              text-align:center;
              padding:40px 20px;
              color:#94a3b8;
            "
          >
            Tidak ada data mutasi.
          </td>

        </tr>
      `;

      return;
    }

    /* ---------------------------------
       TABLE ROW
    --------------------------------- */

    tbody.innerHTML = pageData
      .map((item, index) => {
        const nomor = start + index + 1;

        const nama = this.getNamaPenduduk(item.ID_PENDUDUK, penduduk);

        const tanggal = this.formatDate(item.TANGGAL_MUTASI);

        const badgeClass = this.getMutationBadgeClass(item.JENIS_MUTASI);

        return `
              <tr>

                <td>
                  ${nomor}
                </td>


                <td>
                  ${this.escape(tanggal)}
                </td>


                <td>
                  ${this.escape(nama)}
                </td>


                <td>
                  ${this.escape(item.NIK)}
                </td>


                <td>

                  <span
                    class="mutation-badge ${badgeClass}"
                  >
                    ${this.escape(item.JENIS_MUTASI)}
                  </span>

                </td>


                <td>
                  ${this.escape(item.KETERANGAN || "-")}
                </td>


                <td>

                  <div class="table-actions">

                    <button
                      type="button"
                      class="action-btn view"
                      data-action="view-mutasi"
                      data-mutasi-id="${this.escape(item.ID_MUTASI)}"
                      title="Detail"
                    >

                      <i
                        data-lucide="eye"
                      ></i>

                    </button>


                    <button
                      type="button"
                      class="action-btn edit"
                      data-action="edit-mutasi"
                      data-mutasi-id="${this.escape(item.ID_MUTASI)}"
                      title="Edit"
                    >

                      <i
                        data-lucide="pencil"
                      ></i>

                    </button>


                    <button
                      type="button"
                      class="action-btn delete"
                      data-action="delete-mutasi"
                      data-mutasi-id="${this.escape(item.ID_MUTASI)}"
                      title="Hapus"
                    >

                      <i
                        data-lucide="trash-2"
                      ></i>

                    </button>

                  </div>

                </td>

              </tr>
            `;
      })
      .join("");

    this.refreshIcons();
  },

  /* =====================================
     PAGINATION
  ===================================== */

  renderPagination(filtered = [], currentPage = 1, perPage = 10) {
    const total = filtered.length;

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    const start = total === 0 ? 0 : (currentPage - 1) * perPage + 1;

    const end = Math.min(currentPage * perPage, total);

    /* ---------------------------------
       INFO
    --------------------------------- */

    const info = document.querySelector(".mutasi-page .pagination-info");

    if (info) {
      info.textContent = `Menampilkan ${start} - ${end} dari ${total} data`;
    }

    /* ---------------------------------
       CONTROLS
    --------------------------------- */

    const controls = document.querySelector(
      ".mutasi-page .pagination-controls",
    );

    if (!controls) {
      return;
    }

    let html = "";

    /* PREVIOUS */

    html += `
      <button
        type="button"
        class="pagination-btn"
        data-pagination="prev"
        ${currentPage <= 1 ? "disabled" : ""}
      >

        <i
          data-lucide="chevron-left"
        ></i>

      </button>
    `;

    /* PAGE NUMBER */

    for (let page = 1; page <= totalPages; page++) {
      html += `
        <button
          type="button"
          class="pagination-btn ${page === currentPage ? "active" : ""}"
          data-pagination="${page}"
        >
          ${page}
        </button>
      `;
    }

    /* NEXT */

    html += `
      <button
        type="button"
        class="pagination-btn"
        data-pagination="next"
        ${currentPage >= totalPages ? "disabled" : ""}
      >

        <i
          data-lucide="chevron-right"
        ></i>

      </button>
    `;

    controls.innerHTML = html;

    this.refreshIcons();
  },

  /* =====================================
     LINGKUNGAN OPTIONS
  ===================================== */

  /* =====================================
   RENDER FILTER LINGKUNGAN
===================================== */

  renderLingkunganOptions() {
    const selectElement = document.getElementById("filterLingkungan");

    if (!selectElement) {
      console.warn(
        "[MutasiPendudukView] Select filterLingkungan tidak ditemukan.",
      );

      return;
    }

    const options = MutasiPendudukService.getLingkunganOptions();

    selectElement.innerHTML = `
    <option value="">
      Semua Lingkungan
    </option>

    ${options
      .map(
        (item) => `
          <option value="${this.escape(item.value)}">
            ${this.escape(item.label)}
          </option>
        `,
      )
      .join("")}
  `;
  },

  /* =====================================
     JENIS MUTASI OPTIONS
  ===================================== */

  renderJenisOptions(selectElement) {
    if (!selectElement) {
      return;
    }

    const options = [
      {
        value: "",
        label: "Semua Jenis",
      },
      {
        value: "LAHIR",
        label: "Lahir",
      },
      {
        value: "MENINGGAL",
        label: "Meninggal",
      },
      {
        value: "PINDAH_DATANG",
        label: "Pindah Datang",
      },
      {
        value: "PINDAH_KELUAR",
        label: "Pindah Keluar",
      },
    ];

    selectElement.innerHTML = options
      .map(
        (item) => `
            <option
              value="${this.escape(item.value)}"
            >
              ${this.escape(item.label)}
            </option>
          `,
      )
      .join("");
  },

  /* =====================================
     PENDUDUK OPTIONS
  ===================================== */

  renderPendudukOptions(selectElement, penduduk = []) {
    if (!selectElement) {
      return;
    }

    const data = Array.isArray(penduduk) ? penduduk : [];

    selectElement.innerHTML = `
      <option value="">
        Pilih penduduk
      </option>

      ${data
        .map(
          (item) => `
            <option
              value="${this.escape(item.ID_PENDUDUK)}"
            >
              ${this.escape(item.NAMA || "-")}
              —
              ${this.escape(item.NIK || "-")}
            </option>
          `,
        )
        .join("")}
    `;
  },

  /* =====================================
   PENDUDUK SEARCH RESULTS
===================================== */

  renderPendudukSearchResults(results = []) {
    const container = document.getElementById("hasilPencarianPenduduk");

    if (!container) {
      return;
    }

    const data = Array.isArray(results) ? results : [];

    /* ---------------------------------
     TIDAK ADA HASIL
  --------------------------------- */

    if (!data.length) {
      container.innerHTML = `
      <div class="resident-search-empty">
        <i data-lucide="search-x"></i>

        <div>
          <strong>Penduduk tidak ditemukan</strong>

          <span>
            Coba gunakan nama atau NIK yang berbeda.
          </span>
        </div>
      </div>
    `;

      container.hidden = false;

      this.refreshIcons();

      return;
    }

    /* ---------------------------------
     HASIL PENCARIAN
  --------------------------------- */

    container.innerHTML = data
      .map((item) => {
        return `
        <div class="resident-search-item">

          <div class="resident-search-info">

            <div class="resident-search-name">
              ${this.escape(item.NAMA || "-")}
            </div>

            <div class="resident-search-meta">
              <span>
                NIK:
                ${this.escape(item.NIK || "-")}
              </span>

              <span>
                KK:
                ${this.escape(item.ID_KK || "-")}
              </span>
            </div>

          </div>

          <button
            type="button"
            class="btn btn-primary btn-sm"
            data-action="pilih-penduduk-mutasi"
            data-penduduk-id="${this.escape(item.ID_PENDUDUK)}"
          >
            Pilih
          </button>

        </div>
      `;
      })
      .join("");

    container.hidden = false;

    this.refreshIcons();
  },

  /* =====================================
     PENDUDUK PREVIEW
  ===================================== */

  renderPendudukPreview(penduduk) {
    const container = document.querySelector(".mutasi-page .resident-preview");

    if (!container) {
      return;
    }

    if (!penduduk) {
      container.innerHTML = `
        <div class="resident-preview-icon">
          <i data-lucide="user"></i>
        </div>

        <div class="resident-preview-data">

          <div>
            <span>Nama</span>
            <strong>-</strong>
          </div>

          <div>
            <span>NIK</span>
            <strong>-</strong>
          </div>

          <div>
            <span>No. KK</span>
            <strong>-</strong>
          </div>

          <div>
            <span>Lingkungan</span>
            <strong>-</strong>
          </div>

        </div>
      `;

      this.refreshIcons();

      return;
    }

    container.innerHTML = `
      <div class="resident-preview-icon">
        <i data-lucide="user"></i>
      </div>

      <div class="resident-preview-data">

        <div>
          <span>Nama</span>
          <strong>
            ${this.escape(penduduk.NAMA || "-")}
          </strong>
        </div>

        <div>
          <span>NIK</span>
          <strong>
            ${this.escape(penduduk.NIK || "-")}
          </strong>
        </div>

        <div>
          <span>No. KK</span>
          <strong>
            ${this.escape(penduduk.NO_KK || penduduk.ID_KK || "-")}
          </strong>
        </div>

        <div>
          <span>Lingkungan</span>
          <strong>
            ${this.escape(penduduk.LINGKUNGAN || "-")}
          </strong>
        </div>

      </div>
    `;

    this.refreshIcons();
  },

  /* =====================================
   DETAIL MUTASI
===================================== */

  renderDetailMutasi(data) {
    if (!data) {
      return;
    }

    const modal = document.getElementById("modalDetailMutasi");

    if (!modal) {
      console.warn("[MutasiPendudukView] Modal detail mutasi tidak ditemukan.");

      return;
    }

    /* ---------------------------------
     DATA PENDUDUK
  --------------------------------- */

    let penduduk = null;

    if (typeof MutasiPendudukController !== "undefined") {
      penduduk =
        MutasiPendudukController.state?.penduduk?.find(
          (item) =>
            String(item.ID_PENDUDUK || "").trim() ===
            String(data.ID_PENDUDUK || "").trim(),
        ) || null;
    }

    /* ---------------------------------
     ELEMENT
  --------------------------------- */

    const nama = document.getElementById("detailMutasiNama");
    const nik = document.getElementById("detailMutasiNIK");
    const kk = document.getElementById("detailMutasiKK");

    const jenis = document.getElementById("detailMutasiJenis");
    const tanggal = document.getElementById("detailMutasiTanggal");
    const keterangan = document.getElementById("detailMutasiKeterangan");

    const idMutasi = document.getElementById("detailMutasiId");
    const createdBy = document.getElementById("detailMutasiCreatedBy");
    const createdAt = document.getElementById("detailMutasiCreatedAt");

    /* ---------------------------------
     PENDUDUK
  --------------------------------- */

    if (nama) {
      nama.textContent = penduduk?.NAMA || "-";
    }

    if (nik) {
      nik.textContent = data.NIK || penduduk?.NIK || "-";
    }

    if (kk) {
      kk.textContent =
        data.NO_KK || penduduk?.NO_KK || data.ID_KK || penduduk?.ID_KK || "-";
    }

    /* ---------------------------------
     MUTASI
  --------------------------------- */

    if (jenis) {
      jenis.innerHTML = `
      <span class="mutation-badge ${this.getMutationBadgeClass(
        data.JENIS_MUTASI,
      )}">
        ${this.escape(data.JENIS_MUTASI || "-")}
      </span>
    `;
    }

    if (tanggal) {
      tanggal.textContent = this.formatDate(data.TANGGAL_MUTASI);
    }

    if (keterangan) {
      keterangan.textContent = data.KETERANGAN || "-";
    }

    /* ---------------------------------
     SYSTEM
  --------------------------------- */

    if (idMutasi) {
      idMutasi.textContent = data.ID_MUTASI || "-";
    }

    if (createdBy) {
      createdBy.textContent = data.CREATED_BY || "-";
    }

    if (createdAt) {
      createdAt.textContent = this.formatDate(data.CREATED_AT);
    }

    /* ---------------------------------
     OPEN MODAL
  --------------------------------- */

    modal.hidden = false;

    this.refreshIcons();
  },

  /* =====================================
     GET NAMA PENDUDUK
  ===================================== */

  getNamaPenduduk(idPenduduk, penduduk = []) {
    if (!idPenduduk) {
      return "-";
    }

    const result = penduduk.find(
      (item) =>
        String(item.ID_PENDUDUK || "").trim() === String(idPenduduk).trim(),
    );

    return result?.NAMA || "-";
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

  /* =========================================
   OPEN EDIT MUTASI
========================================= */

  openEditMutasi(mutasi) {
    console.log("[MutasiPendudukView] openEditMutasi:", mutasi);

    if (!mutasi) {
      return;
    }

    /* ---------------------------------
     MODAL
  --------------------------------- */

    const modal = document.getElementById("modalTambahMutasi");

    if (!modal) {
      Toast.error("Modal Mutasi tidak ditemukan.");

      return;
    }

    /* ---------------------------------
     FORM
  --------------------------------- */

    const jenisElement = document.getElementById("formMutasiJenis");

    const tanggalElement = document.getElementById("formMutasiTanggal");

    const keteranganElement = document.getElementById("formMutasiKeterangan");

    /* ---------------------------------
     DATA PENDUDUK
  --------------------------------- */

    const idPenduduk = String(mutasi.ID_PENDUDUK || "").trim();

    let penduduk = null;

    /*
     * Ambil data penduduk dari state
     * Controller sudah memuat data penduduk
     */

    if (typeof MutasiPendudukController !== "undefined") {
      penduduk =
        MutasiPendudukController.state?.penduduk?.find(
          (item) => String(item.ID_PENDUDUK || "").trim() === idPenduduk,
        ) || null;
    }

    console.log("[MutasiPendudukView] Penduduk edit:", penduduk);

    /* ---------------------------------
     RENDER PREVIEW PENDUDUK
  --------------------------------- */

    if (typeof this.renderPendudukPreview === "function") {
      this.renderPendudukPreview(penduduk);
    }

    /* ---------------------------------
     ISI DATA MUTASI
  --------------------------------- */

    if (jenisElement) {
      jenisElement.value = String(mutasi.JENIS_MUTASI || "")
        .trim()
        .toUpperCase();
    }

    if (tanggalElement) {
      let tanggal = "";

      if (mutasi.TANGGAL_MUTASI) {
        /*
         * Jika format ISO:
         * 2026-09-22T00:00:00.000Z
         *
         * ambil YYYY-MM-DD
         */

        tanggal = String(mutasi.TANGGAL_MUTASI).substring(0, 10);
      }

      tanggalElement.value = tanggal;
    }

    if (keteranganElement) {
      keteranganElement.value = String(mutasi.KETERANGAN || "");

      keteranganElement.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
      );
    }

    /* ---------------------------------
   HIDE PENCARIAN PENDUDUK
--------------------------------- */

    const searchPenduduk = document.getElementById("mutasiPendudukSearch");

    if (searchPenduduk) {
      searchPenduduk.hidden = true;
    }

    /* ---------------------------------
     SIMPAN ID EDIT
  --------------------------------- */

    modal.dataset.mode = "edit";

    modal.dataset.mutasiId = String(mutasi.ID_MUTASI || "");

    modal.dataset.pendudukId = idPenduduk;

    /* ---------------------------------
     TAMPILKAN MODAL
  --------------------------------- */

    modal.hidden = false;

    /* ---------------------------------
     UPDATE JUDUL
  --------------------------------- */

    const title = modal.querySelector(".modal-header h2");

    const subtitle = modal.querySelector(".modal-header p");

    if (title) {
      title.textContent = "Edit Mutasi Penduduk";
    }

    if (subtitle) {
      subtitle.textContent = "Perbarui data riwayat mutasi penduduk.";
    }

    /* ---------------------------------
     BUTTON
  --------------------------------- */

    const saveButton = modal.querySelector('[data-modal-action="save-mutasi"]');

    if (saveButton) {
      saveButton.innerHTML = `
      <i data-lucide="save"></i>
      Simpan Perubahan
    `;
    }

    /* ---------------------------------
     LUCIDE
  --------------------------------- */

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
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
     PERCENTAGE
  ===================================== */

  getPercentage(value, total) {
    if (!total) {
      return 0;
    }

    return Math.round((value / total) * 100);
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
     LUCIDE
  ===================================== */

  refreshIcons() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  },
};
