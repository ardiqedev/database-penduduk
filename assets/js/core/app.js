/* =========================================
   APP INIT
========================================= */

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  try {
    if (CONFIG.DEBUG) {
      console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION}`);
    }

    await Router.loadComponent("components/sidebar.html", "sidebar");

    await Router.loadComponent("components/navbar.html", "navbar");

    await Modal.init();

    // State harus diinisialisasi terlebih dahulu
    State.init();

    // Restore dan validasi session
    const authenticated = await Auth.init();

    if (!authenticated) {
      console.log("USER BELUM LOGIN");

      document.body.classList.add("login-mode");

      await Router.navigate("login");

      return;
    }

    document.body.classList.remove("login-mode");

    Sidebar.init();

    await Router.start();
  } catch (error) {
    console.error("Application initialization failed:", error);
  }
}
