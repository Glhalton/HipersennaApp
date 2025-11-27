import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";

type User = {
  id: number;
  branch_id: number;
  winthor_id: number;
  name: string;
  username: string;
  created_at: string;
  modified_at: string;
  hsusers_roles: {
    role_id: number;
    hsroles: {
      id: 1;
      name: string;
      description: string;
    };
  }[];
  hsusers_permissions: any[];
};

export default function Profile() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState<User>();

  const getUserData = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(`${url}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setUserData(responseData[0]);
      }
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={60} color={theme.iconColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.title}]}>DADOS DO USUÁRIO:</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.dataBox}>
          <View style={styles.rowBox}>
            <Text style={[styles.label, {color: theme.text}]}>Nome:</Text>
            <Text style={styles.text}>{userData?.name}</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={[styles.label, {color: theme.text}]}>Username:</Text>
            <Text style={styles.text}>{userData?.username}</Text>
          </View>
          <View style={[styles.rowBox]}>
            <Text style={[styles.label, {color: theme.text}]}>Cargo: </Text>
            <Text style={styles.text}>{userData?.hsusers_roles?.[0]?.hsroles?.name ?? "Sem cargo"}</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={[styles.label, {color: theme.text}]}>Filial:</Text>
            <Text style={styles.text}>{userData?.branch_id}</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={[styles.label, {color: theme.text}]}>Código do Winthor:</Text>
            <Text style={styles.text}>{userData?.winthor_id}</Text>
          </View>
          <View style={[styles.rowBox, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, {color: theme.text}]}>Código do GHSApp:</Text>
            <Text style={styles.text}>{userData?.id}</Text>
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
  },
  header: { paddingVertical: 15 },
  title: {
    fontFamily: "Roboto-SemiBold",
    fontSize: 16,
  },
  main: {},
  dataBox: {
    backgroundColor: "white",
    borderRadius: 12,

  },
  rowBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderColor: "#aaaaaaff",
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
  text: { fontSize: 16, color: Colors.gray },
  label: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
  },
});
