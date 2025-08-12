"use client";

import {
  trackEvent,
  fbPixelEvent,
  trackPurchaseConversion,
} from "../../services/analytics";
import type {
  TrackingEvent,
  ConversionEvent,
  GoogleAdsEventType,
  FacebookPixelEventType,
} from "../../types/analytics";

export const useTracking = () => {
  const track = ({ eventName, parameters }: TrackingEvent): void => {
    if (typeof window === "undefined") return;

    trackEvent(eventName, {
      event_category: "User Interaction",
      event_label: eventName,
      ...parameters,
    });
    fbPixelEvent(eventName, parameters);
  };

  const trackPurchase = ({
    value = 1.0,
    transactionId = "",
    currency = "MXN",
  }: ConversionEvent = {}): void => {
    if (typeof window === "undefined") return;

    trackPurchaseConversion(value, transactionId);

    fbPixelEvent("Purchase", {
      value,
      currency,
    });
  };

  const trackLead = (
    parameters?: Record<string, string | number | boolean>
  ): void => {
    if (typeof window === "undefined") return;

    trackEvent("generate_lead", {
      event_category: "Lead Generation",
      ...parameters,
    });
    fbPixelEvent("Lead", parameters);
  };

  const trackViewContent = (contentId: string, contentType: string): void => {
    if (typeof window === "undefined") return;

    trackEvent("view_item", {
      event_category: "Content",
      event_label: contentId,
    });
    fbPixelEvent("ViewContent", {
      content_ids: [contentId],
      content_type: contentType,
    });
  };

  const trackCustomEvent = (
    googleEvent: GoogleAdsEventType,
    facebookEvent: FacebookPixelEventType,
    parameters?: Record<string, string | number | boolean>
  ): void => {
    if (typeof window === "undefined") return;

    trackEvent(googleEvent, parameters);
    fbPixelEvent(facebookEvent, parameters);
  };

  return {
    track,
    trackPurchase,
    trackLead,
    trackViewContent,
    trackCustomEvent,
  };
};
