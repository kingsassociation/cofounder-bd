"use client";

import React, { useEffect } from "react";

interface FacebookPixelProps {
  pixelId?: string;
}

const FacebookPixel: React.FC<FacebookPixelProps> = ({ pixelId = "3919035388228710" }) => {
  useEffect(() => {
    if (!pixelId) return;
    
    // @ts-ignore
    if (window.fbq) return;

    // Standard FB Pixel script injection
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // @ts-ignore
    fbq('init', pixelId);
    // @ts-ignore
    fbq('track', 'PageView');
  }, [pixelId]);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
};

export default FacebookPixel;
