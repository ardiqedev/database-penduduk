/* =========================================
   DATABASE WARGA
   NOTIFICATION UI
========================================= */

const NotificationUI = (() => {
  let timer = null;
  let initialized = false;
  let loading = false;

  let notifications = [];

  /* =====================================
     SESSION
  ===================================== */

  function getSessionId() {
    if (
      typeof Auth !== "undefined" &&
      typeof Auth.getSessionId === "function"
    ) {
      return Auth.getSessionId();
    }

    if (typeof Storage !== "undefined" && typeof Storage.get === "function") {
      return Storage.get("sessionId", "");
    }

    return "";
  }

  /* =====================================
     ROLE CHECK
  ===================================== */

  function isAdmin() {
    if (typeof Auth === "undefined" || typeof Auth.getUser !== "function") {
      return false;
    }

    const user = Auth.getUser();

    return (
      String(user?.ROLE || "")
        .trim()
        .toUpperCase() === "ADMIN"
    );
  }

  /* =====================================
     ELEMENTS
  ===================================== */

  function elements() {
    return {
      button: document.getElementById("btnNotifications"),

      badge: document.getElementById("notificationBadge"),

      dropdown: document.getElementById("notificationDropdown"),

      list: document.getElementById("notificationList"),

      label: document.getElementById("notificationCountLabel"),
    };
  }

  /* =====================================
     BADGE
  ===================================== */

  function updateBadge(count) {
    const el = elements();

    if (!el.badge) return;

    const total = Number(count) || 0;

    el.badge.textContent = total > 99 ? "99+" : String(total);

    el.badge.classList.toggle("hidden", total <= 0);
  }

  /* =====================================
     FORMAT DATE
  ===================================== */

  function formatDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  /* =====================================
     RENDER LIST
  ===================================== */

  function renderList(items) {
    const el = elements();

    if (!el.list) return;

    el.list.replaceChildren();

    if (!items.length) {
      const empty = document.createElement("div");

      empty.className = "notification-empty";
      empty.textContent = "Belum ada notifikasi baru.";

      el.list.appendChild(empty);

      return;
    }

    items.forEach(function (item) {
      const card = document.createElement("article");

      card.className = "notification-item" + (item.DIBACA ? "" : " unread");

      const title = document.createElement("strong");

      title.textContent = item.JUDUL || "Notifikasi";

      const message = document.createElement("p");

      message.textContent = item.PESAN || "";

      const date = document.createElement("small");

      date.textContent = formatDate(item.CREATED_AT);

      card.append(title, message, date);

      el.list.appendChild(card);
    });
  }

  /* =====================================
     LOAD
  ===================================== */

  async function load() {
    if (loading || !isAdmin()) return;

    const sessionId = getSessionId();

    if (!sessionId) return;

    loading = true;

    try {
      const response = await API.get("getNotifications", {
        sessionId: sessionId,
      });

      const result = response?.data || {};

      notifications = Array.isArray(result.items) ? result.items : [];

      updateBadge(result.unreadCount || 0);

      const el = elements();

      if (el.dropdown && !el.dropdown.classList.contains("hidden")) {
        renderList(notifications);
      }
    } catch (error) {
      console.error("[NotificationUI] Gagal memuat notifikasi:", error);
    } finally {
      loading = false;
    }
  }

  /* =====================================
     OPEN / CLOSE
  ===================================== */

  async function toggle() {
    const el = elements();

    if (!el.button || !el.dropdown) return;

    const opening = el.dropdown.classList.contains("hidden");

    el.dropdown.classList.toggle("hidden", !opening);

    el.button.setAttribute("aria-expanded", String(opening));

    if (!opening) return;

    await load();

    renderList(notifications);

    const sessionId = getSessionId();

    if (!sessionId || !isAdmin()) return;

    try {
      await API.post("markNotificationsRead", {
        sessionId: sessionId,
      });

      notifications = notifications.map(function (item) {
        return {
          ...item,
          DIBACA: true,
        };
      });

      updateBadge(0);
      renderList(notifications);
    } catch (error) {
      console.error("[NotificationUI] Gagal menandai dibaca:", error);
    }
  }

  /* =====================================
     INITIALIZE
  ===================================== */

  function init() {
    if (initialized) return;

    initialized = true;

    document.addEventListener("click", function (event) {
      const el = elements();

      if (!el.button || !el.dropdown) return;

      if (el.button.contains(event.target)) {
        if (isAdmin()) {
          void toggle();
        }
        return;
      }

      const wrapper = el.button.closest(".notification-wrapper");

      if (wrapper && !wrapper.contains(event.target)) {
        el.dropdown.classList.add("hidden");

        el.button.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;

      const el = elements();

      el.dropdown?.classList.add("hidden");

      el.button?.setAttribute("aria-expanded", "false");
    });

    /* Sembunyikan fitur untuk non-Admin */

    const user =
      typeof Auth !== "undefined" && typeof Auth.getUser === "function"
        ? Auth.getUser()
        : null;

    const el = elements();

    if (
      user &&
      String(user.ROLE || "")
        .trim()
        .toUpperCase() !== "ADMIN"
    ) {
      el.button?.classList.add("hidden");
      el.dropdown?.classList.add("hidden");
      return;
    }

    void load();

    if (!timer) {
      timer = window.setInterval(function () {
        void load();
      }, 45000);
    }
  }

  return {
    init: init,
    load: load,
  };
})();

window.NotificationUI = NotificationUI;

/* Mendukung navbar yang sudah ada saat script dimuat */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      NotificationUI.init();
    },
    { once: true },
  );
} else {
  NotificationUI.init();
}
