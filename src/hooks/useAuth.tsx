import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";

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

            if (data.token) {
                await AsyncStorage.setItem("token", data.token);
                router.replace("/main/home");
                return true;
            } else {
                showAlert({
                    title: "Erro!",
                    text: data.message,
                    icon: "error-outline",
                    color: Colors.red,
                    iconFamily: MaterialIcons
                })
                return false;
            }
        } catch (error: any) {
            showAlert({
                title: "Erro!",
                text: `Não foi possível conectar ao servidor: ${error.message}`,
                icon: "error-outline",
                color: Colors.red,
                iconFamily: MaterialIcons
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const checkSession = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                return;
            }

            const response = await fetch(`${url}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                router.replace("/main/home");
            } else {
                await AsyncStorage.removeItem("token");
            }
        } catch (error: any) {
            showAlert({
                title: "Erro!",
                text: `Não foi possível conectar ao servidor:  ${error.message}`,
                icon: "error-outline",
                color: Colors.red,
                iconFamily: MaterialIcons
            })
        } finally {
            setIsLoading(false);
        }
    };

    return {login, checkSession, isLoading}
}