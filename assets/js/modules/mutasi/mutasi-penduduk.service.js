/* =========================================
   MUTASI PENDUDUK SERVICE
========================================= */

const MutasiPendudukService = {
  /* =====================================
     GET ALL MUTASI
  ===================================== */

  async getMutasi() {
    const response = await API.get("getMutasi");

    if (!response || response.success === false) {
      throw new Error(
        response?.message || "Gagal mengambil data mutasi penduduk.",
      );
    }

    return response.data || [];
  },

  /* =====================================
   GET ALL KARTU KELUARGA
===================================== */

  async getKK() {
    const response = await API.get("getKK");

    if (!response || response.success === false) {
      throw new Error(
        response?.message || "Gagal mengambil data Kartu Keluarga.",
      );
    }

    return response.data || [];
  },

  /* =====================================
   GET ALL PENDUDUK
===================================== */

  async getPenduduk() {
    const response = await API.get("getPenduduk");

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal mengambil data penduduk.");
    }

    return response.data || [];
  },

  /* =====================================
     GET MUTASI BY ID
  ===================================== */

  async getMutasiById(idMutasi) {
    if (!idMutasi) {
      return null;
    }

    const response = await API.get("getMutasiDetail", {
      idMutasi,
    });

    if (!response || response.success === false) {
      throw new Error(
        response?.message || "Gagal mengambil detail mutasi penduduk.",
      );
    }

    return response.data || null;
  },

  /* =====================================
     GET MUTASI BY PENDUDUK
  ===================================== */

  async getMutasiByPenduduk(idPenduduk) {
    if (!idPenduduk) {
      return [];
    }

    const response = await API.get("getMutasiByPenduduk", {
      idPenduduk,
    });

    if (!response || response.success === false) {
      throw new Error(
        response?.message || "Gagal mengambil riwayat mutasi penduduk.",
      );
    }

    return response.data || [];
  },

  /* =====================================
     GET MUTASI BY KK
  ===================================== */

  async getMutasiByKK(idKK) {
    if (!idKK) {
      return [];
    }

    const response = await API.get("getMutasiByKK", {
      idKK,
    });

    if (!response || response.success === false) {
      throw new Error(
        response?.message || "Gagal mengambil mutasi Kartu Keluarga.",
      );
    }

    return response.data || [];
  },

  /* =====================================
     JENIS MUTASI
  ===================================== */

  getJenisMutasiOptions() {
    return [
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
  },

  /* =====================================
     LINGKUNGAN OPTIONS
  ===================================== */

  getLingkunganOptions() {
    return [
      {
        value: "L001",
        label: "Lingkungan I",
      },
      {
        value: "L002",
        label: "Lingkungan II",
      },
      {
        value: "L003",
        label: "Lingkungan III",
      },
      {
        value: "L004",
        label: "Lingkungan IV",
      },
      {
        value: "L005",
        label: "Lingkungan V",
      },
    ];
  },

  /* =====================================
     VALIDASI MUTASI
  ===================================== */

  validateMutasi(data) {
    const errors = {};

    /* -------------------------------------
       ID PENDUDUK
    ------------------------------------- */

    if (!String(data?.ID_PENDUDUK || "").trim()) {
      errors.ID_PENDUDUK = "Penduduk wajib dipilih.";
    }

    /* -------------------------------------
       JENIS MUTASI
    ------------------------------------- */

    const jenisMutasi = String(data?.JENIS_MUTASI || "")
      .trim()
      .toUpperCase();

    if (!jenisMutasi) {
      errors.JENIS_MUTASI = "Jenis mutasi wajib dipilih.";
    } else {
      const allowedTypes = [
        "LAHIR",
        "MENINGGAL",
        "PINDAH_DATANG",
        "PINDAH_KELUAR",
      ];

      if (!allowedTypes.includes(jenisMutasi)) {
        errors.JENIS_MUTASI = "Jenis mutasi tidak valid.";
      }
    }

    /* -------------------------------------
       TANGGAL MUTASI
    ------------------------------------- */

    if (!String(data?.TANGGAL_MUTASI || "").trim()) {
      errors.TANGGAL_MUTASI = "Tanggal mutasi wajib diisi.";
    }

    return {
      valid: Object.keys(errors).length === 0,

      errors,
    };
  },

  /* =====================================
     SAVE MUTASI
  ===================================== */

  async saveMutasi(data) {
    const validation = this.validateMutasi(data);

    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];

      throw new Error(firstError || "Data mutasi tidak valid.");
    }

    const payload = {
      ID_PENDUDUK: String(data.ID_PENDUDUK || "").trim(),

      JENIS_MUTASI: String(data.JENIS_MUTASI || "")
        .trim()
        .toUpperCase(),

      TANGGAL_MUTASI: data.TANGGAL_MUTASI,

      KETERANGAN: String(data.KETERANGAN || "").trim(),

      CREATED_BY: String(data.CREATED_BY || "").trim(),
    };

    const response = await API.post("saveMutasi", payload);

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal menyimpan data mutasi.");
    }

    return response.data;
  },

  /* =====================================
   UPDATE MUTASI
===================================== */

  async updateMutasi(data) {
    console.log("[MutasiPendudukService] Update mutasi:", data);

    /* ---------------------------------
     VALIDASI
  --------------------------------- */

    if (!data?.ID_MUTASI) {
      throw new Error("ID_MUTASI wajib diisi.");
    }

    const validation = this.validateMutasi(data);

    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];

      throw new Error(firstError || "Data mutasi tidak valid.");
    }

    /* ---------------------------------
     PAYLOAD
  --------------------------------- */

    const payload = {
      ID_MUTASI: String(data.ID_MUTASI || "").trim(),

      ID_PENDUDUK: String(data.ID_PENDUDUK || "").trim(),

      JENIS_MUTASI: String(data.JENIS_MUTASI || "")
        .trim()
        .toUpperCase(),

      TANGGAL_MUTASI: data.TANGGAL_MUTASI,

      KETERANGAN: String(data.KETERANGAN || "").trim(),

      UPDATED_BY: String(data.UPDATED_BY || "").trim(),
    };

    console.log("[MutasiPendudukService] Payload update:", payload);

    /* ---------------------------------
     API
  --------------------------------- */

    const response = await API.post("updateMutasi", payload);

    /* ---------------------------------
     RESPONSE
  --------------------------------- */

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal memperbarui data mutasi.");
    }

    return response.data;
  },

  /* =====================================
     UPDATE MUTASI
  ===================================== */

  async updateMutasi(data) {
    const validation = this.validateMutasi(data);

    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];

      throw new Error(firstError || "Data mutasi tidak valid.");
    }

    /* -------------------------------------
       ID MUTASI
    ------------------------------------- */

    if (!String(data.ID_MUTASI || "").trim()) {
      throw new Error("ID_MUTASI wajib diisi.");
    }

    /* -------------------------------------
       PAYLOAD
    ------------------------------------- */

    const payload = {
      ID_MUTASI: String(data.ID_MUTASI || "").trim(),

      ID_PENDUDUK: String(data.ID_PENDUDUK || "").trim(),

      JENIS_MUTASI: String(data.JENIS_MUTASI || "")
        .trim()
        .toUpperCase(),

      TANGGAL_MUTASI: data.TANGGAL_MUTASI,

      KETERANGAN: String(data.KETERANGAN || "").trim(),
    };

    console.log("[MutasiPendudukService] Update mutasi:", payload);

    /* -------------------------------------
       API
    ------------------------------------- */

    const response = await API.post("updateMutasi", payload);

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal memperbarui data mutasi.");
    }

    return response.data;
  },

  /* =====================================
   DELETE MUTASI
===================================== */

  /* =====================================
   DELETE MUTASI
===================================== */

  async deleteMutasi(idMutasi) {
    if (!idMutasi) {
      throw new Error("ID_MUTASI wajib diisi.");
    }

    const payload = {
      ID_MUTASI: String(idMutasi).trim(),
    };

    console.log("[MutasiPendudukService] Delete mutasi:", payload);

    /* ---------------------------------
     API
  --------------------------------- */

    const response = await API.post("deleteMutasi", payload);

    /* ---------------------------------
     RESPONSE
  --------------------------------- */

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal menghapus data mutasi.");
    }

    return response.data;
  },
};
