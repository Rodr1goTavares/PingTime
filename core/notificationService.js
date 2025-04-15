import * as Notifications from "expo-notifications";

export const scheduleNotification = async (schedule) => {
  const eventDate = new Date(schedule.eventDateTime);
  const currentTime = new Date();
  const timeDifference = eventDate - currentTime;

  if (timeDifference > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Evento: ${schedule.name}`,
        body: `Seu evento "${schedule.name}" está próximo!`,
      },
      trigger: {
        seconds: Math.floor(timeDifference / 1000), // Tempo restante em segundos
      },
    });
  }
};