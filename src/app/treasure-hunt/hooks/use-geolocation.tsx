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
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
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

    const startWatch = () => {
      if (navigator.geolocation) {
        navigator.permissions
          .query({ name: "geolocation" as PermissionName })
          .then((result) => {
            if (result.state === "granted" || result.state === "prompt") {
              const id = navigator.geolocation.watchPosition(
                success,
                errors,
                options
              );
              setWatchId(id);
            } else if (result.state === "denied") {
              setError("Geolocation permission denied.");
            }
          })
          .catch((err) => setError(err.message));
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    const watchTimeout = setTimeout(startWatch, 100);

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      clearTimeout(watchTimeout);
    };
  }, [options]);

  return { location, error };
};

export default useGeolocation;
