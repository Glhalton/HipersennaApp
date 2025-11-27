import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";

export default function Modules() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View style={styles.header}></View>
      <View style={styles.main}>
        <View style={styles.modulesList}>
          <View>
            <TouchableOpacity
              onPress={() => {
                router.push("./individualValidity/selectFilialValidity");
              }}
              style={styles.optionButtonComponent}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <MaterialCommunityIcons name="pencil-outline" color={theme.iconColor} size={35} />
                </View>
                <Text style={[styles.text, { color: theme.text }]}>Vistoria avulsa</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("./validityRequest/selectRequest");
              }}
              style={styles.optionButtonComponent}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Ionicons name="receipt-outline" color={theme.iconColor} size={30} />
                </View>
                <Text style={[styles.text, { color: theme.text }]}>Vistoria por solicitação</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("./validityRequest/requests");
              }}
              style={styles.optionButtonComponent}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Ionicons name="file-tray-outline" color={theme.iconColor} size={30} />
                </View>
                <Text style={[styles.text, { color: theme.text }]}>Solicitações de validade</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("./history");
              }}
              style={[styles.optionButtonComponent, {borderBottomWidth: 0}]}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Ionicons name="time-outline" color={theme.iconColor} size={30} />
                </View>
                <Text style={[styles.text, { color: theme.text }]}>Histórico</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  header: {},
  main: {
    gap: 15,
  },
  title: {
    fontFamily: "Roboto-Bold",
    fontSize: 30,
  },
  footer: {},
  modulesList: {
    gap: 15,
  },
  text: {
    fontSize: 17,
    fontFamily: "Roboto-SemiBold",
  },
  opcaoMenu: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  optionButtonComponent: {
    borderBottomWidth: 0.4,
    borderColor: Colors.gray,
    paddingVertical: 6,
  },
  optionIcon: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: 40,
    height: 40,
  },
});
