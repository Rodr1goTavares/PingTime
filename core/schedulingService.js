import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SchedulingService {
  static STORAGE_KEY = 'schedules';

  static scheduleNotification(schedule) {
    const eventTime = new Date(schedule.eventDateTime).getTime();
    const currentTime = Date.now();
    const timeDifference = eventTime - currentTime;

    if (timeDifference > 0) {
      PushNotification.localNotificationSchedule({
        channelId: 'default-channel-id', // Certifique-se de configurar o canal no Android
        title: `Evento: ${schedule.name}`,
        message: `Seu evento "${schedule.name}" está próximo!`,
        date: new Date(eventTime - 5 * 60 * 1000),
        allowWhileIdle: true,
      });
    }
  }

  static async addSchedule(schedule) {
    try {
      const schedules = await this.getAllSchedules();
      schedules.push(schedule);
      await AsyncStorage.setItem(SchedulingService.STORAGE_KEY, JSON.stringify(schedules));
      scheduleNotification(schedule);
    }
    catch (error) {
      console.error('Error adding schedule:', error);
    }
  }

  static async removeSchedule(scheduleId) {
    try {
      const schedules = await this.getAllSchedules();
      const updatedSchedules = schedules.filter(schedule => schedule.id !== scheduleId);
      await AsyncStorage.setItem(SchedulingService.STORAGE_KEY, JSON.stringify(updatedSchedules));
    } catch (error) {
      console.error('Error removing schedule:', error);
    }
  }

  static async getAllSchedules() {
    try {
      const schedules = await AsyncStorage.getItem(SchedulingService.STORAGE_KEY);
      return schedules ? JSON.parse(schedules) : [];
    } catch (error) {
      console.error('Error retrieving schedules:', error);
      return [];
    }
  }
}
