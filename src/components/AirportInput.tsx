import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import debounce from "debounce";
import { useSearchAirport } from "../hooks/useSearchAirport";
import { Airport } from "../types/flights";
import CircleIcon from "@mui/icons-material/CircleOutlined";
import LocationIcon from "@mui/icons-material/LocationOnOutlined";

interface AirportInputProps {
  label?: string;
  onChange?: (value: Airport | null) => void;
  variant?: "departure" | "arrival";
}

export const AirportInput = ({
  label,
  onChange,
  variant = "departure",
}: AirportInputProps) => {
  const [query, setQuery] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<Airport>(null);
  const [airportList, setAirportList] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchAirportLazy = useSearchAirport();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) {
          setAirportList([]);
          return;
        }
        setIsLoading(true);
        try {
          const result = await searchAirportLazy(query);
          setAirportList(result?.data || []);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [searchAirportLazy],
  );

  const handleInputChange = useCallback(
    (_: unknown, value: string) => {
      setQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleChange = (_: unknown, airport: Airport) => {
    setSelectedAirport(airport);
    onChange?.(airport || null);
  };

  return (
    <Autocomplete
      value={selectedAirport}
      onChange={handleChange}
      inputValue={query}
      onInputChange={handleInputChange}
      options={airportList}
      loading={isLoading}
      getOptionLabel={(option) => option?.presentation?.suggestionTitle || ""}
      isOptionEqualToValue={(option, value) =>
        option?.navigation?.relevantFlights?.entityId ===
        value?.navigation?.relevantFlights?.entityId
      }
      slotProps={{
        popupIndicator: {
          className: "text-gray-400",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={label || "Airport"}
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment:
                variant === "departure" ? (
                  <CircleIcon
                    className="text-gray-400"
                    sx={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginRight: 2,
                    }}
                  />
                ) : (
                  <LocationIcon
                    className="text-gray-400"
                    sx={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginRight: 2,
                    }}
                  />
                ),
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option?.navigation?.relevantFlights?.entityId}>
          <div className="flex flex-col">
            <span className="font-medium">
              {option?.presentation.suggestionTitle}
            </span>
            <span className="text-sm text-gray-500">
              {option?.presentation.subtitle}
            </span>
          </div>
        </li>
      )}
    />
  );
};
