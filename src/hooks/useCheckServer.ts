import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/fetcher";
import { CheckServerResponse } from "../types/flights";

export const useCheckServer = () => {
  return useQuery({
    queryKey: ["checkServer"],
    queryFn: () =>
      fetcher<CheckServerResponse>({
        endpoint: "v1/checkServer",
        options: {
          method: "GET",
        },
      }),
  });
};
