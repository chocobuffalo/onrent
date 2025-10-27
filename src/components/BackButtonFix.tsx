"use client";

import { useEffect } from "react";

export default function BackButtonFix() {
  useEffect(() => {
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload();
      }
    };
  }, []);

  return null;
}
