import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import SchedulingService from "../../core/schedulingService";


export default function SchedulerTabbedView() {
  const [groupedSchedules, setGroupedSchedules] = useState({});
  const [selectedDay, setSelectedDay] = useState("Dom");
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  useEffect(() => {
    loadSchedulers();
  }, []);

  const loadSchedulers = async () => {
    const schedules = await SchedulingService.getAllSchedules();
    const grouped = groupSchedulesByDay(schedules);
    setGroupedSchedules(grouped);
  };

  const groupSchedulesByDay = (schedules) => {
    const grouped = {};

    schedules.forEach((schedule) => {
      // Converte a data do evento para o fuso horário local
      const eventDate = new Date(schedule.eventDateTime);
      const dayName = daysOfWeek[eventDate.getDay()]; // Obtém o nome do dia da semana

      if (!grouped[dayName]) {
        grouped[dayName] = [];
      }
      grouped[dayName].push(schedule);
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
      {/* Abas de navegação */}
      <View style={styles.tabs}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.tab,
              selectedDay === day && styles.activeTab, // Aba ativa
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.tabText,
                selectedDay === day && styles.activeTabText, // Texto da aba ativa
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
            <View key={schedule.id} style={styles.scheduleItem}>
              <Text style={styles.scheduleName}>{schedule.name}</Text>
              <Text style={styles.scheduleDate}>
                {new Date(schedule.eventDateTime).toLocaleString()}
              </Text>
            </View>
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
    flex: 1,
    width: "100%",
    height: "100%",
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
  scheduleItem: {
    backgroundColor: "rgba(170, 142, 223, 0.24)",
    borderColor: "rgb(170, 142, 223)",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 2,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scheduleDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  noSchedulesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});