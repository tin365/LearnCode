// Google blocks OAuth sign-in from any embedded webview (policy:
// `disallowed_useragent`). Users who tap a link inside Messenger,
// Instagram, the Facebook app, TikTok, etc. land in that app's
// in-app browser and get a confusing "Access blocked" page from
// Google. We detect those user-agents so we can show a friendly
// "open in your real browser" notice before they hit the OAuth flow.

export type InAppBrowserDetection = {
  isInApp: boolean;
  appName?: string;
};

export function detectInAppBrowser(): InAppBrowserDetection {
  if (typeof navigator === 'undefined') return { isInApp: false };
  const ua = navigator.userAgent;

  // Order matters: more specific app markers first, generic
  // Android WebView marker last.
  if (/Messenger/i.test(ua)) return { isInApp: true, appName: 'Messenger' };
  if (/Instagram/i.test(ua)) return { isInApp: true, appName: 'Instagram' };
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return { isInApp: true, appName: 'Facebook' };
  if (/\bLine\//i.test(ua)) return { isInApp: true, appName: 'LINE' };
  if (/Twitter/i.test(ua)) return { isInApp: true, appName: 'X (Twitter)' };
  if (/TikTok|BytedanceWebview/i.test(ua)) return { isInApp: true, appName: 'TikTok' };
  if (/Snapchat/i.test(ua)) return { isInApp: true, appName: 'Snapchat' };
  if (/LinkedInApp/i.test(ua)) return { isInApp: true, appName: 'LinkedIn' };
  if (/MicroMessenger/i.test(ua)) return { isInApp: true, appName: 'WeChat' };

  // Generic Android WebView — appears as `; wv)` in the UA. Covers
  // most Android in-app browsers we haven't named above.
  if (/Android.*;\s*wv\)/i.test(ua)) return { isInApp: true, appName: 'in-app browser' };

  return { isInApp: false };
}
