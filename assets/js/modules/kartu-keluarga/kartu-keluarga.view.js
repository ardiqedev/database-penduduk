/* =========================================
   DATABASE WARGA
   KARTU KELUARGA & PENDUDUK
   VIEW
========================================= */

(() => {
  "use strict";

  const KartuKeluargaView = {
    /* =====================================
       RENDER LIST KK
    ===================================== */

    renderList({
      items = [],
      total = 0,
      currentPage = 1,
      totalPages = 1,
      selectedKK = null,
    } = {}) {
      const container = document.getElementById("kkList");

      if (!container) {
        return;
      }

      this.setText("kkTotal", total);
      this.setText("kkPaginationTotal", total);

      /* ================================
         EMPTY
      ================================= */

      if (!items.length) {
        container.innerHTML = this.renderEmpty(
          "search-x",
          "Data tidak ditemukan",
          "Tidak ada kartu keluarga yang sesuai dengan pencarian.",
        );

        this.renderPagination({
          totalPages,
          currentPage,
        });

        this.refreshIcons();

        return;
      }

      /* ================================
         LIST
      ================================= */

      container.innerHTML = items
        .map((item) => this.renderKKItem(item, selectedKK === item.ID_KK))
        .join("");

      /* ================================
         PAGINATION
      ================================= */

      this.renderPagination({
        totalPages,
        currentPage,
      });

      this.refreshIcons();
    },

    /* =====================================
       RENDER KK ITEM
    ===================================== */

    renderKKItem(item, selected = false) {
      const selectedClass = selected ? "selected" : "";

      const status = String(item.STATUS_KK || "").toLowerCase();

      const kepala = item.KEPALA_KELUARGA || "Belum ada kepala keluarga";

      const alamat = item.ALAMAT || "-";

      return `
        <div
          class="kk-item ${selectedClass}"
          data-kk-id="${this.escape(item.ID_KK)}"
        >

          <!-- ICON -->

          <div class="kk-item-icon">
            <i data-lucide="house"></i>
          </div>


          <!-- MAIN -->

          <div class="kk-item-main">

            <span class="kk-item-id">
              ${this.escape(item.ID_KK)}
            </span>

            <span class="kk-item-no">
              No. KK:
              ${this.escape(item.NO_KK)}
            </span>


            <div class="kk-item-person">

              <i data-lucide="user"></i>

              <span>
                ${this.escape(kepala)}
              </span>

            </div>


            <div class="kk-item-location">

              <i data-lucide="map-pin"></i>

              <span>
                ${this.getLingkunganName(item.ID_LINGKUNGAN)}
                •
                ${this.escape(item.ID_RT)}
              </span>

            </div>


            <div class="kk-item-address">
              ${this.escape(alamat)}
            </div>

          </div>


          <!-- META -->

          <div class="kk-item-meta">

            <span class="status-badge ${status}">

              <span class="status-dot"></span>

              ${this.escape(item.STATUS_KK || "-")}

            </span>


            <div class="kk-meta-row">

              <i data-lucide="users"></i>

              <strong>
                ${item.JUMLAH_ANGGOTA ?? 0}
              </strong>

              Anggota

            </div>


            <div class="kk-meta-row">

              <i data-lucide="badge"></i>

              Desil DTSEN:

              <strong>
                ${this.escape(item.DESIL_DTSEN || "-")}
              </strong>

            </div>

          </div>


          <!-- ARROW -->

          <div class="kk-item-arrow">

            <i data-lucide="chevron-right"></i>

          </div>

        </div>
      `;
    },

    /* =====================================
       RENDER DETAIL KK
    ===================================== */

    renderDetail(item) {
      if (!item) {
        this.showDetailEmpty();
        return;
      }

      const empty = document.getElementById("kkDetailEmpty");

      const detail = document.getElementById("kkDetail");

      empty?.classList.add("hidden");

      detail?.classList.remove("hidden");

      this.setText("detailIdKK", item.ID_KK);

      this.setText("detailNoKK", item.NO_KK);

      this.setText(
        "detailLingkungan",
        this.getLingkunganName(item.ID_LINGKUNGAN),
      );

      this.setText("detailRT", item.ID_RT);

      this.setText(
        "detailKepala",
        item.KEPALA_KELUARGA || "Belum ada kepala keluarga",
      );

      this.setText("detailDesil", item.DESIL_DTSEN || "-");

      this.setText("detailAlamat", item.ALAMAT || "-");

      this.setText("detailTanggal", this.formatDate(item.TANGGAL_TERDAFTAR));

      /* STATUS */

      const status = document.getElementById("detailStatus");

      if (status) {
        const value = item.STATUS_KK || "-";

        status.textContent = value;

        status.className = "status-badge " + String(value).toLowerCase();
      }
    },

    /* =====================================
       RENDER ANGGOTA
    ===================================== */

    renderAnggota(anggota = []) {
      this.setText("detailJumlahAnggota", anggota.length);

      this.setText("summaryTotalAnggota", anggota.length);

      const laki = anggota.filter(
        (item) => item.JENIS_KELAMIN === "LAKI-LAKI",
      ).length;

      const perempuan = anggota.filter(
        (item) => item.JENIS_KELAMIN === "PEREMPUAN",
      ).length;

      this.setText("summaryLaki", laki);

      this.setText("summaryPerempuan", perempuan);

      const tbody = document.getElementById("anggotaTableBody");

      if (!tbody) {
        return;
      }

      /* ================================
         EMPTY
      ================================= */

      if (!anggota.length) {
        tbody.innerHTML = `
          <tr>

            <td
              colspan="7"
              style="
                text-align:center;
                padding:30px;
                color:#94a3b8;
              "
            >
              Belum ada anggota keluarga.
            </td>

          </tr>
        `;

        return;
      }

      /* ================================
         DATA
      ================================= */

      tbody.innerHTML = anggota
        .map(
          (item, index) => `
            <tr>

              <td>
                ${index + 1}
              </td>

              <td>

                <span class="member-name">
                  ${this.escape(item.NAMA)}
                </span>

              </td>

              <td>
                ${this.escape(item.NIK)}
              </td>

              <td>

                <span class="member-relation">
                  ${this.escape(item.HUBUNGAN_KELUARGA)}
                </span>

              </td>

              <td>
                ${item.JENIS_KELAMIN === "LAKI-LAKI" ? "L" : "P"}
              </td>

              <td>

                <span class="status-badge aktif">

                  <span class="status-dot"></span>

                  AKTIF

                </span>

              </td>

              <div class="member-actions">

                <button
                  type="button"
                  class="view-btn"
                  title="Edit penduduk"
                  data-action="edit-anggota"
                  data-penduduk-id="${this.escape(item.ID_PENDUDUK)}"
                >
                  <i data-lucide="pencil"></i>
                </button>

                <button
                  type="button"
                  class="view-btn"
                  title="Hapus penduduk"
                  data-action="delete-anggota"
                  data-penduduk-id="${this.escape(item.ID_PENDUDUK)}"
                >
                  <i data-lucide="trash-2"></i>
                </button>

              </div>

            </tr>
          `,
        )
        .join("");

      this.refreshIcons();
    },

    /* =====================================
       PAGINATION
    ===================================== */

    renderPagination({ totalPages = 1, currentPage = 1 } = {}) {
      const container = document.getElementById("kkPaginationNumbers");

      if (!container) {
        return;
      }

      container.innerHTML = "";

      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");

        button.type = "button";

        button.className =
          "pagination-number" + (i === currentPage ? " active" : "");

        button.dataset.pageNumber = i;

        button.textContent = i;

        container.appendChild(button);
      }
    },

    /* =====================================
       MAIN TAB
    ===================================== */

    setMainTab(tab) {
      document.querySelectorAll(".keluarga-tab").forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === tab);
      });
    },

    /* =====================================
       DETAIL TAB
    ===================================== */

    setDetailTab(tab) {
      document.querySelectorAll(".detail-tab").forEach((button) => {
        button.classList.toggle("active", button.dataset.detailTab === tab);
      });

      document.querySelectorAll(".detail-tab-panel").forEach((panel) => {
        const targetId =
          tab === "anggota" ? "detailAnggotaPanel" : "detailRiwayatPanel";

        panel.classList.toggle("active", panel.id === targetId);
      });
    },

    /* =====================================
       CHANGE VIEW
    ===================================== */

    setView(view) {
      document.querySelectorAll(".view-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.view === view);
      });

      const list = document.getElementById("kkList");

      if (!list) {
        return;
      }

      list.classList.toggle("grid-view", view === "grid");
    },

    /* =====================================
       COMING SOON
    ===================================== */

    showComingSoon() {
      const list = document.getElementById("kkList");

      if (!list) {
        return;
      }

      list.innerHTML = `

        <div class="detail-empty">

          <div class="detail-empty-icon">

            <i data-lucide="search"></i>

          </div>


          <h3>
            Pencarian Penduduk
          </h3>


          <p>
            Area pencarian penduduk
            akan kita aktifkan setelah
            desain utama selesai.
          </p>

        </div>

      `;

      this.refreshIcons();
    },

    /* =====================================
       EMPTY DETAIL
    ===================================== */

    showDetailEmpty() {
      const empty = document.getElementById("kkDetailEmpty");

      const detail = document.getElementById("kkDetail");

      empty?.classList.remove("hidden");

      detail?.classList.add("hidden");
    },

    /* =====================================
       EMPTY STATE
    ===================================== */

    renderEmpty(
      icon = "search-x",
      title = "Data tidak ditemukan",
      message = "",
    ) {
      return `

        <div class="detail-empty">

          <div class="detail-empty-icon">

            <i data-lucide="${icon}"></i>

          </div>


          <h3>
            ${this.escape(title)}
          </h3>


          <p>
            ${this.escape(message)}
          </p>

        </div>

      `;
    },

    /* =====================================
       MODAL TAMBAH KK
    ===================================== */

    openTambahKK() {
      if (typeof Modal === "undefined") {
        console.error("[KartuKeluargaView] Modal Engine tidak tersedia.");

        return;
      }

      Modal.open({
        title: "Tambah Kartu Keluarga",

        size: "lg",

        body: this.getTambahKKBody(),

        footer: this.getTambahKKFooter(),
      });
    },

    /* =====================================
      MODAL EDIT KK
    ===================================== */

    openEditKK(kk) {
      if (typeof Modal === "undefined") {
        console.error("[KartuKeluargaView] Modal Engine tidak tersedia.");

        return;
      }

      if (!kk) {
        console.error("[KartuKeluargaView] Data KK untuk edit tidak tersedia.");

        return;
      }

      console.log("[KartuKeluargaView] openEditKK():", kk);

      Modal.open({
        title: "Edit Kartu Keluarga",

        size: "lg",

        body: this.getEditKKBody(kk),

        footer: this.getEditKKFooter(),
      });
    },

    /* =====================================
       MODAL BODY
    ===================================== */

    getTambahKKBody() {
      return `

    <div class="kk-modal-form">

      <!-- =====================================
           SECTION INFORMASI KK
      ====================================== -->

      <div class="kk-form-section">

        <div class="kk-form-section-header">

          <div class="kk-form-section-icon">
            <i data-lucide="house"></i>
          </div>

          <div>
            <h3 class="kk-form-section-title">
              Informasi Kartu Keluarga
            </h3>

            <p class="kk-form-section-description">
              Masukkan informasi dasar kartu keluarga.
            </p>
          </div>

        </div>


        <!-- =================================
             FORM GRID
        ================================== -->

        <div class="kk-form-grid">

          <!-- NO KK -->

          <div class="kk-form-field">

            <label
              for="formNoKK"
              class="kk-form-label"
            >
              Nomor Kartu Keluarga
              <span class="required">*</span>
            </label>

            <input
              type="text"
              id="formNoKK"
              name="NO_KK"
              class="kk-form-input"
              inputmode="numeric"
              maxlength="16"
              placeholder="Masukkan 16 digit Nomor KK"
              autocomplete="off"
            />

            <small class="kk-form-help">
              Nomor Kartu Keluarga harus terdiri dari 16 digit.
            </small>

          </div>


          <!-- ALAMAT -->

          <div class="kk-form-field">

            <label
              for="formAlamat"
              class="kk-form-label"
            >
              Alamat
              <span class="required">*</span>
            </label>

            <textarea
              id="formAlamat"
              name="ALAMAT"
              class="kk-form-textarea"
              rows="3"
              placeholder="Masukkan alamat lengkap keluarga"
            ></textarea>

          </div>


          <!-- LINGKUNGAN -->

          <div class="kk-form-field">

            <label
              for="formLingkungan"
              class="kk-form-label"
            >
              Lingkungan
              <span class="required">*</span>
            </label>

            <select
              id="formLingkungan"
              name="ID_LINGKUNGAN"
              class="kk-form-select"
            >

              <option value="">
                Pilih Lingkungan
              </option>

              <option value="L001">
                Lingkungan I
              </option>

              <option value="L002">
                Lingkungan II
              </option>

              <option value="L003">
                Lingkungan III
              </option>

              <option value="L004">
                Lingkungan IV
              </option>

              <option value="L005">
                Lingkungan V
              </option>

            </select>

          </div>


          <!-- RT -->

          <div class="kk-form-field">

            <label
              for="formRT"
              class="kk-form-label"
            >
              RT
              <span class="required">*</span>
            </label>

            <select
              id="formRT"
              name="ID_RT"
              class="kk-form-select"
              disabled
            >

              <option value="">
                Pilih Lingkungan terlebih dahulu
              </option>

            </select>

            <small class="kk-form-help">
              RT akan menyesuaikan dengan lingkungan.
            </small>

          </div>


          <!-- DESIL -->

          <div class="kk-form-field kk-form-field-full">

            <label
              for="formDesil"
              class="kk-form-label"
            >
              Desil DTSEN
            </label>

            <select
              id="formDesil"
              name="DESIL_DTSEN"
              class="kk-form-select"
            >

              <option value="">
                Belum ada data
              </option>

              <option value="1">Desil 1</option>
              <option value="2">Desil 2</option>
              <option value="3">Desil 3</option>
              <option value="4">Desil 4</option>
              <option value="5">Desil 5</option>
              <option value="6">Desil 6</option>
              <option value="7">Desil 7</option>
              <option value="8">Desil 8</option>
              <option value="9">Desil 9</option>
              <option value="10">Desil 10</option>

            </select>

          </div>

        </div>

      </div>


      <!-- =====================================
           INFO DTSEN
      ====================================== -->

      <div class="kk-dtsen-info">

        <div class="kk-dtsen-info-icon">
          <i data-lucide="info"></i>
        </div>

        <div>

          <div class="kk-dtsen-info-title">
            Tentang Desil DTSEN
          </div>

          <p class="kk-dtsen-info-text">
            Desil DTSEN merupakan data referensi tingkat keluarga.
            Jika belum tersedia, biarkan pilihan tetap
            "Belum ada data".
          </p>

        </div>

      </div>

    </div>

  `;
    },

    /* =====================================
   MODAL EDIT KK - BODY
===================================== */

    getEditKKBody(kk) {
      const escape = (value) => {
        return String(value ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };

      const lingkungan = String(kk.ID_LINGKUNGAN || "");

      const rt = String(kk.ID_RT || "");

      const desil = String(kk.DESIL_DTSEN ?? "");

      return `

    <div class="form-modal">

      <!-- ==============================
           INFORMASI KK
      =============================== -->

      <div class="form-section">

        <div class="form-section-header">

          <div class="form-section-icon">
            <i data-lucide="house"></i>
          </div>

          <div>
            <h3>
              Informasi Kartu Keluarga
            </h3>

            <p>
              Perbarui informasi kartu keluarga.
            </p>
          </div>

        </div>


        <div class="form-grid">

          <!-- ID KK -->

          <div class="form-group form-full">

            <label>
              ID Kartu Keluarga
            </label>

            <input
              type="text"
              value="${escape(kk.ID_KK)}"
              readonly
              disabled
            />

            <small>
              ID Kartu Keluarga tidak dapat diubah.
            </small>

          </div>


          <!-- NO KK -->

          <div class="form-group form-full">

            <label for="editNoKK">

              Nomor Kartu Keluarga

              <span class="required">
                *
              </span>

            </label>

            <input
              type="text"
              id="editNoKK"
              name="NO_KK"
              inputmode="numeric"
              maxlength="16"
              autocomplete="off"
              value="${escape(kk.NO_KK)}"
            />

            <small>
              Nomor Kartu Keluarga harus terdiri
              dari 16 digit.
            </small>

          </div>


          <!-- ALAMAT -->

          <div class="form-group form-full">

            <label for="editAlamat">

              Alamat

              <span class="required">
                *
              </span>

            </label>

            <textarea
              id="editAlamat"
              name="ALAMAT"
              rows="3"
              placeholder="Masukkan alamat lengkap keluarga"
            >${escape(kk.ALAMAT)}</textarea>

          </div>


          <!-- LINGKUNGAN -->

          <div class="form-group">

            <label for="editLingkungan">

              Lingkungan

              <span class="required">
                *
              </span>

            </label>

            <select
              id="editLingkungan"
              name="ID_LINGKUNGAN"
            >

              <option value="">
                Pilih Lingkungan
              </option>

              <option
                value="L001"
                ${lingkungan === "L001" ? "selected" : ""}
              >
                Lingkungan I
              </option>

              <option
                value="L002"
                ${lingkungan === "L002" ? "selected" : ""}
              >
                Lingkungan II
              </option>

              <option
                value="L003"
                ${lingkungan === "L003" ? "selected" : ""}
              >
                Lingkungan III
              </option>

              <option
                value="L004"
                ${lingkungan === "L004" ? "selected" : ""}
              >
                Lingkungan IV
              </option>

              <option
                value="L005"
                ${lingkungan === "L005" ? "selected" : ""}
              >
                Lingkungan V
              </option>

            </select>

          </div>


          <!-- RT -->

          <div class="form-group">

            <label for="editRT">

              RT

              <span class="required">
                *
              </span>

            </label>

            <select
              id="editRT"
              name="ID_RT"
            >

              <option value="">
                Pilih RT
              </option>

            </select>

          </div>


          <!-- STATUS -->

          <div class="form-group">

            <label for="editStatusKK">
              Status KK
            </label>

            <select
              id="editStatusKK"
              name="STATUS_KK"
            >

              <option
                value="AKTIF"
                ${String(kk.STATUS_KK) === "AKTIF" ? "selected" : ""}
              >
                Aktif
              </option>

              <option
                value="NONAKTIF"
                ${String(kk.STATUS_KK) === "NONAKTIF" ? "selected" : ""}
              >
                Nonaktif
              </option>

            </select>

          </div>


          <!-- DESIL -->

          <div class="form-group">

            <label for="editDesil">

              Desil DTSEN

            </label>

            <select
              id="editDesil"
              name="DESIL_DTSEN"
            >

              <option value="">
                Tidak tersedia
              </option>

              ${Array.from({ length: 10 }, (_, index) => {
                const value = String(index + 1);

                return `
                  <option
                    value="${value}"
                    ${desil === value ? "selected" : ""}
                  >
                    ${value}
                  </option>
                `;
              }).join("")}

            </select>

          </div>

        </div>

      </div>


      <!-- ==============================
           INFO
      =============================== -->

      <div class="form-info">

        <i data-lucide="info"></i>

        <div>

          <strong>
            Informasi
          </strong>

          <p>
            Perubahan data akan langsung
            memperbarui data Kartu Keluarga.
          </p>

        </div>

      </div>

    </div>

  `;
    },

    /* =====================================
   MODAL EDIT KK - FOOTER
===================================== */

    getEditKKFooter() {
      return `

    <button
      type="button"
      class="btn btn-secondary"
      data-modal-action="cancel"
    >
      Batal
    </button>

    <button
      type="button"
      class="btn btn-primary"
      data-modal-action="update-kk"
    >
      <i data-lucide="save"></i>
      Simpan Perubahan
    </button>

  `;
    },

    /* =====================================
      TAMBAH ANGGOTA
    ===================================== */

    openTambahAnggota(kk = null) {
      console.log("[KartuKeluargaView] openTambahAnggota()", kk);

      if (!kk) {
        Toast.warning("Kartu Keluarga belum dipilih.");
        return;
      }

      Modal.open({
        title: "Tambah Anggota Keluarga",
        size: "lg",
        body: this.getTambahAnggotaBody(kk),
        footer: this.getTambahAnggotaFooter(),
      });

      if (window.lucide) {
        lucide.createIcons();
      }
    },

    getTambahAnggotaBody(kk) {
      return `

    <div class="anggota-modal-form">

      <!-- =====================================
           INFO KK
      ====================================== -->

      <div class="anggota-kk-info">

        <div class="anggota-kk-icon">
          <i data-lucide="house"></i>
        </div>

        <div class="anggota-kk-content">

          <div class="anggota-kk-label">
            Kartu Keluarga
          </div>

          <div class="anggota-kk-title">
            ${kk.ID_KK || "-"}
          </div>

          <div class="anggota-kk-meta">
            No. KK ${kk.NO_KK || "-"}
            <span>•</span>
            ${kk.ID_LINGKUNGAN || "-"}
            <span>•</span>
            ${kk.ID_RT || "-"}
          </div>

        </div>

      </div>


      <!-- =====================================
           IDENTITAS
      ====================================== -->

      <div class="anggota-form-section">

        <div class="anggota-form-section-header">

          <div class="anggota-form-section-icon">
            <i data-lucide="user-round"></i>
          </div>

          <div>

            <h3 class="anggota-form-section-title">
              Data Identitas
            </h3>

            <p class="anggota-form-section-description">
              Masukkan identitas penduduk yang akan
              ditambahkan ke dalam kartu keluarga.
            </p>

          </div>

        </div>


        <div class="anggota-form-grid">

          <!-- NIK -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaNIK"
              class="anggota-form-label"
            >
              NIK
              <span class="required">*</span>
            </label>

            <input
              type="text"
              id="formAnggotaNIK"
              name="NIK"
              class="anggota-form-input"
              inputmode="numeric"
              maxlength="16"
              placeholder="Masukkan 16 digit NIK"
              autocomplete="off"
            />

            <small class="anggota-form-help">
              NIK harus terdiri dari 16 digit.
            </small>

          </div>


          <!-- NAMA -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaNama"
              class="anggota-form-label"
            >
              Nama Lengkap
              <span class="required">*</span>
            </label>

            <input
              type="text"
              id="formAnggotaNama"
              name="NAMA"
              class="anggota-form-input"
              placeholder="Masukkan nama lengkap"
              autocomplete="off"
            />

          </div>


          <!-- TEMPAT LAHIR -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaTempatLahir"
              class="anggota-form-label"
            >
              Tempat Lahir
              <span class="required">*</span>
            </label>

            <input
              type="text"
              id="formAnggotaTempatLahir"
              name="TEMPAT_LAHIR"
              class="anggota-form-input"
              placeholder="Contoh: Bitung"
            />

          </div>


          <!-- TANGGAL LAHIR -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaTanggalLahir"
              class="anggota-form-label"
            >
              Tanggal Lahir
              <span class="required">*</span>
            </label>

            <input
              type="date"
              id="formAnggotaTanggalLahir"
              name="TANGGAL_LAHIR"
              class="anggota-form-input"
            />

          </div>


          <!-- JENIS KELAMIN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaJenisKelamin"
              class="anggota-form-label"
            >
              Jenis Kelamin
              <span class="required">*</span>
            </label>

            <select
              id="formAnggotaJenisKelamin"
              name="JENIS_KELAMIN"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Jenis Kelamin
              </option>

              <option value="LAKI-LAKI">
                Laki-laki
              </option>

              <option value="PEREMPUAN">
                Perempuan
              </option>

            </select>

          </div>


          <!-- AGAMA -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaAgama"
              class="anggota-form-label"
            >
              Agama
              <span class="required">*</span>
            </label>

            <select
              id="formAnggotaAgama"
              name="AGAMA"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Agama
              </option>

              <option value="ISLAM">Islam</option>
              <option value="KRISTEN">Kristen</option>
              <option value="KATOLIK">Katolik</option>
              <option value="HINDU">Hindu</option>
              <option value="BUDDHA">Buddha</option>
              <option value="KONGHUCU">Konghucu</option>

            </select>

          </div>


          <!-- KEWARGANEGARAAN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaKewarganegaraan"
              class="anggota-form-label"
            >
              Kewarganegaraan
            </label>

            <select
              id="formAnggotaKewarganegaraan"
              name="KEWARGANEGARAAN"
              class="anggota-form-select"
            >

              <option value="WNI">
                WNI
              </option>

              <option value="WNA">
                WNA
              </option>

            </select>

          </div>


          <!-- STATUS PERKAWINAN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaStatusPerkawinan"
              class="anggota-form-label"
            >
              Status Perkawinan
            </label>

            <select
              id="formAnggotaStatusPerkawinan"
              name="STATUS_PERKAWINAN"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Status
              </option>

              <option value="BELUM_KAWIN">
                Belum Kawin
              </option>

              <option value="KAWIN">
                Kawin
              </option>

              <option value="CERAI_HIDUP">
                Cerai Hidup
              </option>

              <option value="CERAI_MATI">
                Cerai Mati
              </option>

            </select>

          </div>

        </div>

      </div>


      <!-- =====================================
           HUBUNGAN KELUARGA
      ====================================== -->

      <div class="anggota-form-section">

        <div class="anggota-form-section-header">

          <div class="anggota-form-section-icon">
            <i data-lucide="users-round"></i>
          </div>

          <div>

            <h3 class="anggota-form-section-title">
              Hubungan Keluarga
            </h3>

            <p class="anggota-form-section-description">
              Tentukan hubungan penduduk dengan kepala keluarga.
            </p>

          </div>

        </div>


        <div class="anggota-form-grid">

          <!-- HUBUNGAN -->

          <div class="anggota-form-field anggota-form-field-full">

            <label
              for="formAnggotaHubungan"
              class="anggota-form-label"
            >
              Hubungan dalam Kartu Keluarga
              <span class="required">*</span>
            </label>

            <select
              id="formAnggotaHubungan"
              name="HUBUNGAN_KELUARGA"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Hubungan
              </option>

              <option value="KEPALA_KELUARGA">
                Kepala Keluarga
              </option>

              <option value="ISTRI">
                Istri
              </option>

              <option value="ANAK">
                Anak
              </option>

              <option value="ORANG_TUA">
                Orang Tua
              </option>

              <option value="MERTUA">
                Mertua
              </option>

              <option value="MENANTU">
                Menantu
              </option>

              <option value="CUCU">
                Cucu
              </option>

              <option value="FAMILI_LAIN">
                Famili Lain
              </option>

            </select>

          </div>


          <!-- NAMA AYAH -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaNamaAyah"
              class="anggota-form-label"
            >
              Nama Ayah
            </label>

            <input
              type="text"
              id="formAnggotaNamaAyah"
              name="NAMA_AYAH"
              class="anggota-form-input"
              placeholder="Nama ayah"
            />

          </div>


          <!-- NAMA IBU -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaNamaIbu"
              class="anggota-form-label"
            >
              Nama Ibu
            </label>

            <input
              type="text"
              id="formAnggotaNamaIbu"
              name="NAMA_IBU"
              class="anggota-form-input"
              placeholder="Nama ibu"
            />

          </div>


          <!-- PENDIDIKAN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaPendidikan"
              class="anggota-form-label"
            >
              Pendidikan
            </label>

            <select
              id="formAnggotaPendidikan"
              name="PENDIDIKAN"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Pendidikan
              </option>

              <option value="TIDAK_BELUM_SEKOLAH">
                Tidak / Belum Sekolah
              </option>

              <option value="SD">
                SD / Sederajat
              </option>

              <option value="SMP">
                SMP / Sederajat
              </option>

              <option value="SMA">
                SMA / Sederajat
              </option>

              <option value="DIPLOMA">
                Diploma
              </option>

              <option value="SARJANA">
                Sarjana
              </option>

              <option value="MAGISTER">
                Magister
              </option>

              <option value="DOKTOR">
                Doktor
              </option>

            </select>

          </div>


          <!-- PEKERJAAN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaPekerjaan"
              class="anggota-form-label"
            >
              Pekerjaan
            </label>

            <input
              type="text"
              id="formAnggotaPekerjaan"
              name="PEKERJAAN"
              class="anggota-form-input"
              placeholder="Masukkan pekerjaan"
            />

          </div>

        </div>

      </div>


      <!-- =====================================
           DOKUMEN TAMBAHAN
      ====================================== -->

      <div class="anggota-form-section anggota-dokumen-section">

        <div class="anggota-form-section-header">

          <div class="anggota-form-section-icon">
            <i data-lucide="file-text"></i>
          </div>

          <div>

            <h3 class="anggota-form-section-title">
              Dokumen Tambahan
            </h3>

            <p class="anggota-form-section-description">
              Isi hanya jika penduduk memiliki dokumen tersebut.
            </p>

          </div>

        </div>


        <div class="anggota-form-grid">

          <!-- PASPOR -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaPaspor"
              class="anggota-form-label"
            >
              Nomor Paspor
            </label>

            <input
              type="text"
              id="formAnggotaPaspor"
              name="NO_PASPOR"
              class="anggota-form-input"
              placeholder="Opsional"
            />

          </div>


          <!-- KITAS -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaKitas"
              class="anggota-form-label"
            >
              Nomor KITAS
            </label>

            <input
              type="text"
              id="formAnggotaKitas"
              name="NO_KITAS"
              class="anggota-form-input"
              placeholder="Opsional"
            />

          </div>

        </div>

      </div>

    </div>

  `;
    },

    getTambahAnggotaFooter() {
      return `

    <button
      type="button"
      class="btn btn-secondary"
      data-modal-action="cancel"
    >
      Batal
    </button>

    <button
      type="button"
      class="btn btn-primary"
      data-modal-action="save-anggota"
    >
      <i data-lucide="save"></i>
      Simpan Anggota
    </button>

  `;
    },

    /* =====================================
       MODAL FOOTER
    ===================================== */

    getTambahKKFooter() {
      return `

        <div class="modal-footer-actions">

          <button
            type="button"
            class="btn btn-outline"
            data-modal-action="cancel"
          >

            Batal

          </button>


          <button
            type="button"
            class="btn btn-primary"
            data-modal-action="save-kk"
          >

            <i data-lucide="save"></i>

            <span>
              Simpan Kartu Keluarga
            </span>

          </button>

        </div>

      `;
    },

    /* =====================================
   MODAL EDIT ANGGOTA
===================================== */

    openEditAnggota(anggota) {
      if (typeof Modal === "undefined") {
        console.error("[KartuKeluargaView] Modal Engine tidak tersedia.");
        return;
      }

      if (!anggota) {
        console.error(
          "[KartuKeluargaView] Data anggota untuk edit tidak tersedia.",
        );
        return;
      }

      console.log("[KartuKeluargaView] openEditAnggota():", anggota);

      Modal.open({
        title: "Edit Anggota Keluarga",
        size: "lg",
        body: this.getEditAnggotaBody(anggota),
        footer: this.getEditAnggotaFooter(),
      });

      this.refreshIcons();
    },

    getEditAnggotaFooter() {
      return `
    <div class="modal-footer-actions">

      <button
        type="button"
        class="btn btn-secondary"
        data-modal-action="cancel"
      >
        Batal
      </button>

      <button
        type="button"
        class="btn btn-primary"
        data-modal-action="update-anggota"
      >
        <i data-lucide="save"></i>
        Simpan Perubahan
      </button>

    </div>
  `;
    },

    /* =====================================
   MODAL EDIT ANGGOTA - BODY
===================================== */

    getEditAnggotaBody(anggota) {
      const escape = (value) => {
        return String(value ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };

      const value = (field) => escape(anggota?.[field]);

      const selected = (field, option) => {
        return String(anggota?.[field] ?? "") === option ? "selected" : "";
      };

      const dateValue = (field) => {
        const raw = String(anggota?.[field] ?? "").trim();

        if (!raw) {
          return "";
        }

        // Format date murni: YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
          return raw;
        }

        // Format ISO dari Google Apps Script
        if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
          const date = new Date(raw);

          if (Number.isNaN(date.getTime())) {
            return "";
          }

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          return `${year}-${month}-${day}`;
        }

        // Format DD/MM/YYYY
        const slash = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

        if (slash) {
          const [, day, month, year] = slash;

          return `${year}-${month}-${day}`;
        }

        return "";
      };

      return `

    <div class="anggota-modal-form">

      <!-- =====================================
           ID PENDUDUK
      ====================================== -->

      <input
        type="hidden"
        id="formEditAnggotaId"
        value="${value("ID_PENDUDUK")}"
      />


      <!-- =====================================
           INFO KK
      ====================================== -->

      <div class="anggota-kk-info">

        <div class="anggota-kk-icon">
          <i data-lucide="house"></i>
        </div>

        <div class="anggota-kk-content">

          <div class="anggota-kk-label">
            Kartu Keluarga
          </div>

          <div class="anggota-kk-title">
            ${value("ID_KK")}
          </div>

          <div class="anggota-kk-meta">
            Data Anggota Keluarga
          </div>

        </div>

      </div>


      <!-- =====================================
           IDENTITAS
      ====================================== -->

      <div class="anggota-form-section">

        <div class="anggota-form-section-header">

          <div class="anggota-form-section-icon">
            <i data-lucide="user-round"></i>
          </div>

          <div>

            <h3 class="anggota-form-section-title">
              Data Identitas
            </h3>

            <p class="anggota-form-section-description">
              Perbarui identitas penduduk dalam kartu keluarga.
            </p>

          </div>

        </div>


        <div class="anggota-form-grid">

          <!-- NIK -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaNIK"
              class="anggota-form-label"
            >
              NIK
              <span class="required">*</span>
            </label>

            <input
              type="text"
              id="formAnggotaNIK"
              name="NIK"
              class="anggota-form-input"
              inputmode="numeric"
              maxlength="16"
              autocomplete="off"
              value="${value("NIK")}"
            />

            <small class="anggota-form-help">
              NIK harus terdiri dari 16 digit.
            </small>

          </div>


          <!-- NAMA -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaNama"
              class="anggota-form-label"
            >
              Nama Lengkap
              <span class="required">*</span>
            </label>

            <input
              type="text"
              id="formAnggotaNama"
              name="NAMA"
              class="anggota-form-input"
              autocomplete="off"
              value="${value("NAMA")}"
            />

          </div>


          <!-- TEMPAT LAHIR -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaTempatLahir"
              class="anggota-form-label"
            >
              Tempat Lahir
              <span class="required">*</span>
            </label>

            <input
              type="text"
              id="formAnggotaTempatLahir"
              name="TEMPAT_LAHIR"
              class="anggota-form-input"
              value="${value("TEMPAT_LAHIR")}"
            />

          </div>


          <!-- TANGGAL LAHIR -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaTanggalLahir"
              class="anggota-form-label"
            >
              Tanggal Lahir
              <span class="required">*</span>
            </label>

            <input
              type="date"
              id="formAnggotaTanggalLahir"
              name="TANGGAL_LAHIR"
              class="anggota-form-input"
              value="${dateValue("TANGGAL_LAHIR")}"
            />

          </div>


          <!-- JENIS KELAMIN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaJenisKelamin"
              class="anggota-form-label"
            >
              Jenis Kelamin
              <span class="required">*</span>
            </label>

            <select
              id="formAnggotaJenisKelamin"
              name="JENIS_KELAMIN"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Jenis Kelamin
              </option>

              <option
                value="LAKI-LAKI"
                ${selected("JENIS_KELAMIN", "LAKI-LAKI")}
              >
                Laki-laki
              </option>

              <option
                value="PEREMPUAN"
                ${selected("JENIS_KELAMIN", "PEREMPUAN")}
              >
                Perempuan
              </option>

            </select>

          </div>


          <!-- AGAMA -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaAgama"
              class="anggota-form-label"
            >
              Agama
              <span class="required">*</span>
            </label>

            <select
              id="formAnggotaAgama"
              name="AGAMA"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Agama
              </option>

              <option value="ISLAM" ${selected("AGAMA", "ISLAM")}>
                Islam
              </option>

              <option value="KRISTEN" ${selected("AGAMA", "KRISTEN")}>
                Kristen
              </option>

              <option value="KATOLIK" ${selected("AGAMA", "KATOLIK")}>
                Katolik
              </option>

              <option value="HINDU" ${selected("AGAMA", "HINDU")}>
                Hindu
              </option>

              <option value="BUDDHA" ${selected("AGAMA", "BUDDHA")}>
                Buddha
              </option>

              <option value="KONGHUCU" ${selected("AGAMA", "KONGHUCU")}>
                Konghucu
              </option>

            </select>

          </div>


          <!-- KEWARGANEGARAAN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaKewarganegaraan"
              class="anggota-form-label"
            >
              Kewarganegaraan
            </label>

            <select
              id="formAnggotaKewarganegaraan"
              name="KEWARGANEGARAAN"
              class="anggota-form-select"
            >

              <option
                value="WNI"
                ${selected("KEWARGANEGARAAN", "WNI")}
              >
                WNI
              </option>

              <option
                value="WNA"
                ${selected("KEWARGANEGARAAN", "WNA")}
              >
                WNA
              </option>

            </select>

          </div>


          <!-- STATUS PERKAWINAN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaStatusPerkawinan"
              class="anggota-form-label"
            >
              Status Perkawinan
            </label>

            <select
              id="formAnggotaStatusPerkawinan"
              name="STATUS_PERKAWINAN"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Status
              </option>

              <option
                value="BELUM_KAWIN"
                ${selected("STATUS_PERKAWINAN", "BELUM_KAWIN")}
              >
                Belum Kawin
              </option>

              <option
                value="KAWIN"
                ${selected("STATUS_PERKAWINAN", "KAWIN")}
              >
                Kawin
              </option>

              <option
                value="CERAI_HIDUP"
                ${selected("STATUS_PERKAWINAN", "CERAI_HIDUP")}
              >
                Cerai Hidup
              </option>

              <option
                value="CERAI_MATI"
                ${selected("STATUS_PERKAWINAN", "CERAI_MATI")}
              >
                Cerai Mati
              </option>

            </select>

          </div>

        </div>

      </div>


      <!-- =====================================
           HUBUNGAN KELUARGA
      ====================================== -->

      <div class="anggota-form-section">

        <div class="anggota-form-section-header">

          <div class="anggota-form-section-icon">
            <i data-lucide="users-round"></i>
          </div>

          <div>

            <h3 class="anggota-form-section-title">
              Hubungan Keluarga
            </h3>

            <p class="anggota-form-section-description">
              Tentukan hubungan penduduk dengan kepala keluarga.
            </p>

          </div>

        </div>


        <div class="anggota-form-grid">

          <!-- HUBUNGAN -->

          <div class="anggota-form-field anggota-form-field-full">

            <label
              for="formAnggotaHubungan"
              class="anggota-form-label"
            >
              Hubungan dalam Kartu Keluarga
              <span class="required">*</span>
            </label>

            <select
              id="formAnggotaHubungan"
              name="HUBUNGAN_KELUARGA"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Hubungan
              </option>

              <option
                value="KEPALA_KELUARGA"
                ${selected("HUBUNGAN_KELUARGA", "KEPALA_KELUARGA")}
              >
                Kepala Keluarga
              </option>

              <option
                value="ISTRI"
                ${selected("HUBUNGAN_KELUARGA", "ISTRI")}
              >
                Istri
              </option>

              <option
                value="ANAK"
                ${selected("HUBUNGAN_KELUARGA", "ANAK")}
              >
                Anak
              </option>

              <option
                value="ORANG_TUA"
                ${selected("HUBUNGAN_KELUARGA", "ORANG_TUA")}
              >
                Orang Tua
              </option>

              <option
                value="MERTUA"
                ${selected("HUBUNGAN_KELUARGA", "MERTUA")}
              >
                Mertua
              </option>

              <option
                value="MENANTU"
                ${selected("HUBUNGAN_KELUARGA", "MENANTU")}
              >
                Menantu
              </option>

              <option
                value="CUCU"
                ${selected("HUBUNGAN_KELUARGA", "CUCU")}
              >
                Cucu
              </option>

              <option
                value="FAMILI_LAIN"
                ${selected("HUBUNGAN_KELUARGA", "FAMILI_LAIN")}
              >
                Famili Lain
              </option>

            </select>

          </div>


          <!-- NAMA AYAH -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaNamaAyah"
              class="anggota-form-label"
            >
              Nama Ayah
            </label>

            <input
              type="text"
              id="formAnggotaNamaAyah"
              name="NAMA_AYAH"
              class="anggota-form-input"
              value="${value("NAMA_AYAH")}"
            />

          </div>


          <!-- NAMA IBU -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaNamaIbu"
              class="anggota-form-label"
            >
              Nama Ibu
            </label>

            <input
              type="text"
              id="formAnggotaNamaIbu"
              name="NAMA_IBU"
              class="anggota-form-input"
              value="${value("NAMA_IBU")}"
            />

          </div>


          <!-- PENDIDIKAN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaPendidikan"
              class="anggota-form-label"
            >
              Pendidikan
            </label>

            <select
              id="formAnggotaPendidikan"
              name="PENDIDIKAN"
              class="anggota-form-select"
            >

              <option value="">
                Pilih Pendidikan
              </option>

              <option
                value="TIDAK_BELUM_SEKOLAH"
                ${selected("PENDIDIKAN", "TIDAK_BELUM_SEKOLAH")}
              >
                Tidak / Belum Sekolah
              </option>

              <option
                value="SD"
                ${selected("PENDIDIKAN", "SD")}
              >
                SD / Sederajat
              </option>

              <option
                value="SMP"
                ${selected("PENDIDIKAN", "SMP")}
              >
                SMP / Sederajat
              </option>

              <option
                value="SMA"
                ${selected("PENDIDIKAN", "SMA")}
              >
                SMA / Sederajat
              </option>

              <option
                value="DIPLOMA"
                ${selected("PENDIDIKAN", "DIPLOMA")}
              >
                Diploma
              </option>

              <option
                value="SARJANA"
                ${selected("PENDIDIKAN", "SARJANA")}
              >
                Sarjana
              </option>

              <option
                value="MAGISTER"
                ${selected("PENDIDIKAN", "MAGISTER")}
              >
                Magister
              </option>

              <option
                value="DOKTOR"
                ${selected("PENDIDIKAN", "DOKTOR")}
              >
                Doktor
              </option>

            </select>

          </div>


          <!-- PEKERJAAN -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaPekerjaan"
              class="anggota-form-label"
            >
              Pekerjaan
            </label>

            <input
              type="text"
              id="formAnggotaPekerjaan"
              name="PEKERJAAN"
              class="anggota-form-input"
              value="${value("PEKERJAAN")}"
            />

          </div>

        </div>

      </div>


      <!-- =====================================
           DOKUMEN TAMBAHAN
      ====================================== -->

      <div class="anggota-form-section anggota-dokumen-section">

        <div class="anggota-form-section-header">

          <div class="anggota-form-section-icon">
            <i data-lucide="file-text"></i>
          </div>

          <div>

            <h3 class="anggota-form-section-title">
              Dokumen Tambahan
            </h3>

            <p class="anggota-form-section-description">
              Isi hanya jika penduduk memiliki dokumen tersebut.
            </p>

          </div>

        </div>


        <div class="anggota-form-grid">

          <!-- PASPOR -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaPaspor"
              class="anggota-form-label"
            >
              Nomor Paspor
            </label>

            <input
              type="text"
              id="formAnggotaPaspor"
              name="NO_PASPOR"
              class="anggota-form-input"
              placeholder="Opsional"
              value="${value("NO_PASPOR")}"
            />

          </div>


          <!-- KITAS -->

          <div class="anggota-form-field">

            <label
              for="formAnggotaKitas"
              class="anggota-form-label"
            >
              Nomor KITAS
            </label>

            <input
              type="text"
              id="formAnggotaKitas"
              name="NO_KITAS"
              class="anggota-form-input"
              placeholder="Opsional"
              value="${value("NO_KITAS")}"
            />

          </div>

        </div>

      </div>

    </div>

  `;
    },

    /* =====================================
       HELPER
    ===================================== */

    getLingkunganName(id) {
      const names = {
        L001: "Lingkungan I",

        L002: "Lingkungan II",

        L003: "Lingkungan III",

        L004: "Lingkungan IV",

        L005: "Lingkungan V",
      };

      return names[id] || id || "-";
    },

    /* =====================================
       FORMAT DATE
    ===================================== */

    formatDate(value) {
      if (!value) {
        return "-";
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },

    /* =====================================
       SET TEXT
    ===================================== */

    setText(id, value) {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = value ?? "-";
      }
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

  /* =====================================
     GLOBAL
  ===================================== */

  window.KartuKeluargaView = KartuKeluargaView;
})();
