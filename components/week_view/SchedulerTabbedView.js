import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useScheduler } from "../../context/SchedulerContext";

export default function SchedulerTabbedView() {
  const { schedulers } = useScheduler(); // Consome o contexto
  const [groupedSchedules, setGroupedSchedules] = useState({});
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[today.getDay()]);

  useEffect(() => {
    const grouped = groupSchedulesByDay(schedulers);
    setGroupedSchedules(grouped);
  }, [schedulers]); // Atualiza quando os agendamentos mudam

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

    daysOfWeek.forEach((day) => {
      if (!grouped[day]) {
        grouped[day] = [];
      }
    });

    return grouped;
  };

  return (
    <View style={styles.container}>
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