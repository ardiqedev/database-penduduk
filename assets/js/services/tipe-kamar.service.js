/* =========================================
   TIPE KAMAR SERVICE
========================================= */

const TipeKamarService = {
  /* =====================================
     GET ALL
  ===================================== */

  async getAll(page = 1) {
    return DummyTipeKamar.getAll(page);
  },

  /* =====================================
     GET BY ID
  ===================================== */

  async getById(id) {
    return DummyTipeKamar.getById(id);
  },

  /* =====================================
     CREATE
  ===================================== */

  async create(data) {
    return DummyTipeKamar.create(data);
  },

  /* =====================================
     UPDATE
  ===================================== */

  async update(id, data) {
    return DummyTipeKamar.update(id, data);
  },

  /* =====================================
     DELETE
  ===================================== */

  async remove(id) {
    return DummyTipeKamar.remove(id);
  },
};
