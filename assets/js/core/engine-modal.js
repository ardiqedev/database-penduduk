/* =========================================
   MODAL ENGINE
========================================= */

const Modal = {
  modal: null,

  dialog: null,

  /* =====================================
     INIT
  ===================================== */

  /* =====================================
   INIT - GURU STANDALONE
===================================== */

  /* =====================================
   INIT
===================================== */

  async init() {
    this.modal = document.getElementById("modal");

    if (!this.modal) {
      console.error("[Modal] Element #modal tidak ditemukan.");

      return false;
    }

    this.dialog = this.modal.querySelector(".modal-dialog");

    this.bindEvents();

    lucide.createIcons();

    return true;
  },

  /* =====================================
     BIND EVENTS
  ===================================== */

  bindEvents() {
    document.getElementById("modalClose")?.addEventListener("click", () => {
      this.close();
    });

    /* Klik backdrop */

    this.modal?.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    /* Tombol ESC */

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal?.classList.contains("show")) {
        this.close();
      }
    });
  },

  /* =====================================
     OPEN
  ===================================== */

  open(options = {}) {
    // Cegah modal dibuka dua kali
    if (this.isOpen()) {
      console.warn("Modal sedang terbuka.");
      return false;
    }

    const { title = "", body = "", footer = "", size = "md" } = options;

    this.setSize(size);

    this.setTitle(title);

    this.setBody(body);

    this.setFooter(footer);

    this.modal.classList.add("show");

    document.body.style.overflow = "hidden";

    return true;
  },

  /* =====================================
     SET TITLE
  ===================================== */

  setTitle(title = "") {
    document.getElementById("modalTitle").innerHTML = title;
  },

  /* =====================================
     SET BODY
  ===================================== */

  setBody(body = "") {
    const modalBody = document.getElementById("modalBody");

    modalBody.innerHTML = body;

    lucide.createIcons();

    const firstInput = modalBody.querySelector("input, select, textarea");

    firstInput?.focus();

    return modalBody;
  },

  /* =====================================
     SET FOOTER
  ===================================== */

  setFooter(footer = "") {
    document.getElementById("modalFooter").innerHTML = footer;

    lucide.createIcons();
  },

  /* =====================================
     SET SIZE
  ===================================== */

  setSize(size = "md") {
    this.dialog.className = "modal-dialog";

    this.dialog.classList.add(`modal-${size}`);
  },

  /* =====================================
     IS OPEN
  ===================================== */

  isOpen() {
    return this.modal?.classList.contains("show") === true;
  },

  /* =====================================
     CLOSE
  ===================================== */

  close() {
    if (!this.isOpen()) return;

    this.modal.classList.remove("show");

    document.body.style.overflow = "";
  },
};
