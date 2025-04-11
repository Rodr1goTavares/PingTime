import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import SchedulingService from "../../core/schedulingService";

export default function SchedulerWeekView() {
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
    const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const grouped = {};

    schedules.forEach((schedule) => {
      const eventDate = new Date(schedule.eventDateTime);
      const dayName = daysOfWeek[eventDate.getDay()];

      if (!grouped[dayName]) {
        grouped[dayName] = [];
      }
      grouped[dayName].push(schedule);
    });

    return grouped;
  };

  return (
    <ScrollView style={styles.container}>
      {Object.keys(groupedSchedules).map((day) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{day}</Text>
          {groupedSchedules[day].map((schedule) => (
            <View key={schedule.id} style={styles.scheduleItem}>
              <Text style={styles.scheduleName}>{schedule.name}</Text>
              <Text style={styles.scheduleDate}>
                {new Date(schedule.eventDateTime).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50",
  },
  scheduleItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scheduleDate: {
    fontSize: 14,
    color: "#666",
  },
});