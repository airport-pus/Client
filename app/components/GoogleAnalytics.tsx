'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, Suspense } from 'react';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (
      command: string,
      action: string,
      params?: {
        page_path?: string;
        page_title?: string;
        page_location?: string;
        value?: number;
        [key: string]: unknown;
      }
    ) => void;
  }
}

function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      window.gtag('event', 'page_view', {
        page_path: pathname + searchParams.toString(),
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const visitStartTime = new Date();

    const recordVisitDuration = () => {
      const visitEndTime = new Date();
      const visitDuration = visitEndTime.getTime() - visitStartTime.getTime();
      
      window.gtag('event', 'visit_duration', {
        value: Math.round(visitDuration / 1000),
        page_path: pathname + searchParams.toString(),
      });
    };

    window.addEventListener('beforeunload', recordVisitDuration);
    return () => {
      window.removeEventListener('beforeunload', recordVisitDuration);
    };
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  if (!GA_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsContent />
      </Suspense>
    </>
  );
}