import type { Metadata } from "next";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import SettingsForm from "./settings-form";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

async function getSettings() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const rows = await env.DB.prepare("SELECT key, value FROM site_settings").all();
    const out: Record<string, string> = {};
    for (const row of rows.results as { key: string; value: string }[]) {
      out[row.key] = row.value;
    }
    return out;
  } catch {
    return {};
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Settings</h1>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
