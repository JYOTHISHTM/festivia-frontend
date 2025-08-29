import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FieldProps } from 'formik';

interface LocationAutocompleteProps extends FieldProps {}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ field, form }) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [input, setInput] = useState<string>(field.value || '');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input.length > 2) {
        axios
          .get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${input}&countrycodes=in&viewbox=74.864,12.878,77.310,8.179&bounded=1`
          )
          .then((res) => {
            setSuggestions(res.data);
          });
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [input]);

  const handleSelect = (place: any) => {
    setInput(place.display_name);
    setSuggestions([]);
    form.setFieldValue(field.name, place.display_name); 
    form.setFieldValue('geoLocation', {
      type: 'Point',
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)],
    });
  };

  return (
    <div className="relative">
      <input
        {...field}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your location"
        className="w-full p-3 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto rounded shadow">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
