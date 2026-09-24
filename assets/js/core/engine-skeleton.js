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
   KELUARGA DETAIL
===================================== */

  keluargaDetail(target) {
    const el = document.querySelector(target);

    if (!el) return;

    el.innerHTML = `
  <div class="keluarga-skeleton">

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

        <div class="skeleton-anggota-header">

          <div>

            <div class="skeleton skeleton-title"></div>

            <div class="skeleton skeleton-text"></div>

          </div>

          <div class="skeleton skeleton-small-button"></div>

        </div>


        <!-- TABLE -->

        <div class="skeleton-member-table">

          ${Array.from({ length: 5 })
            .map(
              () => `
                <div class="skeleton-member-row">

                  <div class="skeleton skeleton-member-cell short"></div>

                  <div class="skeleton skeleton-member-cell"></div>

                  <div class="skeleton skeleton-member-cell"></div>

                  <div class="skeleton skeleton-member-cell"></div>

                  <div class="skeleton skeleton-member-cell short"></div>

                  <div class="skeleton skeleton-member-cell short"></div>

                </div>
              `,
            )
            .join("")}

        </div>


        <!-- SUMMARY -->

        <div class="skeleton-member-summary">

          <div class="skeleton skeleton-summary-icon"></div>

          <div>

            <div class="skeleton skeleton-summary-title"></div>

            <div class="skeleton skeleton-summary-text"></div>

          </div>

        </div>

      </div>

    </div>
    </div>
  `;
  },

  /* =====================================
   MUTASI PENDUDUK
===================================== */

  mutasi(target) {
    const el = document.querySelector(target);

    if (!el) return;

    el.innerHTML = `

    <div class="mutasi-skeleton">

      <!-- =====================================
           PAGE HEADER
      ====================================== -->

      <div class="mutasi-skeleton-header">

        <div class="mutasi-skeleton-header-info">

          <div class="skeleton skeleton-heading"></div>

          <div class="skeleton skeleton-description"></div>

        </div>

        <div class="skeleton skeleton-breadcrumb"></div>

      </div>


      <!-- =====================================
           STATISTICS
      ====================================== -->

      <div class="mutasi-skeleton-stats">

        ${Array.from({ length: 5 })
          .map(
            () => `
              <div class="mutasi-skeleton-stat-card">

                <div class="skeleton skeleton-stat-icon"></div>

                <div class="mutasi-skeleton-stat-content">

                  <div class="skeleton skeleton-stat-label"></div>

                  <div class="skeleton skeleton-stat-value"></div>

                  <div class="skeleton skeleton-stat-description"></div>

                </div>

              </div>
            `,
          )
          .join("")}

      </div>


      <!-- =====================================
           FILTER
      ====================================== -->

      <div class="mutasi-skeleton-filter">

        <div class="skeleton skeleton-search"></div>

        <div class="skeleton skeleton-filter-field"></div>

        <div class="skeleton skeleton-filter-field"></div>

        <div class="skeleton skeleton-filter-field"></div>

        <div class="skeleton skeleton-filter-button"></div>

        <div class="skeleton skeleton-add-button"></div>

      </div>


      <!-- =====================================
           TABLE CARD
      ====================================== -->

      <div class="mutasi-skeleton-table-card">

        <!-- TABLE HEADER -->

        <div class="mutasi-skeleton-table-header">

          <div>

            <div class="skeleton skeleton-table-title"></div>

            <div class="skeleton skeleton-table-description"></div>

          </div>

        </div>


        <!-- TABLE -->

        <div class="mutasi-skeleton-table">

          <!-- HEADER -->

          <div class="mutasi-skeleton-table-row header">

            <div class="skeleton skeleton-table-heading"></div>
            <div class="skeleton skeleton-table-heading"></div>
            <div class="skeleton skeleton-table-heading"></div>
            <div class="skeleton skeleton-table-heading"></div>
            <div class="skeleton skeleton-table-heading"></div>
            <div class="skeleton skeleton-table-heading"></div>
            <div class="skeleton skeleton-table-heading"></div>

          </div>


          <!-- ROWS -->

          ${Array.from({ length: 7 })
            .map(
              () => `
                <div class="mutasi-skeleton-table-row">

                  <div class="skeleton skeleton-table-cell short"></div>

                  <div class="skeleton skeleton-table-cell date"></div>

                  <div class="skeleton skeleton-table-cell name"></div>

                  <div class="skeleton skeleton-table-cell nik"></div>

                  <div class="skeleton skeleton-table-cell badge"></div>

                  <div class="skeleton skeleton-table-cell description"></div>

                  <div class="skeleton skeleton-table-cell actions"></div>

                </div>
              `,
            )
            .join("")}

        </div>


        <!-- PAGINATION -->

        <div class="mutasi-skeleton-pagination">

          <div class="skeleton skeleton-pagination-info"></div>

          <div class="mutasi-skeleton-pagination-buttons">

            <div class="skeleton skeleton-pagination-button"></div>

            <div class="skeleton skeleton-pagination-number"></div>

            <div class="skeleton skeleton-pagination-number"></div>

            <div class="skeleton skeleton-pagination-number"></div>

            <div class="skeleton skeleton-pagination-button"></div>

          </div>

          <div class="skeleton skeleton-pagination-per-page"></div>

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
