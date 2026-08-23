import type { ReactNode } from "react";
import Link from "next/link";

type AdminAddModalProps = {
  eyebrow?: string;
  title: string;
  closeHref: string;
  children: ReactNode;
};

export default function AdminAddModal({ eyebrow = "Create", title, closeHref, children }: AdminAddModalProps) {
  return (
    <div className="admin-modal-backdrop">
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-add-modal-title">
        <div className="admin-modal__head">
          <div>
            <div className="admin-modal__eyebrow">{eyebrow}</div>
            <h2 id="admin-add-modal-title" className="admin-modal__title">
              {title}
            </h2>
          </div>
          <Link href={closeHref} className="admin-modal__close" aria-label="Close">
            Close
          </Link>
        </div>
        <div className="admin-modal__body">{children}</div>
      </section>
    </div>
  );
}
