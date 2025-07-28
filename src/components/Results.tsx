import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { PassengerCount, SearchFlightQueryResult } from "../types/flights";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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
      <p className="text-gray-400 text-xs flex items-center">
        Ranked based on price and convenience{" "}
        <Tooltip title="“Top flights” are ranked based on the best trade-off between price and convenience factors such as duration, number of stops, and airport changes during layovers. All other flights are ranked by price.">
          <IconButton>
            <InfoIcon className="size-4 text-gray-400" />
          </IconButton>
        </Tooltip>
        Prices include required taxes + fees for {passengers?.adults}{" "}
        {pluralize(passengers?.adults || 1, "adult", "adults")}
        {passengers?.children
          ? `, ${passengers.children} ${pluralize(passengers.children, "child", "children")}`
          : null}
        {passengers?.infantsLap || passengers?.infantsSeat
          ? `, and ${passengers.infantsLap + passengers.infantsSeat} ${pluralize(passengers.infantsLap + passengers.infantsSeat, "infant", "infants")}`
          : null}
        {". Optional charges and bag fees may apply."}
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

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          <img
            src={logoUrl || ""}
            width={35}
            height={35}
            className="bg-white"
          />
        </TableCell>
        <TableCell align="left">
          <span className="flex itesm-start font-semibold">
            {dayjs(departureTime).format("h:mm A")} -{" "}
            {dayjs(arrivalTime).format("h:mm A")}
            {dayDiff > 0 && (
              <span className="text-[9px] font-medium">+{dayDiff}</span>
            )}
          </span>
          <span className="text-xs text-gray-400">
            {legs?.[0].carriers.marketing.map((m) => m.name).join(" • ")}
          </span>
        </TableCell>
        <TableCell align="left">
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
        <TableCell align="left">
          {stops > 0 ? `${stops} ${stops > 1 ? "stops" : "stop"}` : "Non-stop"}
        </TableCell>
        <TableCell
          align="right"
          className={clsx("font-medium", isBest && "text-[#81c995]")}
        >
          {price?.formatted}
        </TableCell>
        <TableCell align="right">
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
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3].map((historyRow) => (
                    <TableRow key={historyRow}>
                      <TableCell component="th" scope="row">
                        {historyRow}
                      </TableCell>
                      <TableCell>{historyRow}</TableCell>
                      <TableCell align="right">{historyRow}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
