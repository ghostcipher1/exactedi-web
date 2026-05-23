/** GTM container ID (public). Override with VITE_GTM_ID in Vercel / .env.local */
export const GTM_CONTAINER_ID =
  (import.meta.env.VITE_GTM_ID as string | undefined)?.trim() || "GTM-522ZBZWZ";

export function isGtmConfigured(): boolean {
  return /^GTM-[A-Z0-9]+$/i.test(GTM_CONTAINER_ID);
}
