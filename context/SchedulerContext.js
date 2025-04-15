import React, { createContext, useState, useContext } from "react";

const SchedulerContext = createContext();

export function SchedulerProvider({ children }) {
  const [schedulers, setSchedulers] = useState([]);

  const addSchedule = (schedule) => {
    setSchedulers((prev) => [...prev, schedule]);
  };

  const removeSchedule = (id) => {
    setSchedulers((prev) => prev.filter((schedule) => schedule.id !== id));
  };

  return (
    <SchedulerContext.Provider value={{ schedulers, addSchedule, removeSchedule }}>
      {children}
    </SchedulerContext.Provider>
  );
}

export function useScheduler() {
  return useContext(SchedulerContext);
}