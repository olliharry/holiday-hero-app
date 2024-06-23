import React, { useEffect, useRef } from "react";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onChange(place.formatted_address || "");
    });
  }, []);

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
