import "mapbox-gl/dist/mapbox-gl.css";
import {
  Map as MapGl,
  GeolocateControl,
  NavigationControl,
  Source,
  Layer,
  SymbolLayer,
  MapRef,
  MapLayerMouseEvent,
  Popup,
} from "react-map-gl";
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { LootBox } from "../types/loot-box";
import { GET_ACTIVE_EVENTS } from "../gql/treasure-hunt.queries";
import { useQuery } from "@apollo/client";
import { Event } from "../types/event";

export const MapBoxStylesOverrides = () => (
  <style jsx global>{`
    .mapboxgl-user-location-dot {
      background-color: #ff850f;
    }
    .mapboxgl-user-location-dot:before {
      background-color: #ff850f;
    }
    .mapboxgl-user-location-accuracy-circle {
      background-color: rgba(255, 133, 15, 0.2);
    }
    .mapboxgl-user-location-show-heading .mapboxgl-user-location-heading:before,
    .mapboxgl-user-location-show-heading .mapboxgl-user-location-heading:after {
      border-bottom: 7.5px solid #ff850f;
    }
    .mapboxgl-popup-content {
      padding: 0;
    }
  `}</style>
);

const LOOTBOX_ICON = {
  url: "/assets/images/treasure-hunt/loot-box.png",
  name: "loot-box-icon",
  size: 0.2,
};

const lootBoxPointLayer: SymbolLayer = {
  id: "unclustered-point",
  type: "symbol",
  source: "lootBoxes",
  filter: ["!", ["has", "point_count"]],
  layout: {
    "icon-image": LOOTBOX_ICON.name,
    "icon-size": LOOTBOX_ICON.size,
  },
  paint: {
    "icon-opacity": ["case", ["==", ["get", "isOpened"], true], 0.5, 1],
  },
};

const lootBoxClusterLayer: SymbolLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "lootBoxes",
  filter: ["has", "point_count"],
  layout: {
    "icon-image": LOOTBOX_ICON.name,
    "icon-size": LOOTBOX_ICON.size,
  },
};

interface ClusterSource {
  getClusterExpansionZoom: (
    clusterId: number,
    callback: (err: Error | null, zoom: number) => void
  ) => void;
}

function isPoint(
  geometry: any
): geometry is { type: "Point"; coordinates: [number, number] } {
  return geometry.type === "Point";
}

export const INITIAL_COORDINATES = {
  longitude: -122.4597,
  latitude: 37.8042,
};
export const INITIAL_ZOOM = 12;

export interface Viewport {
  longitude: number | null;
  latitude: number | null;
  zoom: number;
}

export default function Map() {
  const [viewport, setViewport] = useState<Viewport>({
    longitude: INITIAL_COORDINATES.longitude,
    latitude: INITIAL_COORDINATES.latitude,
    zoom: INITIAL_ZOOM,
  });
  const mapRef = useRef<MapRef>(null);
  const { data: eventData } = useQuery(GET_ACTIVE_EVENTS);
  const [lootBoxes, setLootBoxes] = useState<LootBox[]>([]);

  useEffect(() => {
    if (eventData?.events) {
      const nestedLootBoxes = eventData.events.map(
        (event: Event) => event.lootBoxes
      );
      const flatLootBoxes: LootBox[] = nestedLootBoxes.flat();
      setLootBoxes(flatLootBoxes);
    }
  }, [eventData]);

  const handleMapLoad = () => {
    if (mapRef.current) {
      const mapInstance = mapRef.current.getMap();
      const clusterIcon = new Image();
      clusterIcon.src = LOOTBOX_ICON.url;
      clusterIcon.onload = () => {
        mapInstance.addImage(LOOTBOX_ICON.name, clusterIcon);
      };
    }
  };

  const handleMapClick = (event: MapLayerMouseEvent) => {
    if (mapRef.current) {
      const features = mapRef.current.queryRenderedFeatures(event.point, {
        layers: [lootBoxClusterLayer.id],
      });
      if (features?.length) {
        const [cluster] = features;
        if (isPoint(cluster.geometry) && cluster.properties) {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const clusterId = cluster.properties.cluster_id;

          const mapboxSource = mapRef.current.getSource("lootBoxes");

          const clusterSource = mapboxSource as unknown as ClusterSource;
          clusterSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (!err) {
              mapRef.current?.getMap().flyTo({
                center: [longitude, latitude],
                zoom,
                speed: 1,
                curve: 1.42,
                easing: (t) => t,
              });
            }
          });
        }
      }
    }
  };

  const handleViewStateChange = ({ viewState }: { viewState: Viewport }) => {
    setViewport(viewState);
  };

  return (
    <Box>
      <MapBoxStylesOverrides />
      <MapGl
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        longitude={viewport.longitude || INITIAL_COORDINATES.longitude}
        latitude={viewport.latitude || INITIAL_COORDINATES.latitude}
        zoom={viewport.zoom}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        interactiveLayerIds={[lootBoxClusterLayer.id]}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        onMove={handleViewStateChange}
        onZoom={handleViewStateChange}
        onRotate={handleViewStateChange}
      >
        <Source
          id="lootBoxes"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: lootBoxes
              .filter(
                (lootBox) =>
                  lootBox.location?.longitude !== undefined &&
                  lootBox.location?.latitude !== undefined
              )
              .map((lootBox) => ({
                type: "Feature",
                properties: {
                  id: lootBox.location?.id,
                  address: lootBox.location?.address,
                  positionName: lootBox.location?.positionName,
                  isOpened: lootBox.lootClaimed,
                },
                geometry: {
                  type: "Point",
                  coordinates: [
                    lootBox.location!.longitude,
                    lootBox.location!.latitude,
                  ],
                },
              })),
          }}
          cluster
          clusterMaxZoom={12}
          clusterRadius={50}
        >
          <Layer {...lootBoxClusterLayer} />
          <Layer {...lootBoxPointLayer} />
        </Source>

        <NavigationControl
          style={{
            top: 0,
            left: 10,
            padding: 4,
            marginTop: 100,
            marginRight: 20,
          }}
        />
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          showUserHeading
          showAccuracyCircle={false}
          style={{
            top: 0,
            marginRight: 20,
            padding: 4,
          }}
        />
      </MapGl>
    </Box>
  );
}
