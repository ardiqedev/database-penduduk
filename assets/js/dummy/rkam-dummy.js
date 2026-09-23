/* =========================================
   QEDEV RKAM DUMMY
========================================= */

const RKAMDummy = (() => {
  /* =====================================
       Programs
    ===================================== */

  const programs = [
    {
      id: "PR001",
      code: "STD-ISI",
      name: "Pengembangan Standar Isi",
      icon: "book-open",
      color: "#2563eb",
    },

    {
      id: "PR002",
      code: "STD-PROSES",
      name: "Pengembangan Standar Proses",
      icon: "clipboard-list",
      color: "#10b981",
    },

    {
      id: "PR003",
      code: "STD-LULUS",
      name: "Pengembangan Standar Kompetensi Kelulusan",
      icon: "graduation-cap",
      color: "#8b5cf6",
    },

    {
      id: "PR004",
      code: "STD-PTK",
      name: "Pengembangan Standar PTK",
      icon: "users",
      color: "#f59e0b",
    },

    {
      id: "PR005",
      code: "STD-SARPRAS",
      name: "Pengembangan Standar Sarana dan Prasarana",
      icon: "building",
      color: "#ef4444",
    },

    {
      id: "PR006",
      code: "STD-PENGELOLAAN",
      name: "Pengembangan Standar Pengelolaan",
      icon: "briefcase",
      color: "#06b6d4",
    },

    {
      id: "PR007",
      code: "STD-PEMBIAYAAN",
      name: "Pengembangan Standar Pembiayaan",
      icon: "wallet",
      color: "#14b8a6",
    },

    {
      id: "PR008",
      code: "STD-PENILAIAN",
      name: "Pengembangan Standar Penilaian",
      icon: "clipboard-check",
      color: "#ec4899",
    },
  ];

  /* =====================================
       Activities
    ===================================== */

  const activities = [
    /* =====================================
           PR001
        ===================================== */

    {
      id: "ACT001",
      programId: "PR001",
      name: "Pengadaan Buku Paket",
      funding: "BOS",
      budget: 5000000,
      realization: 1200000,
    },

    {
      id: "ACT002",
      programId: "PR001",
      name: "Pengadaan Modul Pembelajaran",
      funding: "BOS",
      budget: 3500000,
      realization: 0,
    },

    {
      id: "ACT003",
      programId: "PR001",
      name: "Workshop Kurikulum",
      funding: "Komite",
      budget: 7000000,
      realization: 2500000,
    },

    /* =====================================
           PR002
        ===================================== */

    {
      id: "ACT004",
      programId: "PR002",
      name: "Pelatihan Metode Mengajar",
      funding: "BOS",
      budget: 4500000,
      realization: 1500000,
    },

    {
      id: "ACT005",
      programId: "PR002",
      name: "Supervisi Pembelajaran",
      funding: "BOS",
      budget: 2500000,
      realization: 0,
    },

    {
      id: "ACT006",
      programId: "PR002",
      name: "Penyusunan Modul Ajar",
      funding: "Komite",
      budget: 4000000,
      realization: 500000,
    },

    /* =====================================
           PR003
        ===================================== */

    {
      id: "ACT007",
      programId: "PR003",
      name: "Try Out Madrasah",
      funding: "BOS",
      budget: 6000000,
      realization: 3200000,
    },

    {
      id: "ACT008",
      programId: "PR003",
      name: "Pembinaan Lulusan",
      funding: "Komite",
      budget: 3000000,
      realization: 0,
    },

    {
      id: "ACT009",
      programId: "PR003",
      name: "Bimbingan Intensif",
      funding: "BOS",
      budget: 4500000,
      realization: 1000000,
    },

    /* =====================================
           PR004
        ===================================== */

    {
      id: "ACT010",
      programId: "PR004",
      name: "Pelatihan Guru",
      funding: "BOS",
      budget: 5000000,
      realization: 1800000,
    },

    {
      id: "ACT011",
      programId: "PR004",
      name: "Workshop PTK",
      funding: "Komite",
      budget: 2500000,
      realization: 0,
    },

    {
      id: "ACT012",
      programId: "PR004",
      name: "Seminar Pendidikan",
      funding: "BOS",
      budget: 3000000,
      realization: 500000,
    },

    /* =====================================
           PR005
        ===================================== */

    {
      id: "ACT013",
      programId: "PR005",
      name: "Pengadaan Meja Kursi",
      funding: "DAK",
      budget: 12000000,
      realization: 5000000,
    },

    {
      id: "ACT014",
      programId: "PR005",
      name: "Renovasi Ruang Kelas",
      funding: "DAK",
      budget: 20000000,
      realization: 10000000,
    },

    {
      id: "ACT015",
      programId: "PR005",
      name: "Pengadaan LCD Proyektor",
      funding: "BOS",
      budget: 7000000,
      realization: 0,
    },

    /* =====================================
           PR006
        ===================================== */

    {
      id: "ACT016",
      programId: "PR006",
      name: "Rapat Evaluasi",
      funding: "BOS",
      budget: 2000000,
      realization: 500000,
    },

    {
      id: "ACT017",
      programId: "PR006",
      name: "Monitoring Internal",
      funding: "BOS",
      budget: 1500000,
      realization: 0,
    },

    {
      id: "ACT018",
      programId: "PR006",
      name: "Pengembangan SOP",
      funding: "Komite",
      budget: 3000000,
      realization: 1200000,
    },

    /* =====================================
           PR007
        ===================================== */

    {
      id: "ACT019",
      programId: "PR007",
      name: "Penyusunan RKAM",
      funding: "BOS",
      budget: 2500000,
      realization: 500000,
    },

    {
      id: "ACT020",
      programId: "PR007",
      name: "Monitoring Anggaran",
      funding: "BOS",
      budget: 1800000,
      realization: 0,
    },

    {
      id: "ACT021",
      programId: "PR007",
      name: "Audit Internal",
      funding: "Komite",
      budget: 3500000,
      realization: 1000000,
    },

    /* =====================================
           PR008
        ===================================== */

    {
      id: "ACT022",
      programId: "PR008",
      name: "Penyusunan Soal",
      funding: "BOS",
      budget: 3000000,
      realization: 1000000,
    },

    {
      id: "ACT023",
      programId: "PR008",
      name: "Penilaian Akhir Semester",
      funding: "BOS",
      budget: 4500000,
      realization: 2500000,
    },

    {
      id: "ACT024",
      programId: "PR008",
      name: "Evaluasi Hasil Belajar",
      funding: "Komite",
      budget: 2000000,
      realization: 0,
    },
  ];

  /* =====================================
       Programs
    ===================================== */

  function getPrograms() {
    return [...programs];
  }

  function getProgramById(id) {
    return programs.find((program) => program.id === id) || null;
  }

  /* =====================================
       Activities
    ===================================== */

  function getActivities() {
    return [...activities];
  }

  function getActivitiesByProgram(programId) {
    return activities.filter((activity) => activity.programId === programId);
  }

  function getActivityById(id) {
    return activities.find((activity) => activity.id === id) || null;
  }

  /* =====================================
   Summary
===================================== */

  function getProgramSummary(programId) {
    const items = getActivitiesByProgram(programId);

    const totalBudget = items.reduce((sum, item) => sum + item.budget, 0);

    const totalRealization = items.reduce(
      (sum, item) => sum + item.realization,
      0,
    );

    const remainingBudget = totalBudget - totalRealization;

    const progress =
      totalBudget === 0
        ? 0
        : Math.round((totalRealization / totalBudget) * 100);

    return {
      totalActivity: items.length,

      totalBudget,

      totalRealization,

      remainingBudget,

      progress,
    };
  }

  /* =====================================
   Dashboard
===================================== */

  function getDashboard(programId = null) {
    const items = programId
      ? getActivitiesByProgram(programId)
      : getActivities();

    const totalBudget = items.reduce((sum, item) => sum + item.budget, 0);

    const totalRealization = items.reduce(
      (sum, item) => sum + item.realization,
      0,
    );

    const remainingBudget = totalBudget - totalRealization;

    const progress =
      totalBudget === 0
        ? 0
        : Math.round((totalRealization / totalBudget) * 100);

    return {
      totalProgram: programId ? 1 : programs.length,

      totalActivity: items.length,

      totalBudget,

      totalRealization,

      remainingBudget,

      progress,
    };
  }

  /* =====================================
   Activity Detail
===================================== */

  function getActivityDetail(id) {
    const activity = getActivityById(id);

    if (!activity) {
      return null;
    }

    return {
      ...activity,

      remaining: activity.budget - activity.realization,

      progress:
        activity.budget === 0
          ? 0
          : Math.round((activity.realization / activity.budget) * 100),
    };
  }

  /* =====================================
       Public
    ===================================== */
  return {
    getPrograms,

    getProgramById,

    getActivities,

    getActivitiesByProgram,

    getActivityById,

    getProgramSummary,

    getDashboard,

    getActivityDetail,
  };
})();
