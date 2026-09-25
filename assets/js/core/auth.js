/* =========================================
   QEDEV AUTH / SESSION
========================================= */

const Auth = {};

/* =========================================
   CONFIG
========================================= */

Auth.config = {
  sessionKey: "dbwarga_session",
};

/* =========================================
   INIT / RESTORE SESSION
========================================= */

/* =========================================
   INIT / RESTORE SESSION
========================================= */

Auth.init = async function () {
  /* =====================================
     RESTORE SESSION DARI STORAGE
  ===================================== */

  const session = Storage.get(this.config.sessionKey, null);

  /* =====================================
     SESSION LOKAL TIDAK ADA
  ===================================== */

  if (!session || !session.authenticated || !session.sessionId) {
    State.remove("session");

    return false;
  }

  /* =====================================
     VALIDASI SESSION KE BACKEND
  ===================================== */

  try {
    const response = await API.post("validateSession", {
      sessionId: session.sessionId,
    });

    /* ===================================
       SESSION TIDAK VALID
    =================================== */

    if (!response || !response.success || !response.data) {
      Storage.remove(this.config.sessionKey);

      State.remove("session");

      return false;
    }

    /* ===================================
       UPDATE DATA SESSION
       DARI BACKEND
    =================================== */

    session.user = response.data;

    session.authenticated = true;

    /* ===================================
       SIMPAN SESSION TERBARU
    =================================== */

    this.setSession(session);

    return true;
  } catch (error) {
    console.error("Auth.init: Session validation gagal.", error);

    Storage.remove(this.config.sessionKey);

    State.remove("session");

    return false;
  }
};

/* =========================================
   LOGIN
========================================= */

Auth.login = async function (username, password) {
  const response = await API.post("login", {
    username,
    password,
  });

  if (!response || !response.success) {
    return response;
  }

  const session = this.createSession(response.data);

  this.setSession(session);

  return response;
};

/* =========================================
   CREATE SESSION
========================================= */

Auth.createSession = function (data = {}) {
  return {
    authenticated: true,

    sessionId: data.sessionId || null,

    user: data.user || null,

    assignments: [],

    permissions: [],

    context: {
      pos_dana_id: null,

      assignment_id: null,

      assignment_type: null,
    },

    meta: {
      login_at: new Date().toISOString(),

      version: CONFIG.VERSION,
    },
  };
};

/* =========================================
   SET SESSION
========================================= */

Auth.setSession = function (session) {
  if (!session || !session.authenticated) {
    throw new Error("Session tidak valid.");
  }

  Storage.set(this.config.sessionKey, session);

  State.set("session", session);

  return session;
};

/* =========================================
   GET SESSION
========================================= */

Auth.getSession = function () {
  return State.get("session", null);
};

/* =========================================
   GET SESSION ID
========================================= */

Auth.getSessionId = function () {
  const session = this.getSession();

  return session ? session.sessionId || null : null;
};

/* =========================================
   CHECK
========================================= */

Auth.check = function () {
  return this.isLoggedIn();
};

/* =========================================
   IS LOGGED IN
========================================= */

Auth.isLoggedIn = function () {
  const session = this.getSession();

  return Boolean(session && session.authenticated === true);
};

/* =========================================
   GET USER
========================================= */

Auth.getUser = function () {
  const session = this.getSession();

  return session ? session.user : null;
};

/* =========================================
   GET ROLE
========================================= */

Auth.getRole = function () {
  const user = this.getUser();

  return user ? user.ROLE || null : null;
};

/* =========================================
   GET ASSIGNMENTS
========================================= */

Auth.getAssignments = function () {
  const session = this.getSession();

  return session ? session.assignments || [] : [];
};

/* =========================================
   GET PERMISSIONS
========================================= */

Auth.getPermissions = function () {
  const session = this.getSession();

  return session ? session.permissions || [] : [];
};

/* =========================================
   HAS PERMISSION
========================================= */

Auth.hasPermission = function (permission) {
  if (!permission) return false;

  return this.getPermissions().includes(permission);
};

/* =========================================
   HAS ASSIGNMENT
========================================= */

Auth.hasAssignment = function (posDanaId) {
  if (!posDanaId) return false;

  return this.getAssignments().some(
    (assignment) => String(assignment.pos_dana_id) === String(posDanaId),
  );
};

/* =========================================
   GET CONTEXT
========================================= */

Auth.getContext = function () {
  const session = this.getSession();

  return session ? session.context || null : null;
};

/* =========================================
   SET CONTEXT
========================================= */

Auth.setContext = function ({
  pos_dana_id = null,
  assignment_id = null,
  assignment_type = null,
} = {}) {
  const session = this.getSession();

  if (!session || !session.authenticated) {
    throw new Error("User belum login.");
  }

  if (!pos_dana_id) {
    throw new Error("Pos Dana wajib dipilih.");
  }

  const assignment = this.getAssignments().find(
    (item) =>
      String(item.pos_dana_id) === String(pos_dana_id) &&
      String(item.status).toUpperCase() === "ACTIVE",
  );

  if (!assignment) {
    throw new Error("User tidak memiliki assignment aktif pada Pos Dana ini.");
  }

  session.context = {
    pos_dana_id: assignment.pos_dana_id,

    assignment_id: assignment.id,

    assignment_type: assignment.assignment_type,
  };

  this.setSession(session);

  return session.context;
};

/* =========================================
   CLEAR CONTEXT
========================================= */

Auth.clearContext = function () {
  const session = this.getSession();

  if (!session) return null;

  session.context = {
    pos_dana_id: null,

    assignment_id: null,

    assignment_type: null,
  };

  this.setSession(session);

  return session.context;
};

/* =========================================
   LOGOUT
========================================= */

Auth.logout = function () {
  Storage.remove(this.config.sessionKey);

  State.clear();

  return true;
};
