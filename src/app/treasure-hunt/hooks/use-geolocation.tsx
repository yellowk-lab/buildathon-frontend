import { useState, useEffect } from "react";

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const useGeolocation = (options: GeolocationOptions = {}) => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let watchId: number | null = null;

    const success = (pos: GeolocationPosition) => {
      const crd = pos.coords;
      setLocation({
        latitude: crd.latitude,
        longitude: crd.longitude,
        accuracy: crd.accuracy,
      });
    };

    const errors = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            watchId = navigator.geolocation.watchPosition(
              success,
              errors,
              options
            );
          } else if (result.state === "denied") {
            setError("Geolocation permission denied.");
          }
        })
        .catch((err) => setError(err.message));
    } else {
      setError("Geolocation is not supported by this browser.");
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [options]);

  return { location, error };
};

export default useGeolocation;
