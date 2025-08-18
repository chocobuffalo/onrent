import Script from "next/script";

interface TrackingPixelsProps {
  googleAdsId?: string;
  facebookPixelId?: string;
}

const TrackingPixels: React.FC<TrackingPixelsProps> = ({
  googleAdsId = "AW-16635532905",
  facebookPixelId = "1884059665745690",
}) => {
  return (
    <>
      {/* Google Ads Scripts */}
      <Script
        id="google-ads-lib"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', '${googleAdsId}');
       `}
      </Script>

      {/* Facebook Pixel Script */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
         !function(f,b,e,v,n,t,s)
         {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
         n.callMethod.apply(n,arguments):n.queue.push(arguments)};
         if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
         n.queue=[];t=b.createElement(e);t.async=!0;
         t.src=v;s=b.getElementsByTagName(e)[0];
         s.parentNode.insertBefore(t,s)}(window, document,'script',
         'https://connect.facebook.net/en_US/fbevents.js');
         fbq('init', '${facebookPixelId}');
         fbq('track', 'PageView');
       `}
      </Script>

      {/* Facebook Pixel Noscript Fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};

export default TrackingPixels;
