"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingProvider } from "@/context/LoadingContext";
import { ThemeProvider } from "@/hooks/useTheme";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AnalyticsProvider } from "@/lib/analytics";

import PremiumLoader from "@/components/PremiumLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <TooltipProvider>
          <ThemeProvider>
            <AnalyticsProvider>
              <PremiumLoader />
              {children}
              <Toaster />
            </AnalyticsProvider>
          </ThemeProvider>
        </TooltipProvider>
      </LoadingProvider>
    </ErrorBoundary>
  );
}
