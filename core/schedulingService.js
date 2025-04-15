import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleNotification } from "./notificationService";

export default class SchedulingService {
  static STORAGE_KEY = "schedules";

  static async addSchedule(schedule) {
    try {
      const schedules = await this.getAllSchedules();
      schedules.push(schedule);
      await AsyncStorage.setItem(SchedulingService.STORAGE_KEY, JSON.stringify(schedules));
      scheduleNotification(schedule); // Agendar notificação
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  }

  static async removeSchedule(scheduleId) {
    try {
      const schedules = await this.getAllSchedules();
      const updatedSchedules = schedules.filter((schedule) => schedule.id !== scheduleId);
      await AsyncStorage.setItem(SchedulingService.STORAGE_KEY, JSON.stringify(updatedSchedules));
    } catch (error) {
      console.error("Error removing schedule:", error);
    }
  }

  static async getAllSchedules() {
    try {
      const schedules = await AsyncStorage.getItem(SchedulingService.STORAGE_KEY);
      return schedules ? JSON.parse(schedules) : [];
    } catch (error) {
      console.error("Error retrieving schedules:", error);
      return [];
    }
  }
}
