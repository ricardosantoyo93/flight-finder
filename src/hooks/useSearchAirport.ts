import { useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { SearchAirportQueryResult } from "../types/flights";

export const useSearchAirport = () => {
  const queryClient = useQueryClient();

  return (query: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set("query", query);
    return queryClient.ensureQueryData({
      queryKey: ["findAirport", query],
      queryFn: () =>
        fetcher<SearchAirportQueryResult>({
          endpoint: `flights/searchAirport?${searchParams.toString()}`,
          options: {
            method: "GET",
          },
        }),
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
  };
};
