import { consumptionGroupsStore } from "@/store/consumptionGroupsStore";
import { userDataStore } from "@/store/userDataStore";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Colors } from "../constants/colors";

export function useAuth(url: string, showAlert: any) {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = userDataStore((state) => state.setUser);
  const setConsumptionGroups = consumptionGroupsStore((state) => state.setGroupsList);

  const getconsumptionGroups = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/consumption-groups`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setConsumptionGroups(responseData);
      } else {
        showAlert({
          title: "Erro!",
          text: responseData.message,
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons,
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${url}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        setUser(data.user);
        await getconsumptionGroups();
        router.replace("/main/tabs/modules");
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
