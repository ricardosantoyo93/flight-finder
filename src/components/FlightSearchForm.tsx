import { Button } from "@mui/material";
import { AirportInput } from "./AirportInput";
import { useState } from "react";
import { PassengerSelector } from "./PassengerSelection";
import { PassengerClassSelection } from "./PassengerClassSelection";
import {
  Airport,
  PassengerCount,
  SearchFlightsParams,
  TravelClassEnum,
} from "../types/flights";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { DepartureSelection } from "./DepartureSelection";
import dayjs from "dayjs";
import { TripType } from "./TripType";

interface FlightSearchFormProps {
  onSearch: (params: SearchFlightsParams) => void;
  isLoading?: boolean;
}

export const FlightSearchForm = ({
  onSearch,
  isLoading,
}: FlightSearchFormProps) => {
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [passengers, setPassengers] = useState<PassengerCount>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });
  const [travelClass, setTravelClass] = useState<TravelClassEnum>(
    TravelClassEnum.Economy,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && departureDate) {
      onSearch({
        from,
        to,
        departureDate,
        passengers,
        travelClass,
      });
    }
  };

  const isSearchDisabled = !from || !to || !departureDate;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col p-4 md:bg-[#37373A] shadow-md rounded-xl max-w-screen-lg mx-auto"
    >
      <div className="flex items-center gap-4 mb-2">
        <TripType />
        <PassengerSelector onPassengersChange={setPassengers} />
        <PassengerClassSelection onChange={setTravelClass} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <AirportInput
            variant="departure"
            label="Where from?"
            onChange={setFrom}
          />
          <AirportInput variant="arrival" label="Where to?" onChange={setTo} />
        </div>
        <DepartureSelection
          onDateSelect={(date) =>
            setDepartureDate(dayjs(date).format("YYYY-MM-DD"))
          }
        />
      </div>

      <Button
        type="submit"
        color="primary"
        disabled={isSearchDisabled}
        className="capitalize text-sm relative max-w-fit mx-auto top-8 rounded-full disabled:bg-gray-600"
        size="large"
        variant="contained"
        startIcon={<SearchIcon className="size-5" />}
        loading={isLoading}
      >
        Search
      </Button>
    </form>
  );
};
