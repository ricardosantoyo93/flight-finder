import { DatePicker } from "@mui/x-date-pickers";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";

export const DepartureSelection = ({
  onDateSelect,
}: {
  onDateSelect?: (value: PickerValue) => void;
}) => {
  return (
    <DatePicker
      className="text-gray-400"
      minDate={dayjs()}
      label="Departure"
      onChange={onDateSelect}
    />
  );
};
