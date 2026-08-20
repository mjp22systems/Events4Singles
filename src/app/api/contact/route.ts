import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sendViaResend } from "@/lib/email";

const INQUIRY_LABELS: Record<string, string> = {
  general:     "General Enquiry",
  advertise:   "Advertising / New Listing",
  correction:  "Listing Correction or Update",
  event:       "Event Submission",
  partnership: "Partnership or Media",
  feedback:    "Feedback or Suggestion",
  other:       "Other",
};

async function verifyTurnstile(token: string, secret: string, ip: string) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json() as { success: boolean };
  return data.success;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}

function buildNotificationEmail(p: {
  name: string; email: string; phone: string;
  inquiryLabel: string; city: string; subject: string; message: string;
}) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>New Contact Enquiry</title></head>
<body style="margin:0;padding:20px;background:#f5faf9;font-family:Arial,Helvetica,sans-serif;color:#14313f;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
  <div style="background:linear-gradient(135deg,#064e4d 0%,#0d9488 60%,#8b2f43 100%);padding:24px 32px;">
    <p style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.3px;">New Contact Enquiry</p>
    <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,.65);letter-spacing:.06em;text-transform:uppercase;">Events4Singles Contact Form</p>
  </div>
  <div style="padding:28px 32px 8px;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">
      <tr><td style="padding:9px 16px 9px 0;color:#5f7180;font-weight:600;white-space:nowrap;vertical-align:top;width:110px;">Type</td><td style="padding:9px 0;color:#14313f;">${esc(p.inquiryLabel)}</td></tr>
      <tr style="background:#f9fffe;"><td style="padding:9px 16px 9px 0;color:#5f7180;font-weight:600;white-space:nowrap;vertical-align:top;">Name</td><td style="padding:9px 0;color:#14313f;">${esc(p.name)}</td></tr>
      <tr><td style="padding:9px 16px 9px 0;color:#5f7180;font-weight:600;white-space:nowrap;vertical-align:top;">Email</td><td style="padding:9px 0;"><a href="mailto:${esc(p.email)}" style="color:#0d9488;text-decoration:none;">${esc(p.email)}</a></td></tr>
      ${p.phone ? `<tr style="background:#f9fffe;"><td style="padding:9px 16px 9px 0;color:#5f7180;font-weight:600;white-space:nowrap;vertical-align:top;">Phone</td><td style="padding:9px 0;color:#14313f;">${esc(p.phone)}</td></tr>` : ""}
      ${p.city ? `<tr><td style="padding:9px 16px 9px 0;color:#5f7180;font-weight:600;white-space:nowrap;vertical-align:top;">City</td><td style="padding:9px 0;color:#14313f;">${esc(p.city)}</td></tr>` : ""}
      <tr style="background:#f9fffe;"><td style="padding:9px 16px 9px 0;color:#5f7180;font-weight:600;white-space:nowrap;vertical-align:top;">Subject</td><td style="padding:9px 0;color:#14313f;">${esc(p.subject)}</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #e5f0ee;margin:20px 0 16px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#5f7180;text-transform:uppercase;letter-spacing:.08em;">Message</p>
    <div style="background:#f9fffe;border:1px solid #e5f0ee;border-radius:6px;padding:16px 18px;font-size:14px;color:#14313f;line-height:1.75;">${esc(p.message)}</div>
    <p style="margin:20px 0 24px;font-size:12px;color:#9bb0b0;">Hit Reply to respond directly to ${esc(p.name)} at ${esc(p.email)}.</p>
  </div>
</div>
</body></html>`;
}

function buildNotificationText(p: {
  name: string; email: string; phone: string;
  inquiryLabel: string; city: string; subject: string; message: string;
}) {
  return [
    "New Contact Enquiry — Events4Singles",
    "",
    `Type: ${p.inquiryLabel}`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    p.phone ? `Phone: ${p.phone}` : null,
    p.city  ? `City: ${p.city}` : null,
    `Subject: ${p.subject}`,
    "",
    "Message:",
    p.message,
  ].filter((l) => l !== null).join("\n");
}

function buildAutoReply(name: string) {
  const first = name.split(" ")[0];
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>We received your message</title></head>
<body style="margin:0;padding:20px;background:#f5faf9;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
  <div style="background:linear-gradient(135deg,#064e4d 0%,#0d9488 60%,#8b2f43 100%);padding:28px 32px;">
    <p style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-.5px;">Events4<em style="font-style:normal;color:#f9a8d4;">Singles</em></p>
    <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,.6);letter-spacing:.1em;text-transform:uppercase;">Australia&rsquo;s Premier Singles Events Directory</p>
  </div>
  <div style="padding:36px 32px 28px;">
    <h1 style="margin:0 0 14px;font-size:22px;color:#064e4d;line-height:1.3;">Thanks for getting in touch, ${first}!</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#5f7180;line-height:1.7;">
      We&rsquo;ve received your message and will get back to you within
      <strong style="color:#14313f;">1 business day</strong>.
    </p>
    <p style="margin:0 0 0;font-size:14px;color:#9bb0b0;line-height:1.6;">
      In the meantime, browse upcoming singles events at
      <a href="https://events4singles.com/events" style="color:#0d9488;text-decoration:none;">events4singles.com/events</a>
    </p>
  </div>
  <div style="background:#064e4d;padding:20px 32px;text-align:center;">
    <p style="margin:0;font-size:12px;color:rgba(255,255,255,.5);">
      Events4Singles &mdash; Australia&rsquo;s Premier Singles Events Directory
    </p>
  </div>
</div>
</body></html>`;
}

export async function POST(req: NextRequest) {
  let body: {
    name?: string; email?: string; phone?: string;
    inquiryType?: string; city?: string; subject?: string;
    message?: string; website?: string; cfToken?: string;
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  // Honeypot
  if (body.website) return NextResponse.json({ ok: true });

  const name        = (body.name ?? "").trim();
  const email       = (body.email ?? "").trim().toLowerCase();
  const phone       = (body.phone ?? "").trim();
  const inquiryType = (body.inquiryType ?? "").trim();
  const city        = (body.city ?? "").trim();
  const subject     = (body.subject ?? "").trim();
  const message     = (body.message ?? "").trim();

  if (!name)   return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
  if (!inquiryType || !INQUIRY_LABELS[inquiryType])
    return NextResponse.json({ error: "Please select an enquiry type" }, { status: 400 });
  if (!subject) return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  const { env } = await getCloudflareContext({ async: true });

  // Turnstile verification
  const turnstileSecret = (env as unknown as Record<string, string>).TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    if (!body.cfToken) return NextResponse.json({ error: "Verification required" }, { status: 400 });
    const ip = req.headers.get("CF-Connecting-IP") ?? "";
    const valid = await verifyTurnstile(body.cfToken, turnstileSecret, ip);
    if (!valid) return NextResponse.json({ error: "Verification failed — please try again" }, { status: 400 });
  }

  const resendKey = (env as unknown as Record<string, string>).RESEND_API_KEY;
  if (!resendKey) {
    console.error("RESEND_API_KEY not configured — contact form email not sent");
    return NextResponse.json({ ok: true });
  }

  const rows = await env.DB.prepare(
    "SELECT key, value FROM site_settings WHERE key IN ('subscribe_from_name','subscribe_from_email','notification_email')"
  ).all();
  const s: Record<string, string> = {};
  for (const row of rows.results as { key: string; value: string }[]) s[row.key] = row.value;

  const fromName    = s.subscribe_from_name  ?? "Events4Singles";
  const fromEmail   = s.subscribe_from_email ?? "hello@events4singles.com";
  const notifyEmail = s.notification_email?.trim() ?? fromEmail;
  const inquiryLabel = INQUIRY_LABELS[inquiryType]!;

  await sendViaResend({
    apiKey: resendKey,
    fromName,
    fromEmail,
    replyTo: email,
    toEmail: notifyEmail,
    subject: `[Contact] ${inquiryLabel} — ${name}`,
    html: buildNotificationEmail({ name, email, phone, inquiryLabel, city, subject, message }),
    text: buildNotificationText({ name, email, phone, inquiryLabel, city, subject, message }),
  });

  await sendViaResend({
    apiKey: resendKey,
    fromName,
    fromEmail,
    toEmail: email,
    subject: "We received your message — Events4Singles",
    html: buildAutoReply(name),
    text: `Hi ${name.split(" ")[0]},\n\nThanks for contacting Events4Singles. We'll reply within 1 business day.\n\nBrowse events: https://events4singles.com/events\n\n— Events4Singles`,
  });

  return NextResponse.json({ ok: true });
}
