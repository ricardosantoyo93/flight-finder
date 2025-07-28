import React, { useState, useCallback } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import { clsx } from "clsx";
import { PassengerCount } from "../types/flights";

type PassengerTypes = "adults" | "children" | "infantsSeat" | "infantsLap";

export const PassengerSelector = ({
  onPassengersChange,
}: {
  onPassengersChange: (passengers: PassengerCount) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [passengers, setPassengers] = useState<PassengerCount>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });

  const passengerTypes: {
    label: string;
    subLabel: string;
    type: PassengerTypes;
    enabled: boolean;
  }[] = [
    { label: "Adults", subLabel: "", type: "adults", enabled: true },
    {
      label: "Children",
      subLabel: "Aged 2–11",
      type: "children",
      enabled: true,
    },
    {
      label: "Infants",
      subLabel: "In seat",
      type: "infantsSeat",
      enabled: true,
    },
    {
      label: "Infants",
      subLabel: "On lap",
      type: "infantsLap",
      enabled: true,
    },
  ];

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleChange = (
    type: PassengerTypes,
    operation: "increase" | "decrease",
  ) => {
    setPassengers((prev) => {
      const newValue =
        operation === "increase" ? prev[type] + 1 : Math.max(0, prev[type] - 1);

      if (newValue !== prev[type]) {
        const updatedPassengers = { ...prev, [type]: newValue };
        return updatedPassengers;
      }
      return prev;
    });
  };

  const handleDone = useCallback(() => {
    onPassengersChange(passengers);
    handleClose();
  }, [onPassengersChange, passengers, handleClose]);

  return (
    <>
      <Button
        startIcon={<PersonIcon className="text-gray-400" />}
        className="text-gray-400"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        endIcon={
          <ArrowDropDownIcon
            className={clsx(
              "text-gray-400 transition-all duration-150 size-6",
              anchorEl && "rotate-180",
            )}
          />
        }
      >
        {passengers.adults +
          passengers.children +
          passengers.infantsSeat +
          passengers.infantsLap}
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {passengerTypes.map((item) => (
          <MenuItem
            disableRipple
            key={item.type}
            sx={{ display: "flex", justifyContent: "space-between", gap: 6 }}
          >
            <Box>
              <Typography className="text-gray-400">{item.label}</Typography>
              {item.subLabel && (
                <Typography variant="caption" className="text-gray-400">
                  {item.subLabel}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                size="small"
                className="bg-[#4c4c50] text-gray-400 rounded-sm"
                onClick={() => handleChange(item.type, "decrease")}
                disabled={!item.enabled || passengers[item.type] === 0}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography className="text-gray-400">
                {passengers[item.type]}
              </Typography>
              <IconButton
                size="small"
                className="bg-[#3f4455] text-gray-300 rounded-sm"
                onClick={() => handleChange(item.type, "increase")}
                disabled={!item.enabled}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </MenuItem>
        ))}

        <Box sx={{ display: "flex", justifyContent: "end", mt: 1 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDone}>Done</Button>
        </Box>
      </Menu>
    </>
  );
};
