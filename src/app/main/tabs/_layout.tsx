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
          tabBarActiveTintColor: "#3e434dff",
          tabBarLabelStyle: {
            fontSize: 14,
            marginTop: 4,
            fontFamily: "Roboto-Regular",
          },
          tabBarStyle: {
            backgroundColor: theme.navBottomBackground,
            height: 130,
            paddingTop: 10,
          },
          headerStyle: { backgroundColor: "#25292E", height: 90 },
          headerLeft: () => (
            <Image
              source={require("../../../../assets/images/Hipersenna-yellow-icon.png")}
              style={{ width: 35, marginLeft: 20 }}
              resizeMode="contain"
              tintColor={"white"}
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
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-sharp" color={color} size={size} />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
