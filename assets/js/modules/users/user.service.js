/* =========================================
   USER SERVICE
========================================= */

const UserService = (() => {
  /* =====================================
       LIST
  ===================================== */

  async function getAll(params = {}) {
    const response = await API.post("user.list", params);

    return response.data || [];
  }

  /* =====================================
       GET DETAIL
  ===================================== */

  async function get(id) {
    if (!id) {
      throw new Error("ID User wajib diisi.");
    }

    const response = await API.post("user.get", {
      id,
    });

    return response.data || null;
  }

  /* =====================================
       ACTIVE USERS
  ===================================== */

  async function getActive() {
    const response = await API.post("user.active", {});

    return response.data || [];
  }

  /* =====================================
       BY USERNAME
  ===================================== */

  async function getByUsername(username) {
    if (!username) {
      throw new Error("Username wajib diisi.");
    }

    const response = await API.post("user.byUsername", {
      username,
    });

    return response.data || null;
  }

  /* =====================================
       BY ROLE
  ===================================== */

  async function getByRole(role) {
    if (!role) {
      throw new Error("Role wajib diisi.");
    }

    const response = await API.post("user.byRole", {
      role,
    });

    return response.data || [];
  }

  /* =====================================
       PUBLIC
  ===================================== */

  return {
    getAll,

    get,

    getActive,

    getByUsername,

    getByRole,
  };
})();
