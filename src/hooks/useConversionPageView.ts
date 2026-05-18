import { useEffect } from "react";
import { trackConversionPageView, type ConversionEvent } from "@/lib/analytics";

export function useConversionPageView(event: ConversionEvent): void {
  useEffect(() => {
    trackConversionPageView(event);
  }, [event]);
}
