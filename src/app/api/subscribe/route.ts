import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { buildWelcomeEmail, buildSubscriberNotification, sendViaResend } from "@/lib/email";

async function verifyTurnstile(token: string, secret: string, ip: string) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json() as { success: boolean };
  return data.success;
}

export async function POST(req: NextRequest) {
  let body: { email?: string; firstName?: string; city?: string; website?: string; cfToken?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  // Honeypot — bots fill the hidden website field
  if (body.website) return NextResponse.json({ ok: true });

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });

  // Turnstile verification (only if secret key is configured)
  const turnstileSecret = (env as unknown as Record<string, string>).TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    if (!body.cfToken) return NextResponse.json({ error: "Verification required" }, { status: 400 });
    const ip = req.headers.get("CF-Connecting-IP") ?? "";
    const ok = await verifyTurnstile(body.cfToken, turnstileSecret, ip);
    if (!ok) return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  // Insert subscriber
  try {
    await env.DB.prepare("INSERT INTO subscribers (email, first_name, city) VALUES (?, ?, ?)")
      .bind(email, body.firstName?.trim() || null, body.city?.trim() || null)
      .run();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes("UNIQUE") && !msg.includes("unique")) {
      console.error("subscribe insert error", msg);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
    // Already subscribed — still send 200, no duplicate email
    return NextResponse.json({ ok: true });
  }

  // Send welcome email via Resend
  const resendKey = (env as unknown as Record<string, string>).RESEND_API_KEY;
  if (resendKey) {
    const settings = await env.DB.prepare(
      "SELECT key, value FROM site_settings WHERE key IN ('subscribe_from_name','subscribe_from_email')"
    ).all();
    const s: Record<string, string> = {};
    for (const row of settings.results as { key: string; value: string }[]) s[row.key] = row.value;

    const { html, text, subject } = buildWelcomeEmail(body.firstName ?? null, body.city ?? null);
    await sendViaResend({
      apiKey: resendKey,
      fromName: s.subscribe_from_name ?? "Events4Singles",
      fromEmail: s.subscribe_from_email ?? "hello@events4singles.com",
      toEmail: email,
      subject, html, text,
    });

    // Admin notification
    const notifyRow = await env.DB.prepare(
      "SELECT value FROM site_settings WHERE key='notification_email'"
    ).first() as { value: string } | null;
    const notifyEmail = notifyRow?.value?.trim();
    if (notifyEmail) {
      const notif = buildSubscriberNotification({ email, firstName: body.firstName ?? null, city: body.city ?? null });
      await sendViaResend({
        apiKey: resendKey,
        fromName: s.subscribe_from_name ?? "Events4Singles",
        fromEmail: s.subscribe_from_email ?? "hello@events4singles.com",
        toEmail: notifyEmail,
        subject: `New subscriber: ${email}`,
        html: notif.html,
        text: notif.text,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
