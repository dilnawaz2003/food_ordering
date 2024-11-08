export const getDayName = (day: number): string => {
  return (
    {
      "0": "Sunday",
      "1": "Monday",
      "2": "Tuesday",
      "3": "Wednesday",
      "4": "Thurday",
      "5": "Friday",
      "6": "saturday",
    }[day.toString()] || ""
  );
};
