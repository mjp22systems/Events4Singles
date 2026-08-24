"use client";

import { useEffect, useState } from "react";
import type { Business } from "@/lib/types";

interface Props {
  business: Business;
}

export default function ProfileEditDrawer({ business }: Props) {
  const [open, setOpen] = useState(false);
  const [overrideClaimed, setOverrideClaimed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isClaimed = !!business.advertiser_id;
  const fieldsLocked = isClaimed && !overrideClaimed;

  const [fields, setFields] = useState({
    name: business.name ?? "",
    description: business.description ?? "",
    logo_url: business.logo_url ?? "",
    website: business.website ?? "",
  });

  useEffect(() => {
    if (open) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => document.body.classList.remove("drawer-open");
  }, [open]);

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((f) => ({ ...f, [key]: e.target.value }));
    };
  }

  async function save() {
    if (fieldsLocked) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/admin/api/businesses/${business.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        const j = await res.json() as { error?: string };
        setError(j.error ?? "Save failed");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="e4s-admin-bar">
        <span className="e4s-admin-bar__label">Admin</span>
        {saved && <span className="e4s-admin-bar__saved">Saved</span>}
        <button className="e4s-admin-bar__btn" onClick={() => setOpen(true)} type="button">
          Edit Profile
        </button>
      </div>

      {open && (
        <aside className="e4s-edit-drawer" role="dialog" aria-label="Edit profile">
          <div className="e4s-edit-drawer__head">
            <h2 className="e4s-edit-drawer__title">Edit profile #{business.id}</h2>
            <button className="e4s-edit-drawer__close" onClick={() => setOpen(false)} type="button" aria-label="Close">x</button>
          </div>
          <div className="e4s-edit-drawer__body">
            {isClaimed && (
              <div className="e4s-edit-drawer__error">
                Claimed profile. Changes may overwrite advertiser-managed information.
                {!overrideClaimed && (
                  <button className="e4s-edit-drawer__cancel" onClick={() => setOverrideClaimed(true)} type="button">
                    Override
                  </button>
                )}
              </div>
            )}
            {error && <p className="e4s-edit-drawer__error">{error}</p>}

            <div className="e4s-edit-drawer__section">Profile</div>
            <Field label="Business name">
              <input type="text" value={fields.name} onChange={set("name")} disabled={fieldsLocked} />
            </Field>
            <Field label="Description">
              <textarea rows={5} value={fields.description} onChange={set("description")} disabled={fieldsLocked} />
            </Field>
            <Field label="Logo URL">
              <input type="text" value={fields.logo_url} onChange={set("logo_url")} disabled={fieldsLocked} />
            </Field>
            <Field label="Website">
              <input type="text" value={fields.website} onChange={set("website")} disabled={fieldsLocked} />
            </Field>
          </div>
          <div className="e4s-edit-drawer__footer">
            <button className="e4s-edit-drawer__cancel" onClick={() => setOpen(false)} type="button">Cancel</button>
            <button className="e4s-edit-drawer__save" onClick={save} disabled={saving || fieldsLocked} type="button">
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="e4s-edit-field">
      <label className="e4s-edit-field__label">{label}</label>
      {children}
    </div>
  );
}
