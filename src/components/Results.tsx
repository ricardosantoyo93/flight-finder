import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import { PassengerCount, SearchFlightQueryResult } from "../types/flights";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AlertIcon from "@mui/icons-material/ReportProblemOutlined";
import { useState } from "react";
import dayjs from "dayjs";
import { pluralize } from "../utils/strings";
import clsx from "clsx";

export const Results = ({
  data,
  passengers,
}: SearchFlightQueryResult & {
  passengers?: PassengerCount;
}) => {
  return (
    <div className="w-full">
      <h2 className="text-white text-xl font-semibold">
        Top departing flights
      </h2>
      <p className="text-gray-400 text-xs flex flex-col md:flex-row items-start md:items-center mb-1">
        <span>
          Ranked based on price and convenience{" "}
          <Tooltip title="“Top flights” are ranked based on the best trade-off between price and convenience factors such as duration, number of stops, and airport changes during layovers. All other flights are ranked by price.">
            <IconButton>
              <InfoIcon className="size-4 text-gray-400" />
            </IconButton>
          </Tooltip>
        </span>
        <span>
          Prices include required taxes + fees for {passengers?.adults}{" "}
          {pluralize(passengers?.adults || 1, "adult", "adults")}
          {passengers?.children
            ? `, ${passengers.children} ${pluralize(passengers.children, "child", "children")}`
            : null}
          {passengers?.infantsLap || passengers?.infantsSeat
            ? `, and ${passengers.infantsLap + passengers.infantsSeat} ${pluralize(passengers.infantsLap + passengers.infantsSeat, "infant", "infants")}`
            : null}
          {". Optional charges and bag fees may apply."}
        </span>
      </p>
      <div className="w-full border border-gray-500 rounded-lg">
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableBody>
              {data?.itineraries?.map((itinerary, index) => (
                <Row key={index} {...itinerary} isBest={index === 0} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

const Row = ({
  legs,
  price,
  isBest,
}: {
  isBest: boolean;
} & NonNullable<
  NonNullable<SearchFlightQueryResult["data"]>["itineraries"]
>[number]) => {
  const [open, setOpen] = useState(false);
  const logoUrl = legs?.[0].carriers.marketing[0].logoUrl;

  const departureTime = legs?.[0].segments?.[0].departure;
  const arrivalTime =
    legs?.[0].segments?.[legs?.[0].segments.length - 1].arrival;
  const dayDiff = dayjs(dayjs(arrivalTime).format("YYYY-MM-DD")).diff(
    dayjs(departureTime).format("YYYY-MM-DD"),
    "days",
  );
  const totalHours = Math.floor(Number(legs?.[0].durationInMinutes || 0) / 60);
  const extraMinutes = Number(legs?.[0].durationInMinutes || 0) % 60;

  const stops = (legs?.[0].segments?.length || 1) - 1 || 0;
  let stopsLabel = "";
  if (stops === 1) {
    const layoverArrival = legs?.[0].segments?.[0].arrival;
    const layoverDeparture = legs?.[0].segments?.[1].departure;
    const timeDiffInMinutes = dayjs(layoverDeparture).diff(
      dayjs(layoverArrival),
      "minutes",
    );
    const layoverHours = Math.floor(timeDiffInMinutes / 60);
    const layoverMinutes = timeDiffInMinutes % 60;
    stopsLabel = `${layoverHours} hr ${layoverMinutes} min ${legs?.[0].segments?.[0].destination.displayCode}`;
  } else if (stops > 1) {
    const [, ...stopCities] =
      legs?.[0].segments?.map((segment) => segment.origin.displayCode) || [];
    stopsLabel = stopCities.join(", ");
  }

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell
          component="th"
          scope="row"
          className="overflow-hidden flex items-start border-b-0 md:table-cell"
        >
          <img
            src={logoUrl || ""}
            width="35px"
            height="35px"
            className="bg-white shrink-0 size-[35px] absolute md:relative md:top-1/2"
          />
        </TableCell>
        <TableCell align="left" className="border-b-0">
          <div className="ml-4 md:ml-0">
            <span className="flex itesm-start font-semibold text-nowrap">
              {dayjs(departureTime).format("h:mm A")} -{" "}
              {dayjs(arrivalTime).format("h:mm A")}
              {dayDiff > 0 && (
                <span className="text-[9px] font-medium">+{dayDiff}</span>
              )}
            </span>
            <span className="text-xs text-gray-400">
              {legs?.[0].carriers.marketing.map((m) => m.name).join(" • ")}
            </span>
          </div>
        </TableCell>
        <TableCell align="left" className="hidden md:table-cell border-b-0">
          <span className="font-normal flex">
            {totalHours} hr {extraMinutes} min
          </span>
          <span className="text-xs text-gray-400">
            {legs?.[0].segments?.[0].origin.displayCode} -{" "}
            {
              legs?.[0].segments?.[legs?.[0].segments.length - 1].destination
                .displayCode
            }
          </span>
        </TableCell>
        <TableCell align="left" className="hidden md:table-cell border-b-0">
          <span className="flex flex-col">
            {stops > 0
              ? `${stops} ${stops > 1 ? "stops" : "stop"}`
              : "Non-stop"}
            <span className="text-xs text-gray-400">{stopsLabel}</span>
          </span>
        </TableCell>
        <TableCell
          align="right"
          className={clsx("text-lg border-b-0", isBest && "text-[#81c995]")}
        >
          {price?.formatted}
        </TableCell>
        <TableCell align="right" className="border-b-0">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div className="flex flex-col w-full md:pl-22 py-3">
                {legs?.[0].segments?.map((segment, index) => {
                  const travelTimeHours = Math.floor(
                    segment.durationInMinutes / 60,
                  );
                  const travelTimeMinutes = segment.durationInMinutes % 60;
                  const travelTime = `${travelTimeHours} hr ${travelTimeMinutes} min`;
                  const isLastSegment =
                    index === (legs?.[0].segments || []).length - 1;

                  let stopTimeLabel;
                  if (!isLastSegment) {
                    const stopArrival = segment.arrival;
                    const stopDeparture = (legs?.[0].segments || [])[index + 1]
                      ?.departure;
                    const stopTimeInMinutes = dayjs(stopDeparture).diff(
                      dayjs(stopArrival),
                      "minutes",
                    );
                    const stopHours = Math.floor(stopTimeInMinutes / 60);
                    const stopMinutes = stopTimeInMinutes % 60;
                    const stopCity = segment.destination.parent.name;
                    const stopDayDiff = dayjs(
                      dayjs(stopDeparture).format("YYYY-MM-DD"),
                    ).diff(dayjs(stopArrival).format("YYYY-MM-DD"), "days");

                    stopTimeLabel = (
                      <span className="flex items-center">
                        {stopHours}
                        {" hr "}
                        {stopMinutes}
                        {" min layover • "}
                        {stopCity}
                        {stopDayDiff > 0 ? (
                          <>
                            {" • Overnight layover"}
                            <AlertIcon className="size-4 ml-1 text-red-300" />
                          </>
                        ) : (
                          ""
                        )}
                      </span>
                    );
                  }

                  return (
                    <div className="flex w-full flex-col items-start ">
                      <div className="group flex gap-x-6">
                        <div className="relative">
                          <div className="absolute left-1/2 top-4 h-[90%] md:h-[85%] w-[1px] -translate-x-[30%] border-l-8 border-dotted [border-image-source:url('/dots.svg')] [border-image-slice:33%_33%] [border-image-repeat:round] border-gray-600"></div>
                          <span className="relative z-10 grid size-4 place-items-center rounded-full border-3 border-gray-600 text-slate-800"></span>
                        </div>
                        <div className="-translate-y-1.5 pb-8 text-slate-600">
                          <p className="font-sans text-base font-bold text-slate-800 antialiased dark:text-white">
                            {dayjs(segment.departure).format("hh:mm A")}
                            {" • "}
                            {`${segment.origin.name} (${segment.origin.displayCode})`}
                          </p>
                          <small className="mt-2 font-sans text-sm text-gray-400 antialiased">
                            Travel time: {travelTime}
                          </small>
                        </div>
                      </div>
                      <div className="group flex gap-x-6 w-full">
                        <div className="relative">
                          <span className="relative z-10 grid size-4 place-items-center rounded-full border-3 border-gray-600 text-slate-800"></span>
                        </div>
                        <div className="-translate-y-1.5 pb-2 text-slate-600 w-full">
                          <p className="font-sans text-base font-bold text-slate-800 antialiased dark:text-white">
                            {dayjs(segment.arrival).format("hh:mm A")}
                            {" • "}
                            {`${segment.destination.name} (${segment.destination.displayCode})`}
                          </p>
                          <small className="mt-2 pt-2 font-sans text-sm text-gray-400 antialiased">
                            {segment.marketingCarrier.name}
                            {" • "}
                            {segment.operatingCarrier &&
                            segment.operatingCarrier.name !==
                              segment.marketingCarrier.name
                              ? `${segment.operatingCarrier.name} • `
                              : null}
                            {`${segment.marketingCarrier.displayCode} ${segment.flightNumber}`}
                          </small>
                        </div>
                      </div>
                      {!isLastSegment && (
                        <div className="md:w-[98%] w-[96%] border-y-1 mb-4 ml-10 border-gray-500 py-4">
                          {stopTimeLabel}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
