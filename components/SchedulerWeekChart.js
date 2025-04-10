import React, { useEffect, useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import SchedulingService from "../core/schedulingService";

export default function SchedulerWeekChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    loadSchedulers();
  }, []);

  const loadSchedulers = async () => {
    const schedules = await SchedulingService.getAllSchedules();
    const grouped = groupSchedulesByDay(schedules);
    const labels = Object.keys(grouped);
    const data = Object.values(grouped).map((schedules) => schedules.length);

    setChartData({
      labels,
      datasets: [{ data }],
    });
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

    // Garante que todos os dias da semana estejam presentes no gráfico
    daysOfWeek.forEach((day) => {
      if (!grouped[day]) {
        grouped[day] = [];
      }
    });

    return grouped;
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 40} // Largura do gráfico
        height={220} // Altura do gráfico
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        verticalLabelRotation={30} // Rotação dos rótulos no eixo X
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});