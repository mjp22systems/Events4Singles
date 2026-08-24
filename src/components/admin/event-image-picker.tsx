"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { MediaAssetPurpose } from "@/lib/media-assets";

type MediaOption = {
  id: string;
  filename: string;
  content_type: string;
  byte_size: number;
  public_url: string;
  source: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  purpose?: MediaAssetPurpose;
  source?: string;
};

function formatBytes(value: number) {
  if (!value) return "";
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EventImagePicker({
  value,
  onChange,
  label = "Event Image",
  purpose = "event_image",
  source = "admin-event",
}: Props) {
  const [options, setOptions] = useState<MediaOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refreshLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/admin/api/media?purpose=${encodeURIComponent(purpose)}`, { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const body = await res.json() as { assets: MediaOption[] };
      setOptions(body.assets ?? []);
    } catch (error) {
      setMessage(String(error));
    } finally {
      setLoading(false);
    }
  }, [purpose]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshLibrary();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshLibrary]);

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const data = new FormData();
      data.set("file", file);
      data.set("source", source);
      data.set("purpose", purpose);
      const res = await fetch("/admin/api/media", { method: "POST", body: data });
      if (!res.ok) throw new Error(await res.text());
      const body = await res.json() as { asset: MediaOption };
      onChange(body.asset.public_url);
      setOptions((items) => [body.asset, ...items.filter((item) => item.public_url !== body.asset.public_url)]);
      setMessage("Uploaded");
    } catch (error) {
      setMessage(String(error));
    } finally {
      setUploading(false);
    }
  }

  const selected = useMemo(
    () => options.find((option) => option.public_url === value),
    [options, value]
  );

  return (
    <div className="admin-media-picker">
      <label className="a-label">{label}</label>
      <div className="admin-media-picker__preview">
        {value ? (
          <img src={value} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        ) : (
          <span>No image selected</span>
        )}
      </div>

      <div className="admin-media-picker__controls">
        <input
          className="a-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste image URL or upload/select below"
        />
        <select
          className="a-input"
          value={selected ? value : ""}
          onChange={(event) => {
            if (event.target.value) onChange(event.target.value);
          }}
          disabled={loading || options.length === 0}
        >
          <option value="">{loading ? "Loading image library..." : "Select from image library..."}</option>
          {options.map((option) => (
            <option key={`${option.id}-${option.public_url}`} value={option.public_url}>
              {option.filename}{option.byte_size ? ` (${formatBytes(option.byte_size)})` : ""}
            </option>
          ))}
        </select>
        <label className="admin-media-picker__upload">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => void upload(event.currentTarget.files?.[0])}
            disabled={uploading}
          />
          {uploading ? "Uploading..." : "Upload Image"}
        </label>
      </div>
      {message && <div className="admin-media-picker__message">{message}</div>}
    </div>
  );
}
