import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  category?: string | string[];
  city?: string | string[];
}>;

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ListingsRedirectPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : {};
  const query = new URLSearchParams();
  const category = firstParam(params.category);
  const city = firstParam(params.city);
  if (category) query.set("category", category);
  if (city) query.set("city", city);
  redirect(query.toString() ? `/featured-listings?${query}` : "/featured-listings");
}
