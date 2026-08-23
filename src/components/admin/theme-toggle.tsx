"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "e4s-admin-theme";

export default function AdminThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
    setTheme(savedTheme);
    document.documentElement.dataset.adminTheme = savedTheme;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.adminTheme = theme;
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.adminTheme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button className="admin-theme-toggle" type="button" onClick={toggle} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
