const Toolbar = (() => {
  function render(options = {}) {
    const container = document.querySelector(options.target);

    if (!container) return;

    const buttons = (options.buttons || [])
      .map(
        (button) => `

            <button
                id="toolbar-${button.id}"
                class="btn btn-${button.variant || "outline"}"
                ${button.disabled ? "disabled" : ""}>

                <i data-lucide="${button.icon}"></i>

                ${button.text}

            </button>

        `,
      )
      .join("");

    const search = options.search
      ? `
        <div class="search">

            <i data-lucide="search"></i>

            <input
                type="text"
                placeholder="${options.search.placeholder || "Cari..."}"
                ${options.search.disabled ? "disabled" : ""}>

        </div>
    `
      : "";

    const filter = options.filter
      ? `
      <button
          id="toolbar-filter"
          class="btn btn-outline"
          ${options.filter.disabled ? "disabled" : ""}>

          <i data-lucide="filter"></i>

          Filter

      </button>
`
      : "";

    container.innerHTML = `

            <div class="toolbar">

                <div class="toolbar-left">

                    ${buttons}

                </div>

                <div class="toolbar-right">

                    ${search}

                    ${filter}

                </div>

            </div>

        `;

    lucide.createIcons();
  }

  /* =========================================
   Event
========================================= */

  function on(id, callback) {
    const button = document.getElementById(`toolbar-${id}`);

    if (!button) return;

    button.addEventListener("click", callback);
  }

  return {
    render,
    on,
  };
})();
