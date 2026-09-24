/* =========================================
   KARTU KELUARGA SERVICE
========================================= */

const KartuKeluargaService = {
  /* =====================================
     GET ALL KK
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
     GET KK WITH MEMBER COUNT
  ===================================== */

  async getKKWithMemberCount() {
    const data = await this.getKK();

    /*
     * Backend saat ini menjadi sumber data utama.
     * Jika backend sudah mengirim JUMLAH_ANGGOTA,
     * langsung gunakan.
     */

    return data.map((item) => ({
      ...item,

      JUMLAH_ANGGOTA:
        item.JUMLAH_ANGGOTA !== undefined
          ? Number(item.JUMLAH_ANGGOTA) || 0
          : 0,
    }));
  },

  /* =====================================
     GET KK DETAIL
  ===================================== */

  async getKKById(idKK) {
    if (!idKK) {
      return null;
    }

    const response = await API.get("getKKDetail", {
      idKK,
    });

    if (!response || response.success === false) {
      throw new Error(
        response?.message || "Gagal mengambil detail Kartu Keluarga.",
      );
    }

    return response.data || null;
  },

  /* =====================================
     GET ANGGOTA KK
  ===================================== */

  async getAnggota(idKK) {
    if (!idKK) {
      return [];
    }

    const response = await API.get("getPendudukByKK", {
      idKK,
    });

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal mengambil anggota keluarga.");
    }

    return response.data || [];
  },

  /* =====================================
   GET PENDUDUK DETAIL
===================================== */

  async getPendudukById(idPenduduk) {
    if (!idPenduduk) {
      return null;
    }

    const response = await API.get("getPendudukDetail", {
      idPenduduk,
    });

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal mengambil detail penduduk.");
    }

    return response.data || null;
  },

  /* =====================================
     VALIDASI KK
  ===================================== */

  validateKK(data) {
    const errors = {};

    const noKK = String(data?.NO_KK || "").trim();

    if (!noKK) {
      errors.NO_KK = "Nomor KK wajib diisi.";
    } else if (!/^\d{16}$/.test(noKK)) {
      errors.NO_KK = "Nomor KK harus terdiri dari 16 digit.";
    }

    if (!String(data?.ALAMAT || "").trim()) {
      errors.ALAMAT = "Alamat wajib diisi.";
    }

    if (!String(data?.ID_LINGKUNGAN || "").trim()) {
      errors.ID_LINGKUNGAN = "Lingkungan wajib dipilih.";
    }

    if (!String(data?.ID_RT || "").trim()) {
      errors.ID_RT = "RT wajib dipilih.";
    }

    if (
      data?.DESIL_DTSEN !== undefined &&
      data?.DESIL_DTSEN !== null &&
      data?.DESIL_DTSEN !== ""
    ) {
      const desil = Number(data.DESIL_DTSEN);

      if (!Number.isInteger(desil) || desil < 1 || desil > 10) {
        errors.DESIL_DTSEN = "Desil DTSEN harus 1 sampai 10.";
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /* =====================================
     STATUS OPTIONS
  ===================================== */

  getStatusOptions() {
    return ["AKTIF", "NONAKTIF"];
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
   SAVE KK
===================================== */

  async saveKK(data) {
    const response = await API.post("saveKK", data);

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal menyimpan Kartu Keluarga.");
    }

    return response.data;
  },
  /* =====================================
   SAVE PENDUDUK
===================================== */

  async savePenduduk(data) {
    const response = await API.post("savePenduduk", data);

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal menyimpan penduduk.");
    }

    return response.data;
  },

  /* =====================================
   UPDATE PENDUDUK
===================================== */

  async updatePenduduk(data) {
    const response = await API.post("updatePenduduk", data);

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal memperbarui data penduduk.");
    }

    return response.data;
  },

  /* =====================================
   UPDATE KK
===================================== */

  async updateKK(data) {
    const response = await API.post("updateKK", data);

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal memperbarui Kartu Keluarga.");
    }

    return response.data;
  },

  /* =====================================
     DELETE KK
  ===================================== */

  async deleteKK(idKK) {
    if (!idKK) {
      throw new Error("ID Kartu Keluarga tidak ditemukan.");
    }

    const response = await API.post("deleteKK", {
      ID_KK: idKK,
    });

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal menghapus Kartu Keluarga.");
    }

    return response.data;
  },

  /* =====================================
     DELETE PENDUDUK
  ===================================== */
  async deletePenduduk(idPenduduk) {
    if (!idPenduduk) {
      throw new Error("ID penduduk tidak ditemukan.");
    }

    const response = await API.post("deletePenduduk", {
      ID_PENDUDUK: idPenduduk,
    });

    if (!response || response.success === false) {
      throw new Error(response?.message || "Gagal menghapus data penduduk.");
    }

    return response.data;
  },
};
