import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getD1(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}
