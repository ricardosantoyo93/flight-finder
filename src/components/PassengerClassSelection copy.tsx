import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { capitalize, title } from "radash";
import { TravelClassEnum } from "../types/flights";

export const PassengerClassSelection = ({
  onChange,
}: {
  onChange?: (travelClass: TravelClassEnum) => void;
}) => {
  const [passengerClass, setPassengerClass] = React.useState<TravelClassEnum>(
    TravelClassEnum.Economy,
  );

  const handleChange = (event: SelectChangeEvent) => {
    const travelClass = event.target.value as TravelClassEnum;
    setPassengerClass(travelClass);
    onChange?.(travelClass);
  };

  return (
    <FormControl size="small">
      <Select
        variant="standard"
        disableUnderline
        value={passengerClass}
        size="small"
        onChange={handleChange}
        className="text-gray-400 text-sm"
        classes={{
          icon: "text-gray-400 size-6",
          select: "mt-1.5",
        }}
      >
        <MenuItem value={TravelClassEnum.Economy}>
          {capitalize(TravelClassEnum.Economy)}
        </MenuItem>
        <MenuItem value={TravelClassEnum.PremiumEconomy}>
          {capitalize(title(TravelClassEnum.PremiumEconomy))}
        </MenuItem>
        <MenuItem value={TravelClassEnum.Business}>
          {capitalize(TravelClassEnum.Business)}
        </MenuItem>
        <MenuItem value={TravelClassEnum.First}>
          {capitalize(TravelClassEnum.First)}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
