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
} from "react-map-gl";
import { useEffect, useRef, useState } from "react";
import { Box, Paper, Slide, Typography, useTheme } from "@mui/material";
import { LootBox } from "../types/loot-box";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import useGeolocation from "../hooks/use-geolocation";
import moment from "moment";
import { Location } from "../types/location";
import { getDistance } from "geolib";
import { useRouter } from "next/router";
import { QrCodeScannerRounded } from "@mui/icons-material";
import { GeolocateControl as GeolocateControleType } from "mapbox-gl";

export const CREATE_DEMO_EVENT = gql`
  mutation CreateDemoEvent($input: CreateDemoEventInput!) {
    createDemoEvent(input: $input) {
      id
      lootBoxes {
        lootClaimed
        location {
          longitude
          latitude
        }
      }
    }
  }
`;

export const GET_DEMO_LOOT_BOXE_IDS = gql`
  query GetDemoLootBoxes($eventId: String!, $password: String!) {
    lootBoxIdsForEvent(eventId: $eventId, password: $password)
  }
`;

export interface DemoEventState {
  eventId: string;
  createdAt: number;
  lootBoxes: LootBox[];
  location: Location;
}

export const MapBoxStylesOverrides = () => {
  const theme = useTheme();
  return (
    <style jsx global>{`
      .mapboxgl-user-location-dot {
        background-color: ${theme.palette.primary.main};
      }
      .mapboxgl-user-location-dot:before {
        background-color: ${theme.palette.primary.main};
      }
      .mapboxgl-user-location-accuracy-circle {
        background-color: rgba(255, 133, 15, 0.2);
      }
      .mapboxgl-user-location-show-heading
        .mapboxgl-user-location-heading:before,
      .mapboxgl-user-location-show-heading
        .mapboxgl-user-location-heading:after {
        border-bottom: 7.5px solid ${theme.palette.primary.main};
      }
      .mapboxgl-popup-content {
        padding: 0;
      }
    `}</style>
  );
};

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
export const INITIAL_ZOOM = 14;

export interface Viewport {
  longitude: number | null;
  latitude: number | null;
  zoom: number;
}

export default function Map() {
  const router = useRouter();
  const theme = useTheme();
  const [viewport, setViewport] = useState<Viewport>({
    longitude: null,
    latitude: null,
    zoom: INITIAL_ZOOM,
  });
  const mapRef = useRef<MapRef>(null);
  const geolocateControlRef = useRef<GeolocateControleType>(null);

  const [lootBoxes, setLootBoxes] = useState<LootBox[]>([]);
  const { location } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  });
  const [createDemoEvent] = useMutation(CREATE_DEMO_EVENT);
  const [getLootBoxeIds] = useLazyQuery(GET_DEMO_LOOT_BOXE_IDS);
  const [displayNotif, setDisplayNotif] = useState<boolean>(false);

  useEffect(() => {
    if (location) {
      setViewport({
        longitude: location.longitude,
        latitude: location.latitude,
        zoom: INITIAL_ZOOM,
      });
      setTimeout(() => setDisplayNotif(true), 1000);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      const demoEvent: DemoEventState = JSON.parse(
        localStorage.getItem("demoEvent") ?? "null"
      );
      const locationChanged =
        demoEvent && getDistance(location, demoEvent.location) > 500;
      const isOutdated =
        demoEvent && moment().diff(moment(demoEvent.createdAt), "hours") > 24;

      if (demoEvent?.lootBoxes && !locationChanged && !isOutdated) {
        setLootBoxes(demoEvent.lootBoxes);
      } else {
        createDemoEvent({
          variables: {
            input: {
              brand: "Super Brand",
              name: "Super Cool Event - SF",
              password: process.env.NEXT_PUBLIC_DEMO_EVENT_PASSWORD,
              description:
                "Participate in this super cool event to win amazing gifts and discover the brand!",
              latitude: location?.latitude,
              longitude: location?.longitude,
              startDate: moment().toDate(),
              endDate: moment().add(1, "d").toDate(),
              lootsDistribution: [
                {
                  amount: 10,
                  imageUrl:
                    "https://buildathon.nyc3.cdn.digitaloceanspaces.com/based-block-party/img/apple-gift-card-25.png",
                  name: "Apple Gift Card - 25$",
                },
                {
                  amount: 2,
                  imageUrl:
                    "https://buildathon.nyc3.cdn.digitaloceanspaces.com/based-block-party/img/starbuck-gift-card-15.png",
                  name: "Starbucks Gift Card - 15$",
                },
                {
                  amount: 2,
                  imageUrl:
                    "https://buildathon.nyc3.cdn.digitaloceanspaces.com/based-block-party/img/uber-eats-gift-card-15.png",
                  name: "Uber Eats Gift Card - 15$",
                },
                {
                  amount: 1,
                  imageUrl:
                    "https://buildathon.nyc3.cdn.digitaloceanspaces.com/based-block-party/img/amazon-gift-card-50.png",
                  name: "Amazon Gift Card - 50$",
                },
              ],
              lootBoxesAmount: 15,
            },
            password: process.env.NEXT_PUBLIC_DEMO_EVENT_PASSWORD,
          },
        })
          .then(async (data) => {
            const eventId = data?.data?.createDemoEvent?.id;
            let lootBoxes = data?.data?.createDemoEvent?.lootBoxes;
            const { data: lootBoxIdsData } = await getLootBoxeIds({
              variables: {
                eventId,
                password: process.env.NEXT_PUBLIC_DEMO_EVENT_PASSWORD,
              },
            });
            const lootBoxIds = lootBoxIdsData?.lootBoxIdsForEvent;
            lootBoxes = lootBoxes.map(
              (lootBox: LootBox, i: string | number) => ({
                ...lootBox,
                id: lootBoxIds[i],
              })
            );
            localStorage.setItem(
              "demoEvent",
              JSON.stringify({
                eventId,
                createdAt: moment().valueOf(),
                lootBoxes: lootBoxes,
                location: location,
              })
            );
            setLootBoxes(lootBoxes);
          })
          .catch((error) => console.log(error));
      }
    }
  }, [location]);

  const handleMapLoad = () => {
    if (mapRef.current) {
      const mapInstance = mapRef.current.getMap();
      const clusterIcon = new Image();
      clusterIcon.src = LOOTBOX_ICON.url;
      clusterIcon.onload = () => {
        mapInstance.addImage(LOOTBOX_ICON.name, clusterIcon);
      };
      if (geolocateControlRef.current) {
        geolocateControlRef.current.trigger();
      }
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
      const featuresPoint = mapRef.current.queryRenderedFeatures(event.point, {
        layers: [lootBoxPointLayer.id],
      });
      if (featuresPoint?.length) {
        const [caissette] = featuresPoint;
        if (isPoint(caissette.geometry) && caissette.properties) {
          const { hash } = caissette.properties;
          router.push(`/treasure-hunt/qr/${hash}?demo=true`);
        }
      }
    }
  };

  const handleViewStateChange = ({ viewState }: { viewState: Viewport }) => {
    setViewport(viewState);
  };

  const handleGeolocate = (position: GeolocationPosition) => {
    setViewport({
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      zoom: INITIAL_ZOOM,
    });
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
                  hash: lootBox?.id,
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
          ref={geolocateControlRef}
          onGeolocate={handleGeolocate}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          showUserHeading
          showAccuracyCircle={true}
          style={{
            top: 0,
            marginRight: 20,
            padding: 4,
          }}
        />
      </MapGl>
      <Slide direction="up" in={displayNotif} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            borderRadius: 4,
            p: 4,
            py: 4,
            position: "absolute",
            zIndex: 1000,
            bottom: 0,
            left: 0,
            right: 0,
            m: 2,
          }}
        >
          <Typography color={theme.palette.success.main}>DEMO</Typography>
          <Box display="flex" mt={2}>
            <QrCodeScannerRounded color="primary" sx={{ mr: 2 }} />
            <Typography variant="body1" fontWeight={600}>
              Click on a gift box to simulate a scan.
            </Typography>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
}
