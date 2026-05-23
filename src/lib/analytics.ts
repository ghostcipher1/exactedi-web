import { ga4Event, ga4PageView, initGa4, isGa4Configured } from "./ga4";
import { GTM_CONTAINER_ID } from "./gtm";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    google_tag_manager?: Record<string, unknown>;
  }
}

export type ConversionEvent =
  | "view_pricing"
  | "view_roadmap"
  | "view_dev_docs"
  | "view_request_access"
  | "view_product";

/** Direct GA4 (recommended) or GTM dataLayer — see ANALYTICS_SETUP.md */
export function usesDirectGa4(): boolean {
  return isGa4Configured();
}

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

export function initAnalytics(): void {
  if (!isAnalyticsEnabled()) return;

  if (isGa4Configured()) {
    initGa4();
  } else {
    getDataLayer();
  }
}

export function trackPageView(path: string, title?: string): void {
  if (!isAnalyticsEnabled()) return;

  const pageTitle = title ?? document.title;
  const pagePath = path.startsWith("/") ? path : `/${path}`;
  const pageLocation = `${window.location.origin}${pagePath}`;

  if (isGa4Configured()) {
    ga4PageView(pagePath, pageTitle);
    return;
  }

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

  if (isGa4Configured()) {
    ga4Event(eventName, params);
    return;
  }

  getDataLayer().push({
    event: eventName,
    ...params,
  });
}

export function trackConversionPageView(eventName: ConversionEvent): void {
  trackEvent(eventName);
}

export function getGtmContainerId(): string {
  return GTM_CONTAINER_ID;
}
