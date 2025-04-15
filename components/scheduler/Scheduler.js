import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Scheduler({ name, date, description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calcula a diferença de tempo entre a data atual e a data do evento
  const eventDate = new Date(date);
  const currentTime = new Date();
  const timeDifference = eventDate - currentTime;

  // Define as cores com base na proximidade da data
  backgroundColor = "#fff3cd"; // Amarelo (evento distante)
  borderColor = "#ffc107";

  if (timeDifference <= 24 * 60 * 60 * 1000) {
    // Menos de 24 horas
    backgroundColor = "#d4edda"; // Verde (evento próximo)
    borderColor = "#28a745";
  }

  if (timeDifference <= 0) {
    // Evento já passou
    backgroundColor = "#f8d7da"; // Vermelho (evento expirado)
    borderColor = "#dc3545";
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor, borderColor }]}
      onPress={() => setIsExpanded(!isExpanded)} // Alterna o dropdown
    >
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{eventDate.toLocaleString()}</Text>
      </View>
      {isExpanded && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 2,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  descriptionContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 5,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
});