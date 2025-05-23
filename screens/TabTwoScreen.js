import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import SchedulerList from "../components/scheduler/SchedulerList.js";


export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <SchedulerList/>
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
