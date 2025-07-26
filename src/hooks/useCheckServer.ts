import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { CheckServerResponse } from "../types/flights";

export const useCheckServer = () => {
  return useQuery({
    queryKey: ["checkServer"],
    queryFn: () =>
      fetcher<CheckServerResponse>({
        endpoint: "checkServer",
        options: {
          method: "GET",
        },
      }),
  });
};
