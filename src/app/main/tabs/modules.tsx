import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";

export default function Modules() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <SafeAreaView style={styles.container}  edges={["bottom"]}>
      <View style={styles.header}></View>
      <View style={styles.main}>

        <Text style={[styles.title, {color: theme.title}]}>Módulos</Text>

        <View style={styles.modulesList}>
          <View>
            <TouchableOpacity
              onPress={() => {
                router.push("../validity/home");
              }}
              style={styles.optionButton}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Ionicons name="calendar-outline" color={theme.iconColor} size={30} />
                </View>
                <Text style={[styles.text, { color: theme.text }]}>Vencimento</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // router.push("/");
              }}
              style={styles.optionButton}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Ionicons name="document-text-outline" color={theme.iconColor} size={30} />
                </View>
                <Text style={[styles.text, { color: theme.text }]}>Requisição</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // router.push("./modules");
              }}
              style={styles.optionButton}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Ionicons name="pricetag-outline" color={theme.iconColor} size={30} />
                </View>
                <Text style={[styles.text, { color: theme.text }]}>Cotação</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("../product/searchProduct");
              }}
              style={styles.optionButton}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Ionicons name="search" color={theme.iconColor} size={30} />
                </View>
                <Text style={[styles.text, { color: theme.text }]}>Consulta de produtos</Text>
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
    paddingVertical: 20,
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
  optionButton: {
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
