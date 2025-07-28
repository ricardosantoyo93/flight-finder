import { FormControl, MenuItem, Select } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRightAlt";
import TwoArrowsIcon from "@mui/icons-material/SwapHoriz";

export const TripType = () => {
  return (
    <FormControl size="small">
      <Select
        variant="standard"
        value="one-way"
        disableUnderline
        size="small"
        className="text-gray-400 text-sm"
        classes={{
          icon: "text-gray-400 size-6",
          select: "mt-1.5",
        }}
      >
        <MenuItem value="one-way">
          <span className="flex items-center gap-2">
            <ArrowRightIcon className="size-5" />
            One way
          </span>
        </MenuItem>
        <MenuItem disabled value="round-trip">
          <span className="flex items-center gap-2">
            <TwoArrowsIcon className="size-5" />
            Rount trip
          </span>
        </MenuItem>
      </Select>
    </FormControl>
  );
};
