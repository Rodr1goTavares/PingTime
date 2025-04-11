import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import SchedulingService from "../../core/schedulingService";

export default function SchedulerWeekCarousel() {
  const [groupedSchedules, setGroupedSchedules] = useState({});
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const renderDay = ({ item: day }) => (
    <View style={styles.page}>
      <Text style={styles.dayTitle}>{day}</Text>
      {groupedSchedules[day]?.length > 0 ? (
        groupedSchedules[day].map((schedule) => (
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
    </View>
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / Dimensions.get("window").width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={daysOfWeek}
        keyExtractor={(item) => item}
        renderItem={renderDay}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      />
      <Text style={styles.currentDayText}>
        Dia Atual: {daysOfWeek[currentIndex]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  carousel: {
    flex: 1,
  },
  page: {
    width: Dimensions.get("window").width,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4CAF50",
  },
  scheduleItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "90%",
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
    marginTop: 20,
  },
  currentDayText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#4CAF50",
  },
});