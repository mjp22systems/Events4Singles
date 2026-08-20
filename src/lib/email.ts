export function buildWelcomeEmail(firstName: string | null, city: string | null) {
  const name = firstName?.trim() || "there";
  const cityLine = city ? `events in <strong>${city}</strong>` : "singles events near you";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to Events4Singles</title>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,600;0,8..60,700;1,8..60,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  body { margin:0; padding:0; background:#f5faf9; font-family:'Hanken Grotesk',Arial,Helvetica,sans-serif; }
  a { color:#0d9488; text-decoration:none; }
  .wrap { max-width:600px; margin:0 auto; background:#ffffff; }
  .header { background:linear-gradient(135deg,#064e4d 0%,#0d9488 60%,#8b2f43 100%); padding:40px 40px 36px; text-align:center; }
  .logo { font-family:'Source Serif 4',Georgia,serif; font-size:26px; font-weight:700; color:#ffffff; letter-spacing:-0.5px; margin:0 0 4px; }
  .logo em { color:#f9a8d4; font-style:normal; }
  .logo-sub { font-family:'Hanken Grotesk',Arial,sans-serif; font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.65); margin:0; }
  .hero { background:#f0faf9; padding:44px 40px 36px; border-bottom:1px solid #bddedb; text-align:center; }
  .hero h1 { font-family:'Source Serif 4',Georgia,serif; font-size:30px; font-weight:700; color:#064e4d; margin:0 0 14px; line-height:1.25; }
  .hero p { font-size:16px; color:#5f7180; line-height:1.7; margin:0 0 28px; }
  .btn { display:inline-block; background:#0d9488; color:#ffffff!important; font-family:'Hanken Grotesk',Arial,sans-serif; font-size:14px; font-weight:700; letter-spacing:0.04em; padding:14px 32px; border-radius:8px; text-decoration:none; }
  .body { padding:40px; }
  .section-title { font-family:'Source Serif 4',Georgia,serif; font-size:20px; font-weight:700; color:#064e4d; margin:0 0 20px; }
  .tiles { display:table; width:100%; border-collapse:separate; border-spacing:0 0; }
  .tile { display:table-row; }
  .tile-icon { display:table-cell; width:52px; padding:0 14px 20px 0; vertical-align:top; }
  .tile-icon span { display:block; width:40px; height:40px; border-radius:10px; background:#e6f7f5; line-height:40px; text-align:center; font-size:20px; }
  .tile-body { display:table-cell; padding:0 0 20px; vertical-align:top; }
  .tile-body strong { display:block; font-size:14px; font-weight:700; color:#14313f; margin-bottom:3px; }
  .tile-body span { font-size:13px; color:#5f7180; line-height:1.5; }
  .divider { border:none; border-top:1px solid #e5f0ee; margin:8px 0 32px; }
  .events-teaser { background:#f0faf9; border:1px solid #bddedb; border-radius:12px; padding:28px; margin:0 0 32px; }
  .events-teaser p { margin:0 0 16px; font-size:14px; color:#5f7180; line-height:1.6; }
  .event-pill { display:inline-block; background:#ffffff; border:1px solid #bddedb; border-radius:6px; padding:6px 12px; margin:0 6px 8px 0; font-size:12px; font-weight:600; color:#064e4d; }
  .footer { background:#064e4d; padding:28px 40px; text-align:center; }
  .footer p { font-size:12px; color:rgba(255,255,255,0.55); margin:0 0 6px; line-height:1.7; }
  .footer a { color:rgba(255,255,255,0.75); text-decoration:underline; }
</style>
</head>
<body>
<div class="wrap">

  <!-- HEADER / LOGO -->
  <div class="header">
    <p class="logo">Events4<em>Singles</em></p>
    <p class="logo-sub">Australia&rsquo;s Premier Singles Events Directory</p>
  </div>

  <!-- HERO -->
  <div class="hero">
    <h1>You&rsquo;re in, ${name}! 🎉</h1>
    <p>
      You&rsquo;re now subscribed to ${cityLine}.<br />
      We&rsquo;ll send you curated event picks, early-bird alerts,<br />
      and exclusive offers — nothing spammy, ever.
    </p>
    <a class="btn" href="https://events4singles.com/events">Browse Upcoming Events &rarr;</a>
  </div>

  <!-- BODY -->
  <div class="body">

    <p class="section-title">What you&rsquo;ll get</p>
    <div class="tiles">
      <div class="tile">
        <div class="tile-icon"><span>📅</span></div>
        <div class="tile-body">
          <strong>Weekly Event Roundups</strong>
          <span>The best speed dating nights, dinner parties, and social mixers in your city — delivered every Monday.</span>
        </div>
      </div>
      <div class="tile">
        <div class="tile-icon"><span>⚡</span></div>
        <div class="tile-body">
          <strong>Early-Bird Alerts</strong>
          <span>Popular events sell out fast. Subscribers get first notice so you never miss the ones that matter.</span>
        </div>
      </div>
      <div class="tile">
        <div class="tile-icon"><span>🎟️</span></div>
        <div class="tile-body">
          <strong>Exclusive Offers</strong>
          <span>Subscriber-only discounts from event organisers who partner with Events4Singles.</span>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <!-- EVENTS TEASER -->
    <div class="events-teaser">
      <p class="section-title" style="font-size:17px;margin-bottom:12px;">Popular event types near you</p>
      <p>From intimate dinner-for-six to high-energy speed dating — there&rsquo;s a format for every personality.</p>
      <span class="event-pill">Speed Dating</span>
      <span class="event-pill">Dinner Parties</span>
      <span class="event-pill">Mixers &amp; Socials</span>
      <span class="event-pill">Dance Classes</span>
      <span class="event-pill">Singles Travel</span>
      <span class="event-pill">Adventure &amp; Sport</span>
    </div>

    <p style="font-size:14px;color:#5f7180;line-height:1.7;margin:0;">
      Want to promote your event to thousands of engaged singles?
      <a href="https://events4singles.com/advertise">View advertising packages &rarr;</a>
    </p>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p>Events4Singles &mdash; Australia&rsquo;s Premier Singles Events Directory</p>
    <p>
      You subscribed at <a href="https://events4singles.com">events4singles.com</a><br />
      No longer want emails? <a href="https://events4singles.com/unsubscribe">Unsubscribe here</a>
    </p>
  </div>

</div>
</body>
</html>`;

  const text = `Hi ${name},\n\nWelcome to Events4Singles! You're now subscribed to ${cityLine}.\n\nBrowse upcoming events: https://events4singles.com/events\n\nTo unsubscribe: https://events4singles.com/unsubscribe\n\n— Events4Singles`;

  return { html, text, subject: `Welcome to Events4Singles, ${name}!` };
}

export function buildSubscriberNotification(p: {
  email: string; firstName: string | null; city: string | null;
}) {
  function esc(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  const rows = [
    `<tr><td style="padding:9px 16px 9px 0;color:#5f7180;font-weight:600;white-space:nowrap;vertical-align:top;width:110px;">Email</td><td style="padding:9px 0;"><a href="mailto:${esc(p.email)}" style="color:#0d9488;text-decoration:none;">${esc(p.email)}</a></td></tr>`,
    p.firstName ? `<tr style="background:#f9fffe;"><td style="padding:9px 16px 9px 0;color:#5f7180;font-weight:600;white-space:nowrap;vertical-align:top;">Name</td><td style="padding:9px 0;color:#14313f;">${esc(p.firstName)}</td></tr>` : "",
    p.city      ? `<tr><td style="padding:9px 16px 9px 0;color:#5f7180;font-weight:600;white-space:nowrap;vertical-align:top;">City</td><td style="padding:9px 0;color:#14313f;">${esc(p.city)}</td></tr>` : "",
  ].join("");

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>New Subscriber</title></head>
<body style="margin:0;padding:20px;background:#f5faf9;font-family:Arial,Helvetica,sans-serif;color:#14313f;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
  <div style="background:linear-gradient(135deg,#064e4d 0%,#0d9488 60%,#8b2f43 100%);padding:24px 32px;">
    <p style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.3px;">New Subscriber</p>
    <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,.65);letter-spacing:.06em;text-transform:uppercase;">Events4Singles Mailing List</p>
  </div>
  <div style="padding:28px 32px 24px;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">${rows}</table>
  </div>
</div>
</body></html>`;

  const text = [
    "New Subscriber — Events4Singles",
    "",
    `Email: ${p.email}`,
    p.firstName ? `Name: ${p.firstName}` : null,
    p.city      ? `City: ${p.city}` : null,
  ].filter(Boolean).join("\n");

  return { html, text };
}

export async function sendViaResend({
  apiKey, fromName, fromEmail, replyTo, toEmail, subject, html, text,
}: {
  apiKey: string; fromName: string; fromEmail: string;
  replyTo?: string; toEmail: string; subject: string; html: string; text: string;
}) {
  const payload: Record<string, unknown> = { from: `${fromName} <${fromEmail}>`, to: toEmail, subject, html, text };
  if (replyTo) payload.reply_to = replyTo;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
  }
  return res.ok;
}
