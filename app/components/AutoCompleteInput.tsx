"use client";
import React, { useEffect, useRef } from "react";
import { useJsApiLoader, Libraries } from "@react-google-maps/api";
import { getGoogleApiKey } from "../actions/placesActions";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
}
const librariesLoad: Libraries = ["places"];
const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_NEXT_GOOGLE_MAPS_API_KEY || "failed";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: librariesLoad,
  });

  useEffect(() => {
    if (isLoaded) {
      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        onChange(place.formatted_address || "");
      });
    }
  }, [onChange, isLoaded]);

  return (
    <input
      name="location"
      required
      type="text"
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter a location"
      className="input input-bordered w-full max-w-xs"
    />
  );
};

export default AutocompleteInput;
