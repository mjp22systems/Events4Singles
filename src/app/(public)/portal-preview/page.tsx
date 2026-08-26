export const metadata = { title: "Portal Design Preview | Events4Singles" };

export default function PortalPreviewPage() {
  return (
    <div className="e4s-inline-5622a46c" >
      <div className="e4s-inline-ca330715" >

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="e4s-inline-38acb587" >
          <h1 className="e4s-inline-99028b16" >Portal Design System</h1>
          <p className="e4s-inline-b4cfb71c" >Events4Singles Advertiser Portal · <code>p-</code> class inventory</p>
        </div>

        {/* ── Shell preview ──────────────────────────────────── */}
        <Section title="Shell Layout">
          <div className="p-shell e4s-inline-594903f7" >

            {/* Sidebar */}
            <aside className="p-sidebar e4s-inline-6180275a" >
              <div className="p-sidebar__logo">
                <div className="p-sidebar__logo-mark">e4s</div>
                <div className="p-sidebar__logo-text">
                  <span className="p-sidebar__logo-name">Events4Singles</span>
                  <span className="p-sidebar__logo-sub">Advertiser Portal</span>
                </div>
              </div>
              <nav className="p-sidebar__nav">
                <a className="p-sidebar__link p-sidebar__link--active" href="#">Dashboard</a>
                <a className="p-sidebar__link" href="#">Listings</a>
                <a className="p-sidebar__link" href="#">Events</a>
                <a className="p-sidebar__link" href="#">Banners</a>
                <a className="p-sidebar__link" href="#">Analytics</a>
                <a className="p-sidebar__link" href="#">Billing</a>
                <a className="p-sidebar__link" href="#">Settings</a>
              </nav>
              <div className="p-sidebar__footer">
                <a href="/" className="p-sidebar__site-link">← View site</a>
              </div>
            </aside>

            {/* Right pane */}
            <div className="p-right">
              <header className="p-topbar">
                <span className="p-topbar__title">Dashboard</span>
                <div className="p-topbar__user">
                  <span className="p-user-chip">Jane Smith</span>
                  <a href="#" className="p-btn">Sign out</a>
                </div>
              </header>
              <main className="p-main">
                <div className="p-content">
                  <div className="p-page-header">
                    <h1 className="p-page-title">Dashboard</h1>
                  </div>
                  <div className="p-stats-grid">
                    <div className="p-stat-card">
                      <div className="p-stat-card__label">Impressions</div>
                      <div className="p-stat-card__value">12,480</div>
                      <div className="p-stat-card__sub">Last 30 days</div>
                    </div>
                    <div className="p-stat-card">
                      <div className="p-stat-card__label">Clicks</div>
                      <div className="p-stat-card__value">347</div>
                      <div className="p-stat-card__sub">Last 30 days</div>
                    </div>
                    <div className="p-stat-card">
                      <div className="p-stat-card__label">Listings</div>
                      <div className="p-stat-card__value">3</div>
                      <div className="p-stat-card__sub">Active</div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </Section>

        {/* ── Stat cards standalone ──────────────────────────── */}
        <Section title="Stat Cards">
          <div className="p-stats-grid">
            <div className="p-stat-card">
              <div className="p-stat-card__label">Impressions</div>
              <div className="p-stat-card__value">12,480</div>
              <div className="p-stat-card__sub">Last 30 days</div>
            </div>
            <div className="p-stat-card">
              <div className="p-stat-card__label">Clicks</div>
              <div className="p-stat-card__value">347</div>
              <div className="p-stat-card__sub">Last 30 days</div>
            </div>
            <div className="p-stat-card">
              <div className="p-stat-card__label">CTR</div>
              <div className="p-stat-card__value">2.8%</div>
              <div className="p-stat-card__sub">vs 2.1% prior period</div>
            </div>
            <div className="p-stat-card">
              <div className="p-stat-card__label">Active Listings</div>
              <div className="p-stat-card__value">3</div>
              <div className="p-stat-card__sub">of 5 allowed</div>
            </div>
          </div>
        </Section>

        {/* ── Buttons ────────────────────────────────────────── */}
        <Section title="Buttons">
          <div className="e4s-inline-a52ea15e" >
            <button className="p-btn p-btn--primary">Primary action</button>
            <button className="p-btn">Default</button>
            <button className="p-btn p-btn--danger">Delete</button>
            <button className="p-btn p-btn--primary" disabled>Disabled</button>
            <button className="p-btn p-btn--sm">Small</button>
            <button className="p-btn p-btn--primary p-btn--sm">Small primary</button>
          </div>
        </Section>

        {/* ── Status chips ───────────────────────────────────── */}
        <Section title="Status Chips">
          <div className="e4s-inline-89481a99" >
            <span className="p-status-chip p-status-chip--active">Active</span>
            <span className="p-status-chip p-status-chip--pending">Pending review</span>
            <span className="p-status-chip p-status-chip--rejected">Rejected</span>
            <span className="p-status-chip p-status-chip--expired">Expired</span>
            <span className="p-status-chip">Unknown</span>
          </div>
        </Section>

        {/* ── Filter chips ───────────────────────────────────── */}
        <Section title="Filter Chips">
          <div className="e4s-inline-9897f202" >
            <div className="p-filter-chip"><a href="#">All cities</a></div>
            <div className="p-filter-chip"><a href="#">Sydney</a></div>
            <div className="p-filter-chip"><a href="#">Melbourne</a></div>
            <div className="p-filter-chip"><a href="#">Brisbane</a></div>
          </div>
        </Section>

        {/* ── Tabs ────────────────────────────────────────────── */}
        <Section title="Tabs">
          <div className="p-tabs">
            <button className="p-tab p-tab--active">Overview</button>
            <button className="p-tab">Listings</button>
            <button className="p-tab">Events</button>
            <button className="p-tab">Banners</button>
          </div>
        </Section>

        {/* ── Alerts / banners ───────────────────────────────── */}
        <Section title="Alerts">
          <div className="e4s-inline-50d5eadc" >
            <div className="p-alert p-alert--ok">Listing approved and live on the directory.</div>
            <div className="p-alert p-alert--warn">Your plan expires in 7 days. Renew to keep your listings live.</div>
            <div className="p-alert p-alert--err">Payment failed. Update your billing details to continue.</div>
            <div className="p-success-banner">Request sent! We'll review your details within 1 business day.</div>
          </div>
        </Section>

        {/* ── Form elements ──────────────────────────────────── */}
        <Section title="Form Elements">
          <div className="e4s-inline-f5f4fff1" >
            <div className="p-form-group">
              <label className="p-label">Business name *</label>
              <input className="p-input" placeholder="Your business name" defaultValue="" />
            </div>
            <div className="p-form-row">
              <div className="p-form-group">
                <label className="p-label">City *</label>
                <select className="p-select">
                  <option value="">Select city…</option>
                  <option>Sydney</option>
                  <option>Melbourne</option>
                  <option>Brisbane</option>
                </select>
              </div>
              <div className="p-form-group">
                <label className="p-label">Category *</label>
                <select className="p-select">
                  <option value="">Select…</option>
                  <option>Speed Dating</option>
                  <option>Dinner Parties</option>
                </select>
              </div>
            </div>
            <div className="p-form-group">
              <label className="p-label">Website</label>
              <input className="p-input" type="url" placeholder="https://yourwebsite.com.au" />
            </div>
            <div className="p-form-group">
              <label className="p-label">Additional info</label>
              <textarea className="p-textarea" placeholder="Anything we should know…" rows={3} />
            </div>
          </div>
        </Section>

        {/* ── Table ──────────────────────────────────────────── */}
        <Section title="Table">
          <div className="p-card">
            <div className="p-card__header">
              <h2 className="p-card__title">My Listings</h2>
              <button className="p-btn p-btn--primary p-btn--sm">Request listing</button>
            </div>
            <div className="p-table-wrap">
              <table className="p-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Speed Date Sydney</td>
                    <td>Sydney</td>
                    <td>Speed Dating</td>
                    <td><span className="p-status-chip p-status-chip--active">Active</span></td>
                    <td><a href="#" className="p-link">Edit</a></td>
                  </tr>
                  <tr>
                    <td>Dinner Parties Melb</td>
                    <td>Melbourne</td>
                    <td>Dinner Parties</td>
                    <td><span className="p-status-chip p-status-chip--pending">Pending</span></td>
                    <td><a href="#" className="p-link">Edit</a></td>
                  </tr>
                  <tr>
                    <td>Adventure Club BNE</td>
                    <td>Brisbane</td>
                    <td>Adventure</td>
                    <td><span className="p-status-chip p-status-chip--rejected">Rejected</span></td>
                    <td><a href="#" className="p-link">Edit</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* ── Empty state ────────────────────────────────────── */}
        <Section title="Empty State">
          <div className="p-empty">
            <div className="p-empty__icon">📋</div>
            <div className="p-empty__title">No listings yet</div>
            <p className="p-empty__body">Request your first listing to get started on Events4Singles.</p>
            <button className="p-btn p-btn--primary">Request a listing</button>
          </div>
        </Section>

        {/* ── Upload zone ────────────────────────────────────── */}
        <Section title="Upload Zone">
          <div className="p-upload-zone">
            <p className="p-upload-zone__label">Drop banner image here or click to upload</p>
            <p className="p-upload-zone__hint">PNG or JPG · 970 × 90 px · max 500 KB</p>
            <button className="p-btn p-btn--sm e4s-inline-40d8d379" >Browse files</button>
          </div>
        </Section>

        {/* ── Chart placeholder ──────────────────────────────── */}
        <Section title="Chart Placeholder">
          <div className="p-card">
            <div className="p-card__header">
              <h2 className="p-card__title">Impressions over time</h2>
            </div>
            <div className="p-chart-placeholder">
              Chart coming soon
            </div>
          </div>
        </Section>

        {/* ── Plan cards ─────────────────────────────────────── */}
        <Section title="Plan Cards">
          <div className="p-plans-grid">
            <div className="p-plan-card">
              <div className="p-plan-card__name">Starter</div>
              <div className="p-plan-card__price">$39<span className="p-plan-card__period">/mo</span></div>
              <ul className="p-plan-card__features">
                <li>1 listing placement</li>
                <li>2 cities</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
              <button className="p-btn p-plan-card__cta">Get started</button>
            </div>
            <div className="p-plan-card p-plan-card--featured">
              <div className="p-plan-card__name">Professional</div>
              <div className="p-plan-card__price">$99<span className="p-plan-card__period">/mo</span></div>
              <ul className="p-plan-card__features">
                <li>3 listing placements</li>
                <li>All cities</li>
                <li>Banner ads included</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
              </ul>
              <button className="p-btn p-btn--primary p-plan-card__cta">Get started</button>
            </div>
            <div className="p-plan-card">
              <div className="p-plan-card__name">Premium</div>
              <div className="p-plan-card__price">$249<span className="p-plan-card__period">/mo</span></div>
              <ul className="p-plan-card__features">
                <li>Unlimited listings</li>
                <li>All cities + featured</li>
                <li>Premium banner slots</li>
                <li>Dedicated account manager</li>
                <li>Custom reporting</li>
              </ul>
              <button className="p-btn p-plan-card__cta">Contact us</button>
            </div>
          </div>
        </Section>

        {/* ── Modal (inline, always visible) ────────────────── */}
        <Section title="Modal">
          <div className="e4s-inline-42cd09aa" >
            <div className="p-modal e4s-inline-7775cebf" >
              <div className="p-modal__box">
                <div className="p-modal__header">
                  <h2 className="p-modal__title">Request a listing</h2>
                  <button className="p-modal__close" aria-label="Close">×</button>
                </div>
                <div className="p-modal__body">
                  <div className="p-form-group">
                    <label className="p-label">Business name *</label>
                    <input className="p-input" placeholder="Your business name" />
                  </div>
                  <div className="p-form-row">
                    <div className="p-form-group">
                      <label className="p-label">City *</label>
                      <select className="p-select">
                        <option>Select city…</option>
                      </select>
                    </div>
                    <div className="p-form-group">
                      <label className="p-label">Category *</label>
                      <select className="p-select">
                        <option>Select…</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-modal__footer">
                  <button className="p-btn">Cancel</button>
                  <button className="p-btn p-btn--primary">Submit request</button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Card component ─────────────────────────────────── */}
        <Section title="Card">
          <div className="p-card">
            <div className="p-card__header">
              <h2 className="p-card__title">Banner Ads</h2>
              <button className="p-btn p-btn--primary p-btn--sm">Upload banner</button>
            </div>
            <div className="p-card__body">
              <p className="e4s-inline-97e3068a" >
                Banner ads appear at the top of category and city pages. Upload a 970 × 90 px image to get started.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Token reference ────────────────────────────────── */}
        <Section title="Colour Tokens">
          <div className="e4s-inline-7fedb58f" >
            {[
              ["--p-teal", "#0d9488", "e4s-portal-preview-swatch--p-teal"],
              ["--p-teal-hover", "#0f766e", "e4s-portal-preview-swatch--p-teal-hover"],
              ["--p-teal-light", "#f0fdfa", "e4s-portal-preview-swatch--p-teal-light"],
              ["--p-maroon", "#8b2f43", "e4s-portal-preview-swatch--p-maroon"],
              ["--p-maroon-hover", "#6b2033", "e4s-portal-preview-swatch--p-maroon-hover"],
              ["--p-ink", "#14313f", "e4s-portal-preview-swatch--p-ink"],
              ["--p-ink-muted", "#647887", "e4s-portal-preview-swatch--p-ink-muted"],
              ["--p-ink-faint", "#9ab0bc", "e4s-portal-preview-swatch--p-ink-faint"],
              ["--p-bg", "#f8fafb", "e4s-portal-preview-swatch--p-bg"],
              ["--p-surface", "#ffffff", "e4s-portal-preview-swatch--p-surface"],
              ["--p-surface-2", "#f0f4f7", "e4s-portal-preview-swatch--p-surface-2"],
              ["--p-border", "#dde4ea", "e4s-portal-preview-swatch--p-border"],
              ["--p-sidebar-bg", "#14313f", "e4s-portal-preview-swatch--p-sidebar-bg"],
              ["--p-sidebar-active", "#2dd4bf", "e4s-portal-preview-swatch--p-sidebar-active"],
            ].map(([token, hex, swatchClass]) => (
              <div key={token} className="e4s-inline-1d6a9405" >
                <div className={`e4s-portal-preview-swatch ${swatchClass}`} />
                <div>
                  <div className="e4s-inline-a46e9e3f" >{token}</div>
                  <div className="e4s-inline-31bcf3d6" >{hex}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="e4s-inline-dc53681c" >
      <h2 className="e4s-inline-788b0d4f" >{title}</h2>
      {children}
    </div>
  );
}
