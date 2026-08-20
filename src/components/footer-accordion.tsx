"use client";
import { useEffect, useState } from "react";

interface Props {
  heading: string;
  id: string;
  children: React.ReactNode;
}

export default function FooterAccordion({ heading, id, children }: Props) {
  const key = `e4s-footer-${id}`;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) setOpen(saved === "1");
  }, [key]);

  function toggle() {
    setOpen((v) => {
      const next = !v;
      localStorage.setItem(key, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className={`e4s-footer__accordion${open ? " e4s-footer__accordion--open" : ""}`}>
      <h2 className="e4s-footer__accordion-heading">
        <button
          aria-controls={id}
          aria-expanded={open}
          className="e4s-footer__accordion-btn"
          onClick={toggle}
          type="button"
        >
          {heading}
        </button>
      </h2>
      <div className="e4s-footer__accordion-body" id={id}>
        {children}
      </div>
    </div>
  );
}
