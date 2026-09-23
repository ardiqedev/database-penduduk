/* =========================================
   DATABASE WARGA
   DASHBOARD MODULE
========================================= */

(() => {
  "use strict";

  const Dashboard = {
    /* =====================================
       STATE
    ===================================== */

    state: {
      kk: [],
      penduduk: [],
      mutasi: [],
      loading: false,
      error: null,
    },

    /* =====================================
       INIT
    ===================================== */

    async init() {
      console.log("Dashboard.init()");

      this.bindEvents();

      await this.loadData();
    },

    /* =====================================
       EVENTS
    ===================================== */

    bindEvents() {
      const refreshButton = document.querySelector(
        '[data-action="refresh-dashboard"]',
      );

      if (!refreshButton || refreshButton.dataset.bound === "true") {
        return;
      }

      refreshButton.dataset.bound = "true";

      refreshButton.addEventListener("click", async () => {
        await this.refresh();
      });
    },

    /* =====================================
       LOAD DATA
    ===================================== */

    async loadData() {
      try {
        this.state.loading = true;
        this.state.error = null;

        console.log("Dashboard: loading data...");

        const [kkResponse, pendudukResponse, mutasiResponse] =
          await Promise.all([
            API.get("getKK"),
            API.get("getPenduduk"),
            API.get("getMutasi"),
          ]);

        this.state.kk = Array.isArray(kkResponse.data) ? kkResponse.data : [];

        this.state.penduduk = Array.isArray(pendudukResponse.data)
          ? pendudukResponse.data
          : [];

        this.state.mutasi = Array.isArray(mutasiResponse.data)
          ? mutasiResponse.data
          : [];

        console.log("DASHBOARD DATA:", {
          kk: this.state.kk,
          penduduk: this.state.penduduk,
          mutasi: this.state.mutasi,
        });

        this.render();
      } catch (error) {
        this.handleError(error);
      } finally {
        this.state.loading = false;
      }
    },

    /* =====================================
       RENDER
    ===================================== */

    render() {
      this.renderSummary();
      this.renderWilayah();
      this.renderMutasi();
      this.renderDesil();
      this.renderRecentMutasi();

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    },

    /* =====================================
       SUMMARY
    ===================================== */

    renderSummary() {
      const activeKK = this.state.kk.filter(
        (item) => String(item.STATUS_KK || "").toUpperCase() === "AKTIF",
      );

      const totalKK = activeKK.length;

      const totalPenduduk = this.state.penduduk.length;

      const totalLaki = this.state.penduduk.filter(
        (item) => this.normalizeGender(item.JENIS_KELAMIN) === "LAKI-LAKI",
      ).length;

      const totalPerempuan = this.state.penduduk.filter(
        (item) => this.normalizeGender(item.JENIS_KELAMIN) === "PEREMPUAN",
      ).length;

      this.setText("totalKK", totalKK);

      this.setText("totalPenduduk", totalPenduduk);

      this.setText("totalLaki", totalLaki);

      this.setText("totalPerempuan", totalPerempuan);
    },

    /* =====================================
       REKAP WILAYAH
    ===================================== */

    renderWilayah() {
      const wilayah = [
        {
          id: "L001",
          kk: "wilayahKKL001",
          penduduk: "wilayahPendudukL001",
        },
        {
          id: "L002",
          kk: "wilayahKKL002",
          penduduk: "wilayahPendudukL002",
        },
        {
          id: "L003",
          kk: "wilayahKKL003",
          penduduk: "wilayahPendudukL003",
        },
        {
          id: "L004",
          kk: "wilayahKKL004",
          penduduk: "wilayahPendudukL004",
        },
        {
          id: "L005",
          kk: "wilayahKKL005",
          penduduk: "wilayahPendudukL005",
        },
      ];

      wilayah.forEach((item) => {
        const kkWilayah = this.state.kk.filter(
          (kk) => String(kk.ID_LINGKUNGAN || "").toUpperCase() === item.id,
        );

        const kkIds = new Set(kkWilayah.map((kk) => String(kk.ID_KK || "")));

        const pendudukWilayah = this.state.penduduk.filter((penduduk) =>
          kkIds.has(String(penduduk.ID_KK || "")),
        );

        this.setText(item.kk, kkWilayah.length);

        this.setText(item.penduduk, pendudukWilayah.length);
      });
    },

    /* =====================================
       MUTASI
    ===================================== */

    renderMutasi() {
      const currentYear = new Date().getFullYear();

      this.setText("mutasiTahun", "Tahun " + currentYear);

      const mutasiTahunIni = this.state.mutasi.filter((item) => {
        const date = this.parseDate(item.TANGGAL_MUTASI);

        if (!date) {
          return false;
        }

        return date.getFullYear() === currentYear;
      });

      const lahir = this.countMutation(mutasiTahunIni, "LAHIR");

      const meninggal = this.countMutation(mutasiTahunIni, "MENINGGAL");

      const pindahDatang = this.countMutation(mutasiTahunIni, "PINDAH_DATANG");

      const pindahKeluar = this.countMutation(mutasiTahunIni, "PINDAH_KELUAR");

      this.setText("mutasiLahir", lahir);

      this.setText("mutasiMeninggal", meninggal);

      this.setText("mutasiPindahDatang", pindahDatang);

      this.setText("mutasiPindahKeluar", pindahKeluar);
    },

    /* =====================================
       DESIL DTSEN
    ===================================== */

    renderDesil() {
      const desil = {};

      for (let i = 1; i <= 10; i++) {
        desil[i] = 0;
      }

      let belumAda = 0;

      this.state.kk.forEach((kk) => {
        const value = String(kk.DESIL_DTSEN ?? "").trim();

        if (!value) {
          belumAda++;
          return;
        }

        const number = Number(value);

        if (Number.isInteger(number) && number >= 1 && number <= 10) {
          desil[number]++;
        } else {
          belumAda++;
        }
      });

      for (let i = 1; i <= 10; i++) {
        this.setText("desil" + i, desil[i]);
      }

      this.setText("desilBelumAda", belumAda);
    },

    /* =====================================
       MUTASI TERBARU
    ===================================== */

    renderRecentMutasi() {
      const container = document.getElementById("recentMutasi");

      if (!container) {
        return;
      }

      const recent = [...this.state.mutasi]
        .sort((a, b) => {
          const dateA = this.parseDate(a.TANGGAL_MUTASI);

          const dateB = this.parseDate(b.TANGGAL_MUTASI);

          return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
        })
        .slice(0, 5);

      if (!recent.length) {
        container.innerHTML = `
          <div class="empty-state">
            <i data-lucide="inbox"></i>
            <span>Belum ada data mutasi.</span>
          </div>
        `;

        return;
      }

      container.innerHTML = recent
        .map((item) => {
          const type = String(item.JENIS_MUTASI || "").toUpperCase();

          const label = this.getMutationLabel(type);

          const icon = this.getMutationIcon(type);

          const date = this.formatDate(item.TANGGAL_MUTASI);

          const name = this.getPendudukName(item.ID_PENDUDUK);

          const keterangan = item.KETERANGAN || "";

          return `
            <div class="activity-item">

              <div class="activity-icon">
                <i data-lucide="${icon}"></i>
              </div>

              <div class="activity-content">

                <strong>
                  ${this.escapeHtml(label)}
                </strong>

                <span>
                  ${this.escapeHtml(name)}
                </span>

                <small>
                  ${this.escapeHtml(date)}
                  ${keterangan ? " • " + this.escapeHtml(keterangan) : ""}
                </small>

              </div>

            </div>
          `;
        })
        .join("");

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    },

    /* =====================================
       HELPERS
    ===================================== */

    countMutation(data, type) {
      return data.filter(
        (item) => String(item.JENIS_MUTASI || "").toUpperCase() === type,
      ).length;
    },

    getPendudukName(idPenduduk) {
      const item = this.state.penduduk.find(
        (penduduk) =>
          String(penduduk.ID_PENDUDUK || "") === String(idPenduduk || ""),
      );

      return item?.NAMA || idPenduduk || "-";
    },

    getMutationLabel(type) {
      const labels = {
        LAHIR: "Lahir",
        MENINGGAL: "Meninggal",
        PINDAH_DATANG: "Pindah Datang",
        PINDAH_KELUAR: "Pindah Keluar",
      };

      return labels[type] || type;
    },

    getMutationIcon(type) {
      const icons = {
        LAHIR: "baby",
        MENINGGAL: "heart",
        PINDAH_DATANG: "log-in",
        PINDAH_KELUAR: "log-out",
      };

      return icons[type] || "activity";
    },

    normalizeGender(value) {
      const gender = String(value || "")
        .trim()
        .toUpperCase();

      if (gender === "LAKI-LAKI" || gender === "LAKI LAKI" || gender === "L") {
        return "LAKI-LAKI";
      }

      if (gender === "PEREMPUAN" || gender === "P") {
        return "PEREMPUAN";
      }

      return gender;
    },

    parseDate(value) {
      if (!value) {
        return null;
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return null;
      }

      return date;
    },

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

    setText(id, value) {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = value ?? 0;
      }
    },

    escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    /* =====================================
       REFRESH
    ===================================== */

    async refresh() {
      await this.loadData();

      if (typeof Toast !== "undefined" && Toast.success) {
        Toast.success("Data dashboard berhasil diperbarui.");
      }
    },

    /* =====================================
       ERROR
    ===================================== */

    handleError(error) {
      console.error("DASHBOARD ERROR:", error);

      this.state.error = error;

      if (typeof Toast !== "undefined" && Toast.error) {
        Toast.error(error.message || "Gagal memuat data dashboard.");
      }
    },
  };

  /* =====================================
     GLOBAL
  ===================================== */

  window.Dashboard = Dashboard;
})();
