"use client";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useCallback, useMemo, useState } from "react";
import { useSearchAirport } from "../hooks/useSearchAirport";
import debounce from "debounce";
import { SearchAirportQueryResult } from "../types/flights";

interface AirportInputProps {
  label?: string;
  onChange?: (value: string | null) => void;
}

type Airport = NonNullable<SearchAirportQueryResult["data"]>[number] | null;

export const AirportInput = ({ label, onChange }: AirportInputProps) => {
  const [query, setQuery] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<Airport>(null);
  const [airportList, setAirportList] = useState<
    NonNullable<SearchAirportQueryResult["data"]>
  >([]);

  const searchAirportLazy = useSearchAirport();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) return;
        const result = await searchAirportLazy(query);
        setAirportList(result?.data || []);
      }, 300),
    [searchAirportLazy],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleChange = (airport: Airport) => {
    setSelectedAirport(airport);
    setQuery("");
    onChange?.(airport?.navigation?.relevantFlights?.skyId || null);
  };

  return (
    <Combobox as="div" value={selectedAirport} onChange={handleChange}>
      {label && (
        <Label className="block text-sm/6 font-medium text-gray-900">
          {label}
        </Label>
      )}
      <div className="relative mt-2">
        <ComboboxInput
          className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          onChange={handleInputChange}
          value={query}
          displayValue={(airport: Airport) =>
            airport?.presentation?.suggestionTitle || ""
          }
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          <ChevronDownIcon
            className="size-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {airportList.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
            {airportList.map((airport) => (
              <ComboboxOption
                key={airport.navigation?.relevantFlights?.entityId}
                value={airport}
                className="group cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-indigo-600 hover:bg-indigo-600 hover:text-white data-focus:text-white data-focus:outline-hidden"
              >
                <div className="flex">
                  <span className="block truncate">
                    {airport.presentation.suggestionTitle}
                  </span>
                  <span className="ml-2 block truncate text-gray-500 group-hover:text-white">
                    {airport.presentation.subtitle}
                  </span>
                </div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
};
