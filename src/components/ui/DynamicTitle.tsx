"use client";

import { useEffect, useState } from "react";

export function DynamicTitle() {
  const [originalTitle, setOriginalTitle] = useState("");

  useEffect(() => {
    // Save the original title once on mount
    setOriginalTitle(document.title);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "SYSTEM IDLE";
      } else {
        document.title = originalTitle || "Ankush Singh Rawat | Software Developer";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [originalTitle]);

  return null;
}
