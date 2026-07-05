"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/lib/analytics';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const Analytics = () => {
    const pathname = usePathname();
    const posthog = useAnalytics();

    useEffect(() => {
        if (typeof window !== 'undefined' && posthog) {
            posthog.capture('$pageview', {
                $current_url: window.location.href,
                $pathname: pathname,
            });
        }
    }, [pathname, posthog]);

    return (
        <>
            <VercelAnalytics />
            <SpeedInsights />
        </>
    );
};


export default Analytics;

