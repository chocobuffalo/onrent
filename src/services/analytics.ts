import type {
  TrackingEvent,
  ConversionEvent,
  GoogleAdsEvent,
  FacebookPixelEvent,
} from "../types/analytics";

export const GOOGLE_ADS_ID = "AW-16635532905";
export const FB_PIXEL_ID = "1884059665745690";

// Google Ads functions
export const pageview = (url: string): void => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GOOGLE_ADS_ID, {
      page_location: url,
    });
  }
};

export const trackEvent = (
  action: string,
  parameters?: GoogleAdsEvent
): void => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, parameters);
  }
};

export const trackPurchaseConversion = (
  value: number = 1.0,
  transactionId: string = ""
): void => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: "AW-16635532905/fVXlCK34xcAaEOmsuPw9",
      value: value,
      currency: "MXN",
      transaction_id: transactionId,
    });
  }
};

// Facebook Pixel functions
export const fbPixelPageView = (): void => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

export const fbPixelEvent = (
  eventName: string,
  parameters?: FacebookPixelEvent
): void => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, parameters);
  }
};

// Global type declarations
declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: GoogleAdsEvent
    ) => void;
    fbq: (
      command: "init" | "track",
      eventName: string,
      parameters?: FacebookPixelEvent
    ) => void;
  }
}
