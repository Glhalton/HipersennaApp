import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Colors } from "../constants/colors";

export function useAuth(url: string, showAlert: any) {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${url}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        router.replace("/main/home");
        return true;
      } else {
        showAlert({
          title: "Erro!",
          text: data.message,
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons,
        });
        return false;
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error.message}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
}
