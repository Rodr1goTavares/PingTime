import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useScheduler } from "../../context/SchedulerContext";
import Scheduler from "../scheduler/Scheduler"; // Importa o componente Scheduler

export default function SchedulerTabbedView() {
  const { schedulers } = useScheduler();
  const [groupedSchedules, setGroupedSchedules] = useState({});
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[today.getDay()]);

  useEffect(() => {
    const grouped = groupSchedulesByDay(schedulers);
    setGroupedSchedules(grouped);
  }, [schedulers]);

  const groupSchedulesByDay = (schedules) => {
    const grouped = {};

    schedules.forEach((schedule) => {
      const eventDate = new Date(schedule.eventDateTime);
      const dayName = daysOfWeek[eventDate.getDay()];

      if (!grouped[dayName]) {
        grouped[dayName] = [];
      }
      grouped[dayName].push(schedule);
    });

    // Ordena os eventos de cada dia do mais próximo ao mais distante
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime));
    });

    // Garante que todos os dias da semana estejam presentes
    daysOfWeek.forEach((day) => {
      if (!grouped[day]) {
        grouped[day] = [];
      }
    });

    return grouped;
  };

  return (
    <View style={styles.container}>
      {/* Abas para os dias da semana */}
      <View style={styles.tabs}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.tab,
              selectedDay === day && styles.activeTab,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.tabText,
                selectedDay === day && styles.activeTabText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de agendamentos do dia selecionado */}
      <ScrollView style={styles.scheduleList}>
        {groupedSchedules[selectedDay]?.length > 0 ? (
          groupedSchedules[selectedDay].map((schedule) => (
            <Scheduler
              key={schedule.id}
              name={schedule.name}
              date={schedule.eventDateTime}
              description={schedule.description}
            />
          ))
        ) : (
          <Text style={styles.noSchedulesText}>Nenhum agendamento</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    padding: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    paddingBottom: 30,
  },
  tab: {
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  activeTab: {
    borderWidth: 1,
    backgroundColor: "rgba(170, 142, 223, 0.52)",
    borderColor: "rgb(170, 142, 223)",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scheduleList: {
    flex: 1,
    padding: 20,
  },
  noSchedulesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});