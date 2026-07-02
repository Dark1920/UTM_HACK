"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "./map-types";

interface MapLeafletProps {
  markers?: MapMarker[];
  userLocation?: { latitude: number; longitude: number } | null;
  onMarkerClick?: (id: string) => void;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

const MapContentLoader = dynamic(
  () => import("./map-content-loader").then((mod) => mod.default),
  { ssr: false }
);

function MapLeafletInner(props: MapLeafletProps) {
  return (
    <div className={["relative overflow-hidden rounded-lg", props.className ?? "h-96 w-full"].join(" ")}>
      <MapContentLoader {...props} />
    </div>
  );
}

export default dynamic(() => Promise.resolve(MapLeafletInner), {
  ssr: false,
});

export type { MapMarker, MapLeafletProps };
