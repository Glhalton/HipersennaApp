import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";

export default function MainTabsLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarLabelStyle:{
            fontSize: 14,
            marginTop: 4,
            fontFamily: "Roboto-Regular"
          },
          tabBarStyle: {
            backgroundColor: "#25292E",
            height: 110
          },
              headerStyle: { backgroundColor: "#25292E" },
              headerLeft: () => (
                <Image
                  source={require("../../../../assets/images/Hipersenna-yellow-icon.png")}
                  style={{ width: 35, marginLeft: 20 }}
                  resizeMode="contain"
                />
              ),
        }}
        
      >
        <Tabs.Screen
          name="modules"
          options={{
            tabBarLabel: "Módulos",
            title: "",
            tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: "Configurações",
            title: "",
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
