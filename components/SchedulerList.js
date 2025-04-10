import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  TextInput,
  Button,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import SchedulingService from "../core/schedulingService";

export default function SchedulerList() {
  const [schedulers, setSchedulers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    description: "",
    priority: "medium",
    eventDateTime: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadSchedulers();
  }, []);

  const loadSchedulers = async () => {
    const schedules = await SchedulingService.getAllSchedules();
    setSchedulers(schedules);
  };

  const handleDelete = async (id) => {
    await SchedulingService.removeSchedule(id);
    Alert.alert("Agendamento removido!");
    loadSchedulers();
  };

  const handleCreate = async () => {
    if (!newSchedule.name || !newSchedule.eventDateTime) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const scheduleToSave = {
      ...newSchedule,
      id: Date.now(),
      scheduleDateTime: new Date().toISOString(),
    };

    await SchedulingService.addSchedule(scheduleToSave);
    Alert.alert("Agendamento criado!");
    setModalVisible(false);
    setNewSchedule({ name: "", description: "", priority: "medium", eventDateTime: new Date() });
    loadSchedulers();
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Deletar</Text>
      </TouchableOpacity>
    </View>
  );

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewSchedule({ ...newSchedule, eventDateTime: selectedDate });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createButtonText}>Criar Agendamento</Text>
      </TouchableOpacity>
      <FlatList
        data={schedulers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
        }
      />

      {/* Modal para criar agendamento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Agendamento</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Evento"
              value={newSchedule.name}
              onChangeText={(text) => setNewSchedule({ ...newSchedule, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={newSchedule.description}
              onChangeText={(text) =>
                setNewSchedule({ ...newSchedule, description: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Prioridade (low, medium, high)"
              value={newSchedule.priority}
              onChangeText={(text) =>
                setNewSchedule({ ...newSchedule, priority: text })
              }
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                {`Data e Hora do Evento: ${newSchedule.eventDateTime.toLocaleString()}`}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newSchedule.eventDateTime}
                mode="datetime"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
              />
            )}
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Salvar" onPress={handleCreate} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemContainer: {
    color: "#fff",
    //backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    //color: "#999",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    //backgroundColor: "#000",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  datePickerButton: {
    backgroundColor: "rgb(161, 161, 161);",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalButtons: {
    color: "#4CAF50",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});