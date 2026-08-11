import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Events4Singles for advertising enquiries, listing corrections, or general questions.",
};

export default function ContactPage() {
  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <h1>Contact Us</h1>
      <p className="e4s-lead">
        Advertising enquiries, listing corrections, or general questions — we're here to help.
      </p>

      <section>
        <h2>Advertising &amp; listings</h2>
        <p>
          To list your singles event, service or business on Events4Singles, or to update
          an existing listing, email us at{" "}
          <a href="mailto:advertising@events4singles.com.au">advertising@events4singles.com.au</a>.
        </p>
        <p>
          You can also <a href="/portal">set up a listing online</a> — packages start from $39/month.
        </p>
      </section>

      <section>
        <h2>General enquiries</h2>
        <p>
          For all other questions, email{" "}
          <a href="mailto:info@events4singles.com.au">info@events4singles.com.au</a>.
        </p>
      </section>

      <section>
        <h2>Events calendar</h2>
        <p>
          To submit an event for the calendar, your business must have an active Events4Singles
          listing. Calendar placement is available as an add-on to Starter, Professional and
          Premium packages.
        </p>
      </section>
    </main>
  );
}
