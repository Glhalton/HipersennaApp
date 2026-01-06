import { ItemList } from "@/components/UI/ItemList";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, useColorScheme, View } from "react-native";

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
    <Screen>
      <View className="gap-4">
        <Text className="font-bold text-3xl">Configurações</Text>
        <View>
          <ItemList IconFamily={Ionicons} iconName="person-outline" label="Conta" route="../account/profile" />

          <ItemList
            IconFamily={Ionicons}
            iconName="exit-outline"
            iconColor="red"
            label="Sair"
            onPress={() => signOut()}
          />
        </View>
      </View>
    </Screen>
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
