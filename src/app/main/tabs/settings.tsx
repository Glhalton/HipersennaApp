import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Modules() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;

    const signOut = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${url}/sessions/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        await AsyncStorage.removeItem("token");
        router.replace("/");
      } else {
        Alert.alert("Erro", "Erro ao sair do aplicativo:");
      }
    } catch (error: any) {
      Alert.alert("Erro", `Não foi possível conectar ao servidor: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}  edges={["bottom"]}>
      <View style={styles.header}></View>
      <View style={styles.main}>

        <Text style={[styles.title, {color: theme.title}]}>Configurações</Text>

        <View style={styles.modulesList}>
          <View>
            <TouchableOpacity
              onPress={() => {
                router.push("../account/profile");
              }}
              style={styles.optionButtonComponent}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Ionicons name="person-outline" color={theme.iconColor} size={30} />
                </View>
                <Text style={[styles.text, { color: theme.text }]}>Conta</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                signOut();
              }}
              style={[styles.optionButtonComponent, {borderBottomWidth: 0}]}
            >
              <View style={styles.opcaoMenu}>
                <View style={styles.optionIcon}>
                  <Ionicons name="exit-outline" color={Colors.red2} size={30} />
                </View>
                <Text style={[styles.text, { color: Colors.red2 }]}>Sair do aplicativo</Text>
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
