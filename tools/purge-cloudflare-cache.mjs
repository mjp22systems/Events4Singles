const token = process.env.CLOUDFLARE_API_TOKEN_DAD;
const zoneId = process.env.CLOUDFLARE_ZONE_ID_DAD ?? "c5fe90c1608ef88a0dca1e1cb96bcf2c";

process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= "0";

if (!token) {
  console.error("Missing CLOUDFLARE_API_TOKEN_DAD. This Dad-account env var is required to purge cache.");
  process.exit(1);
}

if (process.argv.includes("--dry-run")) {
  console.log(`Would purge Cloudflare cache for zone ${zoneId}.`);
  process.exit(0);
}

const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ purge_everything: true }),
});

const body = await response.json();
if (!response.ok || !body.success) {
  console.error(JSON.stringify(body, null, 2));
  process.exit(1);
}

console.log(`Purged Cloudflare cache for zone ${zoneId}.`);
