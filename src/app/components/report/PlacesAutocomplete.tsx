"use client";

import React, { useState, useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox } from '@headlessui/react';

interface PlacesAutocompleteProps {
  setSelected: (position: { lat: number, lng: number }) => void;
  onAddressSelect: (address: string, name: string) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = React.memo(({ 
  setSelected, 
  onAddressSelect 
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = getLatLng(results[0]);
      setSelected({ lat, lng });
      onAddressSelect(
        results[0].formatted_address || address,
        results[0].address_components?.[0]?.long_name || address
      );
    } catch (error) {
      console.error("Error selecting place:", error);
    }
  };

  return (
    <div className="relative w-full">
      <Combobox value={value} onChange={handleSelect}>
        <div className="relative w-full">
          <Combobox.Input
            className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-white"
            placeholder="Search location..."
            displayValue={() => query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              setValue(val);
            }}
            disabled={!ready}
          />
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <Combobox.Option
                  key={place_id}
                  value={description}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? 'bg-blue-50 text-gray-900' : 'text-gray-700'
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {description}
                    </span>
                  )}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
});

PlacesAutocomplete.displayName = 'PlacesAutocomplete';

export default PlacesAutocomplete;
