import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import SchedulingService from "../../core/schedulingService";

export default function SchedulerWeekTable() {
  const [groupedSchedules, setGroupedSchedules] = useState({});

  useEffect(() => {
    loadSchedulers();
  }, []);

  const loadSchedulers = async () => {
    const schedules = await SchedulingService.getAllSchedules();
    const grouped = groupSchedulesByDay(schedules);
    setGroupedSchedules(grouped);
  };

  const groupSchedulesByDay = (schedules) => {
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const grouped = {};

    schedules.forEach((schedule) => {
      const eventDate = new Date(schedule.eventDateTime);
      const dayName = daysOfWeek[eventDate.getDay()];

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
    <ScrollView horizontal style={styles.container}>
      <View style={styles.table}>
        {/* Cabeçalho da tabela */}
        <View style={styles.headerRow}>
          {Object.keys(groupedSchedules).map((day) => (
            <Text key={day} style={styles.headerCell}>
              {day}
            </Text>
          ))}
        </View>

        {/* Linhas da tabela */}
        <View style={styles.body}>
          {Object.keys(groupedSchedules).map((day) => (
            <View key={day} style={styles.column}>
              {groupedSchedules[day].map((schedule) => (
                <View key={schedule.id} style={styles.cell}>
                  <Text style={styles.cellText}>{schedule.name}</Text>
                  <Text style={styles.cellSubText}>
                    {new Date(schedule.eventDateTime).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  table: {
    flexDirection: "row",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  body: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cellText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cellSubText: {
    fontSize: 12,
    color: "#666",
  },
});