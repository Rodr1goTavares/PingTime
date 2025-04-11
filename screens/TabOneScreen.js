import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";

import { Text, View } from "../components/Themed";
import SchedulerTabbedView from "../components/week_view/SchedulerTabbedView";


export default function TabOneScreen() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prevKey) => prevKey + 1);
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <SchedulerTabbedView />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
