import React, { createContext, useState, useContext, useEffect } from "react";
import SchedulingService from "../core/schedulingService";

const SchedulerContext = createContext();

export function SchedulerProvider({ children }) {
  const [schedulers, setSchedulers] = useState([]);

  // Carrega os agendamentos do armazenamento local ao iniciar
  useEffect(() => {
    const loadSchedulers = async () => {
      try {
        const storedSchedulers = await SchedulingService.getAllSchedules();
        setSchedulers(storedSchedulers);
      } catch (error) {
        console.error("Erro ao carregar os agendamentos:", error);
      }
    };

    loadSchedulers();
  }, []);

  const addSchedule = async (schedule) => {
    try {
      await SchedulingService.addSchedule(schedule); // Adiciona ao armazenamento local
      const updatedSchedulers = await SchedulingService.getAllSchedules(); // Atualiza a lista
      setSchedulers(updatedSchedulers);
    } catch (error) {
      console.error("Erro ao adicionar agendamento:", error);
    }
  };

  const removeSchedule = async (id) => {
    try {
      await SchedulingService.removeSchedule(id); // Remove do armazenamento local
      const updatedSchedulers = await SchedulingService.getAllSchedules(); // Atualiza a lista
      setSchedulers(updatedSchedulers);
    } catch (error) {
      console.error("Erro ao remover agendamento:", error);
    }
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