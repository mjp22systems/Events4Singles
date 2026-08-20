export const metadata = { title: "Portal Design Preview | Events4Singles" };

export default function PortalPreviewPage() {
  return (
    <div style={{ fontFamily: "'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif", background: "#f8fafb", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 48, borderBottom: "1px solid #dde4ea", paddingBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#14313f" }}>Portal Design System</h1>
          <p style={{ margin: "8px 0 0", color: "#647887", fontSize: 14 }}>Events4Singles Advertiser Portal · <code>p-</code> class inventory</p>
        </div>

        {/* ── Shell preview ──────────────────────────────────── */}
        <Section title="Shell Layout">
          <div className="p-shell" style={{ height: 420, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 16px rgba(20,49,63,0.12)" }}>

            {/* Sidebar */}
            <aside className="p-sidebar" style={{ position: "relative" }}>
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
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
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
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span className="p-status-chip p-status-chip--active">Active</span>
            <span className="p-status-chip p-status-chip--pending">Pending review</span>
            <span className="p-status-chip p-status-chip--rejected">Rejected</span>
            <span className="p-status-chip p-status-chip--expired">Expired</span>
            <span className="p-status-chip">Unknown</span>
          </div>
        </Section>

        {/* ── Filter chips ───────────────────────────────────── */}
        <Section title="Filter Chips">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="p-alert p-alert--ok">Listing approved and live on the directory.</div>
            <div className="p-alert p-alert--warn">Your plan expires in 7 days. Renew to keep your listings live.</div>
            <div className="p-alert p-alert--err">Payment failed. Update your billing details to continue.</div>
            <div className="p-success-banner">Request sent! We'll review your details within 1 business day.</div>
          </div>
        </Section>

        {/* ── Form elements ──────────────────────────────────── */}
        <Section title="Form Elements">
          <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 16 }}>
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
            <button className="p-btn p-btn--sm" style={{ marginTop: 8 }}>Browse files</button>
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
          <div style={{ position: "relative", height: 420, background: "rgba(10,25,33,0.32)", borderRadius: 12, overflow: "hidden" }}>
            <div className="p-modal" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
              <p style={{ color: "var(--p-ink-muted)", margin: 0 }}>
                Banner ads appear at the top of category and city pages. Upload a 970 × 90 px image to get started.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Token reference ────────────────────────────────── */}
        <Section title="Colour Tokens">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {[
              ["--p-teal", "#0d9488"],
              ["--p-teal-hover", "#0f766e"],
              ["--p-teal-light", "#f0fdfa"],
              ["--p-maroon", "#8b2f43"],
              ["--p-maroon-hover", "#6b2033"],
              ["--p-ink", "#14313f"],
              ["--p-ink-muted", "#647887"],
              ["--p-ink-faint", "#9ab0bc"],
              ["--p-bg", "#f8fafb"],
              ["--p-surface", "#ffffff"],
              ["--p-surface-2", "#f0f4f7"],
              ["--p-border", "#dde4ea"],
              ["--p-sidebar-bg", "#14313f"],
              ["--p-sidebar-active", "#2dd4bf"],
            ].map(([token, hex]) => (
              <div key={token} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: hex, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "#647887" }}>{token}</div>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "#14313f" }}>{hex}</div>
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
    <div style={{ marginBottom: 56 }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#647887" }}>{title}</h2>
      {children}
    </div>
  );
}
