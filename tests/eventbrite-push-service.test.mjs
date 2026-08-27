import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

test("admin and portal Eventbrite push routes delegate to the shared service", () => {
  const adminRoute = read("src/app/admin/api/events/[id]/push/route.ts");
  const portalRoute = read("src/app/api/portal/events/[id]/push/route.ts");
  const service = read("src/lib/eventbrite-push-service.ts");

  for (const source of [adminRoute, portalRoute]) {
    assert.match(source, /pushEventToEventbrite/);
    assert.doesNotMatch(source, /eventbriteapi\.com|ensureEventbriteVenue|publishEventbriteEvent|upsertEventExternalRef/);
  }

  assert.match(service, /eventbriteapi\.com/);
  assert.match(service, /upsertEventExternalRef/);
  assert.match(portalRoute, /requireApproved: true/);
  assert.match(portalRoute, /requirePushEnabled: true/);
});
