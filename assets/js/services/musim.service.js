/* =========================================
   MUSIM SERVICE
========================================= */

const MusimService = {
  /* =====================================
     GET ALL
  ===================================== */

  async getAll(page = 1) {
    return DummyMusim.getAll(page);
  },

  /* =====================================
     GET BY ID
  ===================================== */

  async getById(id) {
    return DummyMusim.getById(id);
  },

  /* =====================================
     CREATE
  ===================================== */

  async create(data) {
    return DummyMusim.create(data);
  },

  /* =====================================
     UPDATE
  ===================================== */

  async update(id, data) {
    return DummyMusim.update(id, data);
  },

  /* =====================================
     DELETE
  ===================================== */

  async delete(id) {
    return DummyMusim.delete(id);
  },
};
