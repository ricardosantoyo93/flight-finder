import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import {
  SearchFlightQueryResult,
  SearchFlightsParams,
  TravelClassEnum,
} from "../types/flights";
import dayjs from "dayjs";

export const useSearchFlights = (params: SearchFlightsParams | undefined) => {
  const searchParams = new URLSearchParams({
    originSkyId: params?.from?.skyId || "",
    originEntityId: params?.from?.entityId || "",
    destinationSkyId: params?.to?.skyId || "",
    destinationEntityId: params?.to?.entityId || "",
    date: params?.departureDate || dayjs().format("YYYY-MM-DD"),
    cabinClass: params?.travelClass || TravelClassEnum.Economy,
    adults: (params?.passengers.adults || 0).toString(),
    children: (params?.passengers.children || 0).toString(),
    infants: (
      (params?.passengers.infantsSeat || 0) +
      (params?.passengers.infantsLap || 0)
    ).toString(),
  });

  return useQuery({
    queryKey: ["searchFlight"],
    queryFn: () =>
      fetcher<SearchFlightQueryResult>({
        endpoint: `v2/flights/searchFlights?${searchParams.toString()}`,
        options: {
          method: "GET",
        },
      }),
    enabled: !!params,
  });
};
