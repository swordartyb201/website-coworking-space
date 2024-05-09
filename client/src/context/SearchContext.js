import React, { createContext, useReducer, useContext } from "react";

const INITIAL_STATE = {
  destination: undefined,
  dates: [
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ],
  duration: 0,
  dateMode: "",
};

export const SearchContext = createContext(INITIAL_STATE);

export const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      const { dateMode, dates } = action.payload;
      const adjustedDates = adjustDatesForDateMode(dateMode, dates);

      return {
        ...state,
        destination: action.payload.destination,
        dates: adjustedDates,
        duration: action.payload.duration,
        dateMode,
      };
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

const adjustDatesForDateMode = (dateMode, dates) => {
  if (dateMode === "day" || dateMode === "month") {
    const adjustedDates = dates.map((date) => ({
      ...date,
      startDate: setHoursAndMinutesToMidnight(date.startDate),
      endDate: setHoursAndMinutesToMidnight(date.endDate),
    }));
    return adjustedDates;
  } else if (dateMode === "hour") {
    return dates;
  }
  return dates;
};

const setHoursAndMinutesToMidnight = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider
      value={{
        location: state.location,
        dates: state.dates,
        duration: state.duration,
        dateMode: state.dateMode,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
