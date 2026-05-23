/** GA4 Measurement ID — set VITE_GA4_MEASUREMENT_ID in .env / Vercel (e.g. G-XXXXXXXXXX) */
export const GA4_MEASUREMENT_ID = (
  import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined
)?.trim();

export function isGa4Configured(): boolean {
  return !!GA4_MEASUREMENT_ID && /^G-[A-Z0-9]+$/i.test(GA4_MEASUREMENT_ID);
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let ga4Initialized = false;

/** Load gtag.js and configure GA4. No Google Tag Manager required. */
export function initGa4(): void {
  if (!isGa4Configured() || ga4Initialized || typeof window === "undefined") {
    return;
  }
  ga4Initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  // SPA: we send page_view on each route change (see AnalyticsListener)
  window.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });
}

export function ga4PageView(path: string, title?: string): void {
  if (!isGa4Configured() || !window.gtag) return;

  const pagePath = path.startsWith("/") ? path : `/${path}`;
  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_title: title ?? document.title,
    page_location: `${window.location.origin}${pagePath}`,
  });
}

export function ga4Event(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!isGa4Configured() || !window.gtag) return;
  window.gtag("event", eventName, params ?? {});
}
