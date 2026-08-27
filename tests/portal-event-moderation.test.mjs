import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

test("advertiser portal submits events for admin review instead of approving them live", () => {
  const portalPage = read("src/app/portal/(shell)/events/page.tsx");
  const portalClient = read("src/app/portal/(shell)/events/events-client.tsx");
  const portalService = read("src/lib/portal-events.ts");
  const integrationClient = read("src/app/portal/(shell)/integrations/integrations-client.tsx");
  const integrationRoute = read("src/app/api/portal/integrations/[id]/route.ts");

  assert.match(portalPage, /submitEventForReview/);
  assert.match(portalPage, /submitEventsForReview/);
  assert.doesNotMatch(portalPage, /approveEvent|approveEvents|getCloudflareContext|status = 'approved'/);

  assert.match(portalClient, /Submit for Review/);
  assert.doesNotMatch(portalClient, /Approve Selected|Auto-approve imported events|value="approve"/);

  assert.match(portalService, /status = 'pending'/);
  assert.doesNotMatch(portalService, /SET status = 'approved'/);

  assert.match(integrationClient, /Imported events are submitted for admin review/);
  assert.doesNotMatch(integrationClient, /auto_approve.*onChange|Auto-approve imported events/);
  assert.doesNotMatch(integrationRoute, /auto_approve/);
});

test("portal database consumers use the shared D1 helper", () => {
  const portalDb = read("src/lib/portal-db.ts");
  const portalApiFiles = [
    "src/app/api/portal/events/[id]/route.ts",
    "src/app/api/portal/events/[id]/push/route.ts",
    "src/app/api/portal/integrations/[id]/scan/route.ts",
    "src/app/api/portal/integrations/[id]/sync/route.ts",
    "src/app/api/portal/media/route.ts",
    "src/app/api/portal/reveal/route.ts",
    "src/app/api/portal/track/route.ts",
  ];

  assert.match(portalDb, /getD1/);
  assert.doesNotMatch(portalDb, /getCloudflareContext/);

  for (const file of portalApiFiles) {
    const source = read(file);
    assert.doesNotMatch(source, /getCloudflareContext|env\.DB/, file);
  }
});
