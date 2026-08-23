import { runSync } from "./src/lib/sync-engine.ts";
import openNextWorker, {
  BucketCachePurge,
  DOQueueHandler,
  DOShardedTagCache,
} from "./.open-next/worker.js";

export { BucketCachePurge, DOQueueHandler, DOShardedTagCache };

async function listRunnableIntegrations(db) {
  const { results } = await db
    .prepare("SELECT * FROM integrations WHERE sync_status != 'syncing' ORDER BY updated_at ASC LIMIT 10")
    .all();
  return results;
}

async function syncRunnableIntegrations(db) {
  const integrations = await listRunnableIntegrations(db);
  for (const integration of integrations) {
    await runSync(integration, db);
  }
}

export default {
  async fetch(request, env, ctx) {
    return openNextWorker.fetch(request, env, ctx);
  },

  scheduled(_controller, env, ctx) {
    ctx.waitUntil(syncRunnableIntegrations(env.DB));
  },
};
