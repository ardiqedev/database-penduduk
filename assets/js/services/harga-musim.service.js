/* =========================================
   HARGA MUSIM SERVICE
========================================= */

const HargaMusimService = {
  /* =====================================
     GET ALL
  ===================================== */

  async getAll(page = 1) {
    return DummyHargaMusim.getAll(page);
  },

  /* =====================================
     GET BY ID
  ===================================== */

  async getById(id) {
    return DummyHargaMusim.getById(id);
  },

  /* =====================================
     CREATE
  ===================================== */

  async create(data) {
    return DummyHargaMusim.create(data);
  },

  /* =====================================
     UPDATE
  ===================================== */

  async update(id, data) {
    return DummyHargaMusim.update(id, data);
  },

  /* =====================================
     DELETE
  ===================================== */

  async delete(id) {
    return DummyHargaMusim.delete(id);
  },
};
