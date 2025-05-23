import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, Modal, Pressable } from "react-native";
import { Button, TextInput, IconButton, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import DatePicker from "react-native-date-picker"; // Importa o time picker
import { useScheduler } from "../../context/SchedulerContext";

export default function SchedulerList() {
  const { colors } = useTheme();
  const { schedulers, addSchedule, removeSchedule } = useScheduler();
  const [visible, setVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null); // Estado para o horário
  const [showTimePicker, setShowTimePicker] = useState(false); // Controla a exibição do time picker

  const [newSchedule, setNewSchedule] = useState({
    name: "",
    description: "",
    priority: "medium",
    eventDateTime: null,
  });

  const handleCreate = () => {
    if (!newSchedule.name || !newSchedule.eventDateTime) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const scheduleToSave = {
      ...newSchedule,
      id: Date.now(),
      scheduleDateTime: new Date().toISOString(),
    };

    addSchedule(scheduleToSave);
    Alert.alert("Agendamento criado!");
    setNewSchedule({ name: "", description: "", priority: "medium", eventDateTime: null });
    setFormVisible(false);
  };

  const handleDelete = (id) => {
    removeSchedule(id);
    Alert.alert("Agendamento excluído!");
  };

  const openDatePicker = () => setVisible(true);
  const closeDatePicker = () => setVisible(false);

  const onConfirmDate = (params) => {
    setSelectedDate(params.date);

    // Atualiza o estado com a data combinada, se o horário já foi selecionado
    if (selectedTime) {
      const combinedDateTime = new Date(params.date);
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());
      setNewSchedule({ ...newSchedule, eventDateTime: combinedDateTime.toISOString() });
    }
    closeDatePicker();
  };

  const openTimePicker = () => setShowTimePicker(true);

  const onTimeConfirm = (time) => {
    setShowTimePicker(false);
    setSelectedTime(time);

    // Atualiza o estado com a data combinada, se a data já foi selecionada
    if (selectedDate) {
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(time.getHours());
      combinedDateTime.setMinutes(time.getMinutes());
      setNewSchedule({ ...newSchedule, eventDateTime: combinedDateTime.toISOString() });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={schedulers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.scheduleItem, { backgroundColor: colors.surface }]}>
            <View style={styles.scheduleInfo}>
              <Text style={[styles.scheduleName, { color: colors.onSurface }]}>{item.name}</Text>
              <Text style={[styles.scheduleDate, { color: colors.onSurface }]}>
                {new Date(item.eventDateTime).toLocaleString()}
              </Text>
            </View>
            <IconButton
              icon="delete"
              color={colors.error}
              size={20}
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.noSchedulesText, { color: colors.onBackground }]}>
            Nenhum agendamento
          </Text>
        }
      />

      <Button
        mode="contained"
        onPress={() => setFormVisible(true)}
        style={[styles.addButton, { backgroundColor: colors.primary }]}
      >
        +
      </Button>

      <Modal
        visible={formVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFormVisible(false)}
      >
        <Pressable onPress={() => setFormVisible(false)}>
          <View style={styles.modalOverlay} />
        </Pressable>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <TextInput
            label="Nome do Evento"
            value={newSchedule.name}
            onChangeText={(text) => setNewSchedule({ ...newSchedule, name: text })}
            style={[styles.input, { backgroundColor: colors.background }]}
            theme={{ colors: { text: colors.onBackground } }}
          />
          <TextInput
            label="Descrição"
            value={newSchedule.description}
            onChangeText={(text) => setNewSchedule({ ...newSchedule, description: text })}
            style={[styles.input, { backgroundColor: colors.background }]}
            theme={{ colors: { text: colors.onBackground } }}
          />
          <Button
            mode="contained"
            onPress={openDatePicker}
            style={[styles.dateButton, { backgroundColor: colors.primary }]}
          >
            {selectedDate
              ? `Data Selecionada: ${selectedDate.toLocaleDateString()}`
              : "Selecionar Data"}
          </Button>
          <Button
            mode="contained"
            onPress={openTimePicker}
            style={[styles.dateButton, { backgroundColor: colors.primary }]}
          >
            {selectedTime
              ? `Horário Selecionado: ${selectedTime.getHours()}:${selectedTime.getMinutes()}`
              : "Selecionar Horário"}
          </Button>
          <Button
            mode="contained"
            onPress={handleCreate}
            style={[styles.createButton, { backgroundColor: colors.primary }]}
          >
            Criar Agendamento
          </Button>
          <Button
            mode="text"
            onPress={() => setFormVisible(false)}
            style={[styles.cancelButton, { color: colors.error }]}
          >
            Cancelar
          </Button>
        </View>
      </Modal>

      <DatePickerModal
        locale="pt"
        mode="single"
        visible={visible}
        onDismiss={closeDatePicker}
        date={selectedDate}
        onConfirm={onConfirmDate}
      />

      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.timePickerContainer}>
          <DatePicker
            mode="time"
            date={selectedTime || new Date()}
            onDateChange={onTimeConfirm}
            locale="pt"
          />
          <Button
            mode="text"
            onPress={() => setShowTimePicker(false)}
            style={styles.cancelButton}
          >
            Fechar
          </Button>
        </View>
      </Modal>
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
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scheduleDate: {
    fontSize: 14,
    marginTop: 5,
  },
  noSchedulesText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    marginBottom: 10,
  },
  dateButton: {
    marginBottom: 10,
  },
  createButton: {
    marginBottom: 10,
  },
  cancelButton: {
    alignSelf: "center",
  },
  timePickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
