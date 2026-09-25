/* =========================================
   LOGIN CONTROLLER
========================================= */

const LoginController = {
  initialized: false,

  /* =====================================
     INIT
  ===================================== */

  init() {
    if (this.initialized) {
      return;
    }

    const form = document.getElementById("loginForm");

    const togglePassword = document.getElementById("togglePassword");

    const passwordInput = document.getElementById("loginPassword");

    if (!form) {
      console.warn("LoginController: Form login tidak ditemukan.");

      return;
    }

    /* ===================================
       FORM SUBMIT
    =================================== */

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      this.login();
    });

    /* ===================================
       TOGGLE PASSWORD
    =================================== */

    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", () => {
        const show = passwordInput.type === "password";

        passwordInput.type = show ? "text" : "password";

        togglePassword.innerHTML = show
          ? '<i data-lucide="eye-off"></i>'
          : '<i data-lucide="eye"></i>';

        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      });
    }

    this.initialized = true;

    console.log("[LoginController] init");
  },

  /* =====================================
     LOGIN
  ===================================== */

  async login() {
    const usernameInput = document.getElementById("loginUsername");

    const passwordInput = document.getElementById("loginPassword");

    const loginButton = document.getElementById("loginButton");

    const errorElement = document.getElementById("loginError");

    const username = String(usernameInput?.value || "").trim();

    const password = String(passwordInput?.value || "");

    /* ===================================
       CLEAR ERROR
    =================================== */

    this.clearError(errorElement);

    /* ===================================
       VALIDASI USERNAME
    =================================== */

    if (!username) {
      this.showError(errorElement, "Username wajib diisi.");

      usernameInput?.focus();

      return;
    }

    /* ===================================
       VALIDASI PASSWORD
    =================================== */

    if (!password) {
      this.showError(errorElement, "Password wajib diisi.");

      passwordInput?.focus();

      return;
    }

    /* ===================================
       LOADING
    =================================== */

    this.setLoading(loginButton, true);

    try {
      console.log("[LoginController] Login...");

      /* ================================
         AUTH LOGIN
      ================================= */

      const response = await Auth.login(username, password);

      if (!response || response.success !== true) {
        throw new Error(response?.message || "Login gagal.");
      }

      /* ================================
         SESSION BERHASIL
      ================================= */

      console.log("[LoginController] Login berhasil.");

      /* ================================
         CLEAR FORM
      ================================= */

      if (passwordInput) {
        passwordInput.value = "";
      }

      /* ================================
         KELUAR DARI LOGIN MODE
      ================================= */

      document.body.classList.remove("login-mode");

      /* ================================
         INIT SIDEBAR
      ================================= */

      Sidebar.init();

      /* ================================
         KE DASHBOARD
      ================================= */

      await Router.navigate("dashboard");
    } catch (error) {
      console.error("[LoginController] Login gagal:", error);

      this.showError(
        errorElement,
        error.message || "Username atau password salah.",
      );
    } finally {
      this.setLoading(loginButton, false);
    }
  },

  /* =====================================
     SHOW ERROR
  ===================================== */

  showError(element, message) {
    if (!element) {
      return;
    }

    element.textContent = message;

    element.classList.add("is-visible");
  },

  /* =====================================
     CLEAR ERROR
  ===================================== */

  clearError(element) {
    if (!element) {
      return;
    }

    element.textContent = "";

    element.classList.remove("is-visible");
  },

  /* =====================================
     LOADING
  ===================================== */

  setLoading(button, loading) {
    if (!button) {
      return;
    }

    button.disabled = loading;

    if (loading) {
      button.dataset.originalText = button.textContent;

      button.textContent = "Memproses...";

      button.style.opacity = "0.75";

      button.style.cursor = "wait";
    } else {
      button.textContent = button.dataset.originalText || "Masuk";

      button.style.opacity = "";

      button.style.cursor = "";
    }
  },
};
