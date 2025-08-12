export interface TrackingEvent {
  eventName: string;
  parameters?: Record<string, string | number | boolean>;
}

export interface ConversionEvent {
  value?: number;
  currency?: "MXN" | "USD" | "EUR";
  transactionId?: string;
}

export interface GoogleAdsEvent {
  event_category?: string;
  event_label?: string;
  page_location?: string;
  page_title?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
  send_to?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface FacebookPixelEvent {
  value?: number;
  currency?: "MXN" | "USD" | "EUR";
  content_ids?: string[];
  content_type?: string;
  content_name?: string;
  content_category?: string;
  num_items?: number;
  search_string?: string;
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface TrackingScriptProps {
  id: string;
  src?: string;
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive";
  children?: string;
}

export interface AnalyticsProps {
  googleAdsId?: string;
  facebookPixelId?: string;
}

export type FacebookPixelEventType =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "AddToCart"
  | "AddToWishlist"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "Schedule"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe";

export type GoogleAdsEventType =
  | "page_view"
  | "conversion"
  | "purchase"
  | "add_to_cart"
  | "begin_checkout"
  | "generate_lead"
  | "login"
  | "search"
  | "select_content"
  | "share"
  | "sign_up"
  | "view_item"
  | "view_item_list";
