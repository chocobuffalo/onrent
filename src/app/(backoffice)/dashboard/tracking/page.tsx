"use client"

import React from "react";
import TrackingMap from "@/components/molecule/TrackingMap/TrackingMap";
import { useOrderTracking } from "@/hooks/backend/useOrderTracking";

function TrackingView() {
  const {
    operatorPosition,
    destination,
    setDestination,
  } = useOrderTracking();

  return (
    <div className="p-4 md:p-6 space-y-4">
      <TrackingMap
        operatorPosition={operatorPosition ?? null}
        initialDestination={destination ?? null}
        onDestinationChange={setDestination}
        avgSpeedKmh={35}
        autoFitBounds
      />
    </div>
  );
}

export default function Page() {
  return <TrackingView />;
}
