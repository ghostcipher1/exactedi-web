declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export type ConversionEvent =
  | "view_pricing"
  | "view_roadmap"
  | "view_dev_docs"
  | "view_request_access";

function getDataLayer(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

export function isAnalyticsEnabled(): boolean {
  return typeof window !== "undefined";
}

/** GTM loads from index.html; ensure dataLayer exists for early SPA events. */
export function initAnalytics(): void {
  getDataLayer();
}

export function trackPageView(path: string, title?: string): void {
  getDataLayer().push({
    event: "page_view",
    page_path: path,
    page_title: title ?? document.title,
    page_location: `${window.location.origin}${path}`,
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  getDataLayer().push({
    event: eventName,
    ...params,
  });
}

export function trackConversionPageView(eventName: ConversionEvent): void {
  trackEvent(eventName);
}
