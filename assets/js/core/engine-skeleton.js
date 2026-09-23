/* =========================================
   SKELETON ENGINE
========================================= */

const Skeleton = {
  /* =====================================
     TABLE
  ===================================== */

  table(target, rows = 8) {
    const el = document.querySelector(target);

    if (!el) return;

    let html = `

      <div class="skeleton-table">

    `;

    for (let i = 0; i < rows; i++) {
      html += `

        <div class="skeleton-row">

            <div class="skeleton skeleton-lg"></div>

            <div class="skeleton"></div>

            <div class="skeleton"></div>

            <div class="skeleton"></div>

            <div class="skeleton-sm"></div>

        </div>

      `;
    }

    html += `</div>`;

    el.innerHTML = html;
  },

  /* =====================================
     CARD
  ===================================== */

  card(target, total = 4) {
    const el = document.querySelector(target);

    if (!el) return;

    let html = "";

    for (let i = 0; i < total; i++) {
      html += `

      <div class="card">

          <div class="card-body">

              <div class="skeleton skeleton-title"></div>

              <div class="skeleton skeleton-text"></div>

              <div class="skeleton skeleton-text"></div>

          </div>

      </div>

      `;
    }

    el.innerHTML = html;
  },

  /* =====================================
     LIST
  ===================================== */

  list(target, total = 6) {
    const el = document.querySelector(target);

    if (!el) return;

    let html = "";

    for (let i = 0; i < total; i++) {
      html += `

      <div class="skeleton-list">

          <div class="skeleton-avatar"></div>

          <div>

              <div class="skeleton skeleton-title"></div>

              <div class="skeleton skeleton-text"></div>

          </div>

      </div>

      `;
    }

    el.innerHTML = html;
  },

  /* =====================================
   KELUARGA & PENDUDUK
===================================== */

  keluarga(target) {
    const el = document.querySelector(target);

    if (!el) return;

    el.innerHTML = `

    <div class="keluarga-skeleton">

      <!-- =====================================
           PAGE HEADER
      ====================================== -->

      <div class="skeleton-page-header">

        <div class="skeleton-page-header-info">

          <div class="skeleton skeleton-heading"></div>

          <div class="skeleton skeleton-description"></div>

        </div>

        <div class="skeleton skeleton-button"></div>

      </div>


      <!-- =====================================
           TABS
      ====================================== -->

      <div class="skeleton-keluarga-tabs">

        <div class="skeleton skeleton-tab active"></div>

        <div class="skeleton skeleton-tab"></div>

      </div>


      <!-- =====================================
           WORKSPACE
      ====================================== -->

      <div class="skeleton-keluarga-workspace">


        <!-- ===================================
             LEFT : LIST
        ==================================== -->

        <div class="skeleton-keluarga-list-panel">


          <!-- LIST HEADER -->

          <div class="skeleton-panel-header">

            <div class="skeleton skeleton-title"></div>

            <div class="skeleton skeleton-text"></div>

          </div>


          <!-- FILTER -->

          <div class="skeleton-kk-filter">

            <div class="skeleton skeleton-search"></div>

            <div class="skeleton skeleton-select"></div>

            <div class="skeleton skeleton-select"></div>

            <div class="skeleton skeleton-filter-button"></div>

          </div>


          <!-- TOOLBAR -->

          <div class="skeleton-kk-toolbar">

            <div class="skeleton skeleton-toolbar-total"></div>

            <div class="skeleton-kk-toolbar-actions">

              <div class="skeleton skeleton-sort"></div>

              <div class="skeleton skeleton-view-switcher"></div>

            </div>

          </div>


          <!-- KK LIST -->

          <div class="skeleton-kk-list">

            ${Array.from({ length: 6 })
              .map(
                () => `
                  <div class="skeleton-kk-item">

                    <div class="skeleton skeleton-kk-icon"></div>

                    <div class="skeleton-kk-main">

                      <div class="skeleton skeleton-kk-id"></div>

                      <div class="skeleton skeleton-kk-number"></div>

                      <div class="skeleton skeleton-kk-person"></div>

                      <div class="skeleton skeleton-kk-location"></div>

                      <div class="skeleton skeleton-kk-address"></div>

                    </div>

                    <div class="skeleton-kk-meta">

                      <div class="skeleton skeleton-kk-status"></div>

                      <div class="skeleton skeleton-kk-meta-line"></div>

                      <div class="skeleton skeleton-kk-meta-line short"></div>

                    </div>

                    <div class="skeleton skeleton-kk-arrow"></div>

                  </div>
                `,
              )
              .join("")}

          </div>


          <!-- PAGINATION -->

          <div class="skeleton-kk-pagination">

            <div class="skeleton skeleton-pagination-button"></div>

            <div class="skeleton skeleton-pagination-number"></div>

            <div class="skeleton skeleton-pagination-number"></div>

            <div class="skeleton skeleton-pagination-number"></div>

            <div class="skeleton skeleton-pagination-button"></div>

            <div class="skeleton skeleton-pagination-info"></div>

          </div>


        </div>


        <!-- ===================================
             RIGHT : DETAIL
        ==================================== -->

        <div class="skeleton-keluarga-detail-panel">


          <!-- DETAIL HEADER -->

          <div class="skeleton-detail-header">

            <div>

              <div class="skeleton skeleton-title"></div>

              <div class="skeleton skeleton-text"></div>

            </div>

            <div class="skeleton skeleton-detail-button"></div>

          </div>


          <!-- KK PROFILE -->

          <div class="skeleton-kk-profile">

            <div class="skeleton-kk-profile-top">

              <div class="skeleton skeleton-profile-icon"></div>

              <div class="skeleton-kk-profile-title">

                <div class="skeleton skeleton-profile-id"></div>

                <div class="skeleton skeleton-profile-status"></div>

              </div>

            </div>


            <div class="skeleton-kk-profile-grid">

              ${Array.from({ length: 7 })
                .map(
                  () => `
                    <div class="skeleton-detail-field">

                      <div class="skeleton skeleton-label"></div>

                      <div class="skeleton skeleton-value"></div>

                    </div>
                  `,
                )
                .join("")}

            </div>

          </div>


          <!-- DETAIL TABS -->

          <div class="skeleton-detail-tabs">

            <div class="skeleton skeleton-detail-tab active"></div>

            <div class="skeleton skeleton-detail-tab"></div>

          </div>


          <!-- ANGGOTA -->

          <div class="skeleton-anggota-panel">


            <!-- ANGGOTA HEADER -->

            <div class="skeleton-anggota-header">

              <div>

                <div class="skeleton skeleton-title"></div>

                <div class="skeleton skeleton-text"></div>

              </div>

              <div class="skeleton skeleton-small-button"></div>

            </div>


            <!-- MEMBER TABLE -->

            <div class="skeleton-anggota-table">

              <!-- HEADER -->

              <div class="skeleton-anggota-table-header">

                <div class="skeleton skeleton-table-heading"></div>

                <div class="skeleton skeleton-table-heading"></div>

                <div class="skeleton skeleton-table-heading"></div>

                <div class="skeleton skeleton-table-heading"></div>

                <div class="skeleton skeleton-table-heading"></div>

                <div class="skeleton skeleton-table-heading"></div>

                <div class="skeleton skeleton-table-heading"></div>

              </div>


              <!-- ROWS -->

              ${Array.from({ length: 5 })
                .map(
                  () => `
                    <div class="skeleton-anggota-row">

                      <div class="skeleton skeleton-table-cell short"></div>

                      <div class="skeleton skeleton-table-cell name"></div>

                      <div class="skeleton skeleton-table-cell nik"></div>

                      <div class="skeleton skeleton-table-cell relation"></div>

                      <div class="skeleton skeleton-table-cell small"></div>

                      <div class="skeleton skeleton-table-cell status"></div>

                      <div class="skeleton skeleton-table-cell action"></div>

                    </div>
                  `,
                )
                .join("")}

            </div>


            <!-- MEMBER SUMMARY -->

            <div class="skeleton-anggota-summary">

              <div class="skeleton skeleton-summary-icon"></div>

              <div class="skeleton-summary-content">

                <div class="skeleton skeleton-summary-title"></div>

                <div class="skeleton-summary-stat">

                  <div class="skeleton skeleton-summary-value"></div>

                  <div class="skeleton skeleton-summary-value"></div>

                  <div class="skeleton skeleton-summary-value"></div>

                </div>

              </div>

            </div>


          </div>

        </div>

      </div>

    </div>

  `;
  },

  /* =====================================
   POS DANA
===================================== */

  posDana(target) {
    const el = document.querySelector(target);

    if (!el) return;

    el.innerHTML = `
    <div class="pos-dana-skeleton">

      <!-- HEADER -->
      <div class="skeleton-pos-header">
        <div>
          <div class="skeleton skeleton-eyebrow"></div>
          <div class="skeleton skeleton-heading"></div>
          <div class="skeleton skeleton-description"></div>
        </div>

        <div class="skeleton skeleton-button"></div>
      </div>

      <!-- CONTENT -->
      <div class="skeleton-pos-layout">

        <!-- SIDEBAR -->
        <div class="skeleton-pos-sidebar">

          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>

          <div class="skeleton-tree">

            ${Array.from({ length: 7 })
              .map(
                (_, index) => `
                  <div
                    class="skeleton-tree-item ${
                      index === 5 ? "skeleton-tree-parent" : ""
                    }"
                  >
                    <div class="skeleton skeleton-tree-icon"></div>
                    <div class="skeleton skeleton-tree-name"></div>
                  </div>
                `,
              )
              .join("")}

          </div>

        </div>

        <!-- DETAIL -->
        <div class="skeleton-pos-detail">

          <!-- DETAIL HEADER -->
          <div class="skeleton-detail-header">

            <div class="skeleton-detail-identity">
              <div class="skeleton skeleton-icon"></div>
              <div class="skeleton skeleton-code"></div>
              <div class="skeleton skeleton-detail-title"></div>
              <div class="skeleton skeleton-detail-status"></div>
            </div>

            <div class="skeleton-detail-actions">
              <div class="skeleton skeleton-action-button"></div>
              <div class="skeleton skeleton-action-button"></div>
              <div class="skeleton skeleton-action-button"></div>
            </div>

          </div>

          <!-- INFORMATION -->
          <div class="skeleton-section-heading">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
          </div>

          <div class="skeleton-info-grid">

            ${Array.from({ length: 6 })
              .map(
                () => `
                  <div class="skeleton-info-card">
                    <div class="skeleton skeleton-label"></div>
                    <div class="skeleton skeleton-value"></div>
                  </div>
                `,
              )
              .join("")}

          </div>

          <!-- CONFIGURATION -->
          <div class="skeleton-section-heading skeleton-config-heading">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
          </div>

          <div class="skeleton skeleton-config-line"></div>
          <div class="skeleton skeleton-config-line short"></div>

        </div>

      </div>

    </div>
  `;
  },

  /* =====================================
     HIDE
  ===================================== */

  hide(target) {
    const el = document.querySelector(target);

    if (!el) return;

    el.innerHTML = "";
  },
};
