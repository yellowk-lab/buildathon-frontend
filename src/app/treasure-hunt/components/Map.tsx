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
import { useRef, useState } from "react";
import ContentPopup from "../components/ContentPopup";
import { Box } from "@mui/material";
import { Crate } from "../types/crate";

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

const CRATE_ICON = {
  url: "/assets/images/treasure-hunt/crate.png",
  name: "crate-icon",
  size: 0.2,
};

const cratePointLayer: SymbolLayer = {
  id: "unclustered-point",
  type: "symbol",
  source: "crates",
  filter: ["!", ["has", "point_count"]],
  layout: {
    "icon-image": CRATE_ICON.name,
    "icon-size": CRATE_ICON.size,
  },
  paint: {
    "icon-opacity": ["case", ["==", ["get", "isOpened"], true], 0.5, 1],
  },
};

const crateClusterLayer: SymbolLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "crates",
  filter: ["has", "point_count"],
  layout: {
    "icon-image": CRATE_ICON.name,
    "icon-size": CRATE_ICON.size,
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
  const [popupcrate, setPopupcrate] = useState<Crate | undefined>(undefined);
  const [viewport, setViewport] = useState<Viewport>({
    longitude: INITIAL_COORDINATES.longitude,
    latitude: INITIAL_COORDINATES.latitude,
    zoom: INITIAL_ZOOM,
  });
  const mapRef = useRef<MapRef>(null);

  // TODO: replace with an actuall query.
  const crates: Crate[] = [
    {
      id: "a",
      latitude: 37.7996,
      longitude: -122.4644,
      address: "asoasdf asfd",
      positionName: "cement",
      qrCode: {
        id: "b",
        lootBoxes: {
          isOpened: false,
        },
      },
    },
    {
      id: "ab",
      latitude: 37.7966,
      longitude: -122.4664,
      address: "asoasdf asfd",
      positionName: "cement",
      qrCode: {
        id: "bc",
        lootBoxes: {
          isOpened: true,
        },
      },
    },
    {
      id: "abc",
      latitude: 37.7936,
      longitude: -122.4044,
      address: "asoasdf asfd",
      positionName: "cement",
      qrCode: {
        id: "bcd",
        lootBoxes: {
          isOpened: true,
        },
      },
    },
  ];

  const handleMapLoad = () => {
    if (mapRef.current) {
      const mapInstance = mapRef.current.getMap();
      const clusterIcon = new Image();
      clusterIcon.src = CRATE_ICON.url;
      clusterIcon.onload = () => {
        mapInstance.addImage(CRATE_ICON.name, clusterIcon);
      };
    }
  };

  const handleMapClick = (event: MapLayerMouseEvent) => {
    if (mapRef.current) {
      const features = mapRef.current.queryRenderedFeatures(event.point, {
        layers: [crateClusterLayer.id],
      });
      if (features?.length) {
        const [cluster] = features;
        if (isPoint(cluster.geometry) && cluster.properties) {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const clusterId = cluster.properties.cluster_id;

          const mapboxSource = mapRef.current.getSource("crates");

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
      const featuresPoint = mapRef.current.queryRenderedFeatures(event.point, {
        layers: [cratePointLayer.id],
      });
      if (featuresPoint?.length) {
        const [crate] = featuresPoint;
        if (isPoint(crate.geometry) && crate.properties) {
          const [longitude, latitude] = crate.geometry.coordinates;
          const { address, id, positionName } = crate.properties;
          setPopupcrate({
            latitude,
            longitude,
            address,
            positionName,
            id,
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
        interactiveLayerIds={[crateClusterLayer.id]}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        onMove={handleViewStateChange}
        onZoom={handleViewStateChange}
        onRotate={handleViewStateChange}
      >
        <Source
          id="crates"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: crates.map((crate) => ({
              type: "Feature",
              properties: {
                id: crate.id,
                address: crate.address,
                positionName: crate.positionName,
                isOpened: crate.qrCode?.lootBoxes?.isOpened,
              },
              geometry: {
                type: "Point",
                coordinates: [crate.longitude, crate.latitude],
              },
            })),
          }}
          cluster
          clusterMaxZoom={12}
          clusterRadius={50}
        >
          <Layer {...crateClusterLayer} />
          <Layer {...cratePointLayer} />
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

        {popupcrate && (
          <Popup
            longitude={popupcrate.longitude}
            latitude={popupcrate.latitude}
            anchor="bottom"
            closeOnClick={false}
            onClose={() => setPopupcrate(undefined)}
          >
            <ContentPopup
              title={popupcrate.positionName}
              address={popupcrate.address}
            />
          </Popup>
        )}
      </MapGl>
    </Box>
  );
}
