import { useLoadScript } from "@react-google-maps/api";

// Static libraries array to prevent recreation on every render
const GOOGLE_MAPS_LIBRARIES: ("places" | "drawing" | "geometry")[] = ["places"];

export interface UseGoogleMapsOptions {
  libraries?: ("places" | "drawing" | "geometry")[];
}

export const useGoogleMaps = (options: UseGoogleMapsOptions = {}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: options.libraries || GOOGLE_MAPS_LIBRARIES,
  });

  return { isLoaded, loadError };
};