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

/* =========================================
   GET
========================================= */

/* =========================================
   GET
========================================= */

API.get = function (action, params = {}) {
  return new Promise((resolve, reject) => {
    let script = null;
    let timeoutId = null;
    let finished = false;

    /*
     * Callback harus unik agar setiap request
     * memiliki handler JSONP sendiri.
     */
    const callbackName =
      "__QEDEV_API_GET_CALLBACK_" +
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

        console.error("QEDEV API GET SERVER ERROR:", result);

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

      console.error("QEDEV API GET ERROR:", error);

      Toast.error(error.message || "Gagal terhubung ke server.");

      reject(error);
    };

    try {
      /* ===============================
         SESSION
      =============================== */

      const sessionId = params.sessionId || Auth.getSessionId() || "";

      /* ===============================
         DATA PAYLOAD
      =============================== */

      const data = {
        ...params,
        sessionId,
      };

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
        console.error("QEDEV API GET SCRIPT ERROR:", {
          action,
          url: script ? script.src : "",
          event,
        });

        finishError(new Error("Gagal terhubung ke server."));
      };

      /* ===============================
         URL SEPARATOR
      =============================== */

      const separator = this.baseUrl.includes("?") ? "&" : "?";

      /* ===============================
         QUERY
      =============================== */

      const query = new URLSearchParams();

      /*
       * Action tetap dikirim di level query
       * untuk kompatibilitas Router.handleGet().
       */
      query.set("action", action);

      /*
       * Payload utama.
       *
       * Di dalamnya terdapat:
       * {
       *   action,
       *   data: {
       *     ...params,
       *     sessionId
       *   }
       * }
       */
      query.set("payload", payload);

      /*
       * Callback JSONP.
       */
      query.set("callback", callbackName);

      /*
       * Cache buster.
       */
      query.set("_", Date.now());

      /* ===============================
         TOP LEVEL PARAMETERS
      =============================== */

      /*
       * Router detail seperti:
       *
       * params.idKK
       * params.idPenduduk
       * params.idMutasi
       *
       * membaca parameter langsung dari
       * e.parameter.
       *
       * Karena itu parameter GET juga
       * dikirim di level query.
       */
      Object.keys(params).forEach((key) => {
        const value = params[key];

        if (value !== undefined && value !== null) {
          query.set(key, String(value));
        }
      });

      /* ===============================
         REQUEST URL
      =============================== */

      const url = `${this.baseUrl}` + `${separator}` + `${query.toString()}`;

      /* ===============================
         LOAD SCRIPT
      =============================== */

      script.src = url;

      console.log("QEDEV API GET:", {
        action,
        url: url.split("payload=")[0],
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
   POST
===================================== */

/*
 * Method tetap API.post()
 *
 * Module QEDEV tidak perlu mengetahui
 * transport internal yang digunakan.
 */

/* =====================================
   POST
===================================== */

/* =====================================
   POST
===================================== */

API.post = function (action, data = {}) {
  return new Promise((resolve, reject) => {
    let timeoutId = null;
    let finished = false;

    /* ===============================
       FINISH
    =============================== */

    const finish = (callback) => {
      if (finished) {
        return;
      }

      finished = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      callback();
    };

    /* ===============================
       PAYLOAD
    =============================== */

    const sessionId = data.sessionId || Auth.getSessionId() || "";

    const payloadData = {
      ...data,
      sessionId,
    };

    const payload = JSON.stringify({
      action,
      data: payloadData,
    });

    console.log("QEDEV API POST:", {
      action,
      url: this.baseUrl,
    });

    /* ===============================
       REQUEST
    =============================== */

    fetch(this.baseUrl, {
      method: "POST",

      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },

      body: payload,
    })
      .then(async (response) => {
        /* =============================
           HTTP ERROR
        ============================= */

        if (!response.ok) {
          throw new Error(`Server mengembalikan HTTP ${response.status}.`);
        }

        /* =============================
           RESPONSE
        ============================= */

        return response.json();
      })
      .then((result) => {
        /* =============================
           VALIDATE RESPONSE
        ============================= */

        if (!result || typeof result !== "object") {
          throw new Error("Response server tidak valid.");
        }

        /* =============================
           SERVER ERROR
        ============================= */

        if (result.success === false) {
          const error = new Error(
            result.error || result.message || "Request gagal.",
          );

          console.error("QEDEV API POST SERVER ERROR:", result);

          Toast.error(error.message);

          finish(() => reject(error));

          return;
        }

        /* =============================
           SUCCESS
        ============================= */

        finish(() => resolve(result));
      })
      .catch((error) => {
        finish(() => {
          console.error("QEDEV API POST ERROR:", error);

          Toast.error(error.message || "Gagal terhubung ke server.");

          reject(error);
        });
      });

    /* ===============================
       TIMEOUT
    =============================== */

    const timeout = Number(CONFIG.API.TIMEOUT) || 60000;

    timeoutId = setTimeout(() => {
      finish(() => {
        const error = new Error(
          "Request timeout setelah " + Math.round(timeout / 1000) + " detik.",
        );

        console.error(error);

        Toast.error(error.message);

        reject(error);
      });
    }, timeout);
  });
};
