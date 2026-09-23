/* =========================================
   QEDEV API
========================================= */

const API = {};

/* =====================================
   CONFIG
===================================== */

API.baseUrl = CONFIG.API.URL;

/* =====================================
   REQUEST
===================================== */

API.request = function (action, data = {}) {
  return new Promise((resolve, reject) => {
    let script = null;
    let timeoutId = null;
    let finished = false;

    /*
     * Callback harus didefinisikan
     * di scope yang bisa diakses oleh
     * cleanup(), success(), dan error().
     */
    const callbackName =
      "__QEDEV_API_CALLBACK_" +
      Date.now() +
      "_" +
      Math.floor(Math.random() * 100000);

    /* ===============================
       CLEANUP
    =============================== */

    const cleanup = () => {
      /* =============================
         CLEAR TIMEOUT
      ============================= */

      if (timeoutId) {
        clearTimeout(timeoutId);

        timeoutId = null;
      }

      /* =============================
         REMOVE SCRIPT
      ============================= */

      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }

      /* =============================
         REMOVE CALLBACK
      ============================= */

      try {
        delete window[callbackName];
      } catch (error) {
        window[callbackName] = undefined;
      }
    };

    /* ===============================
       FINISH SUCCESS
    =============================== */

    const finishSuccess = (result) => {
      if (finished) {
        return;
      }

      finished = true;

      cleanup();

      /* =============================
         VALIDATE RESPONSE
      ============================= */

      if (!result || typeof result !== "object") {
        const error = new Error("Response server tidak valid.");

        console.error(error);

        Toast.error(error.message);

        reject(error);

        return;
      }

      /* =============================
         SERVER ERROR
      ============================= */

      if (result.success === false) {
        const error = new Error(
          result.error || result.message || "Request gagal.",
        );

        console.error("QEDEV API SERVER ERROR:", result);

        Toast.error(error.message);

        reject(error);

        return;
      }

      /* =============================
         SUCCESS
      ============================= */

      resolve(result);
    };

    /* ===============================
       FINISH ERROR
    =============================== */

    const finishError = (error) => {
      if (finished) {
        return;
      }

      finished = true;

      cleanup();

      console.error(error);

      Toast.error(error.message || "Gagal terhubung ke server.");

      reject(error);
    };

    try {
      /* ===============================
         BUILD PAYLOAD
      =============================== */

      const payload = JSON.stringify({
        action,
        data,
      });

      /* ===============================
         GLOBAL CALLBACK
      =============================== */

      window[callbackName] = function (result) {
        finishSuccess(result);
      };

      /* ===============================
         CREATE SCRIPT
      =============================== */

      script = document.createElement("script");

      /* ===============================
         SCRIPT ERROR
      =============================== */

      script.onerror = function (event) {
        console.error("QEDEV API SCRIPT ERROR:", {
          action,
          url,
          event,
        });

        finishError(new Error("Gagal terhubung ke server."));
      };

      /* ===============================
         URL SEPARATOR
      =============================== */

      const separator = this.baseUrl.includes("?") ? "&" : "?";

      /* ===============================
         REQUEST URL
      =============================== */

      const url =
        `${this.baseUrl}` +
        `${separator}` +
        `payload=${encodeURIComponent(payload)}` +
        `&callback=${encodeURIComponent(callbackName)}` +
        `&_=${Date.now()}`;

      /* ===============================
         LOAD SCRIPT
      =============================== */

      script.src = url;
      console.log("QEDEV API REQUEST:", {
        action,
        url: url.split("&payload=")[0],
      });

      document.head.appendChild(script);

      /* ===============================
         TIMEOUT
      =============================== */

      const timeout = Number(CONFIG.API.TIMEOUT) || 60000;

      timeoutId = setTimeout(() => {
        finishError(
          new Error(
            "Request timeout setelah " + Math.round(timeout / 1000) + " detik.",
          ),
        );
      }, timeout);
    } catch (error) {
      finishError(error);
    }
  });
};

/* =====================================
   GET
===================================== */

API.get = function (action, params = {}) {
  return new Promise((resolve, reject) => {
    let script = null;
    let timeoutId = null;
    let finished = false;

    const callbackName =
      "__QEDEV_API_GET_CALLBACK_" +
      Date.now() +
      "_" +
      Math.floor(Math.random() * 100000);

    /* ===============================
       CLEANUP
    =============================== */

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }

      try {
        delete window[callbackName];
      } catch (error) {
        window[callbackName] = undefined;
      }
    };

    /* ===============================
       SUCCESS
    =============================== */

    const finishSuccess = (result) => {
      if (finished) {
        return;
      }

      finished = true;

      cleanup();

      if (!result || typeof result !== "object") {
        const error = new Error("Response server tidak valid.");

        console.error(error);

        Toast.error(error.message);

        reject(error);

        return;
      }

      if (result.success === false) {
        const error = new Error(result.message || "Request GET gagal.");

        console.error(error);

        Toast.error(error.message);

        reject(error);

        return;
      }

      resolve(result);
    };

    /* ===============================
       ERROR
    =============================== */

    const finishError = (error) => {
      if (finished) {
        return;
      }

      finished = true;

      cleanup();

      console.error(error);

      Toast.error(error.message || "Gagal terhubung ke server.");

      reject(error);
    };

    try {
      /* ===============================
         QUERY PARAMS
      =============================== */

      const query = new URLSearchParams();

      query.append("action", action);

      Object.keys(params).forEach((key) => {
        const value = params[key];

        if (value !== undefined && value !== null && value !== "") {
          query.append(key, value);
        }
      });

      query.append("callback", callbackName);

      query.append("_", Date.now());

      /* ===============================
         CALLBACK
      =============================== */

      window[callbackName] = function (result) {
        finishSuccess(result);
      };

      /* ===============================
         SCRIPT
      =============================== */

      script = document.createElement("script");

      script.onerror = function () {
        finishError(new Error("Gagal terhubung ke server."));
      };

      /* ===============================
         URL
      =============================== */

      const separator = this.baseUrl.includes("?") ? "&" : "?";

      const url = `${this.baseUrl}` + `${separator}` + `${query.toString()}`;

      console.log("QEDEV API GET:", {
        action,
        url,
      });

      /* ===============================
         LOAD
      =============================== */

      script.src = url;

      document.head.appendChild(script);

      /* ===============================
         TIMEOUT
      =============================== */

      const timeout = Number(CONFIG.API.TIMEOUT) || 60000;

      timeoutId = setTimeout(() => {
        finishError(
          new Error(
            "Request timeout setelah " + Math.round(timeout / 1000) + " detik.",
          ),
        );
      }, timeout);
    } catch (error) {
      finishError(error);
    }
  });
};

/* =====================================
   POST
===================================== */

/*
 * Method tetap API.post()
 *
 * Module QEDEV tidak perlu mengetahui
 * transport internal yang digunakan.
 */

API.post = function (action, data = {}) {
  return this.request(action, data);
};
