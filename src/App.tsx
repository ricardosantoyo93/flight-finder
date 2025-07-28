import { useEffect, useState } from "react";
import { FlightSearchForm } from "./components/FlightSearchForm";
import { useSearchFlights } from "./hooks/useSearchFlights";
import { SearchFlightsParams } from "./types/flights";
import { Results } from "./components/Results";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const [searchParams, setSearchParams] = useState<SearchFlightsParams>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { data, isLoading, isError } = useSearchFlights(searchParams);

  const handleSearch = (params: SearchFlightsParams) => {
    setSearchParams(params);
  };

  useEffect(() => {
    if (!isLoading && (isError || (data && !data?.status))) {
      setSnackbarOpen(true);
    }
  }, [isLoading, isError, data]);

  return (
    <main className="bg-[rgb(32,33,36)] min-h-screen w-full flex flex-col items-center">
      <span className="content-[url(https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg)] max-w-6xl"></span>
      <h1 className="text-[56px] font-light mb-2 text-center text-white top-0 md:-mt-22">
        Flights
      </h1>
      <div className="md:p-6 w-full">
        <FlightSearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>
      {data && !isLoading && !isError && (
        <div className="w-full max-w-6xl p-6 md:px-16">
          <Results {...data} passengers={searchParams?.passengers} />
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        message="An error occurred while searching for flights. Please try again later."
        onClose={() => setSnackbarOpen(false)}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </main>
  );
}

export default App;
