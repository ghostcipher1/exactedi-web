import { GTM_CONTAINER_ID } from "./gtm";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    /** Set by GTM after the container script loads */
    google_tag_manager?: Record<string, unknown>;
  }
}

export type ConversionEvent =
  | "view_pricing"
  | "view_roadmap"
  | "view_dev_docs"
  | "view_request_access"
  | "view_product";

function getDataLayer(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

export function isAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (import.meta.env.VITE_ENABLE_ANALYTICS === "false") return false;
  return true;
}

/** GTM loads from index.html; ensure dataLayer exists for early SPA events. */
export function initAnalytics(): void {
  if (!isAnalyticsEnabled()) return;
  getDataLayer();
}

/**
 * SPA page view — push GA4-friendly fields for a GTM Custom Event trigger
 * named `page_view` (see ANALYTICS_SETUP.md).
 */
export function trackPageView(path: string, title?: string): void {
  if (!isAnalyticsEnabled()) return;

  const pageTitle = title ?? document.title;
  const pagePath = path.startsWith("/") ? path : `/${path}`;
  const pageLocation =
    typeof window !== "undefined"
      ? `${window.location.origin}${pagePath}`
      : pagePath;

  getDataLayer().push({
    event: "page_view",
    page_path: pagePath,
    page_title: pageTitle,
    page_location: pageLocation,
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!isAnalyticsEnabled()) return;

  getDataLayer().push({
    event: eventName,
    ...params,
  });
}

export function trackConversionPageView(eventName: ConversionEvent): void {
  trackEvent(eventName);
}

/** For debugging in Tag Assistant — exposes the active container ID. */
export function getGtmContainerId(): string {
  return GTM_CONTAINER_ID;
}
