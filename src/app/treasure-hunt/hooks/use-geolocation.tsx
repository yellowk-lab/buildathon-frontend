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
    console.log("entering use effect");
    let watchId: number | null = null;

    const success = (pos: GeolocationPosition) => {
      const crd = pos.coords;
      console.log("success", crd);
      setLocation({
        latitude: crd.latitude,
        longitude: crd.longitude,
        accuracy: crd.accuracy,
      });
    };

    const errors = (err: GeolocationPositionError) => {
      console.log("errors", err);
      setError(err.message);
    };

    if (navigator.geolocation) {
      console.log("has navig geoloc");
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          console.log("has premission");
          console.log(result);
          if (result.state === "granted" || result.state === "prompt") {
            console.log("granted or prompt");
            watchId = navigator.geolocation.watchPosition(
              success,
              errors,
              options
            );
            console.log("after watcjh pos", watchId);
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
