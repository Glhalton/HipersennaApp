import { FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";

export default function Layout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [fontsLoaded] = useFonts({
    "Lexend-Regular": require("../../assets/fonts/Lexend/Lexend-Regular.ttf"),
    "Lexend-Bold": require("../../assets/fonts/Lexend/Lexend-Bold.ttf"),
    "Lexend-SemiBold": require("../../assets/fonts/Lexend/Lexend-SemiBold.ttf"),
    "Lato-Regular": require("../../assets/fonts/Lato/Lato-Regular.ttf"),
    "Lato-Bold": require("../../assets/fonts/Lato/Lato-Bold.ttf"),
    "Lato-Italic": require("../../assets/fonts/Lato/Lato-Italic.ttf"),
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...FontAwesome6.font,
    ...FontAwesome.font,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.iconColor} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.navBackground },
            headerTintColor: theme.navText,
            headerTitleStyle: { fontFamily: "Lexend-Bold" },
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="main/home" options={{ title: "Cadastro", headerShown: false }} />
          <Stack.Screen name="main/settings" options={{ title: "Configurações" }} />
          <Stack.Screen name="main/history" options={{ title: "Histórico" }} />
          <Stack.Screen name="main/historyProducts" options={{ title: "Histórico" }} />
          <Stack.Screen name="main/validityForm/selectFilialValidity" options={{ title: "Seleção de Filial" }} />
          <Stack.Screen name="main/validityForm/validityForm" options={{ title: "Vistoria" }} />
          <Stack.Screen name="main/validityForm/validitySummary" options={{ title: "Resumo" }} />
          <Stack.Screen name="main/validityForm/selectRequest" options={{ title: "Solicitações" }} />
          <Stack.Screen name="main/validityForm/validityRequestProducts" options={{ title: "Produtos" }} />
          <Stack.Screen name="main/validityRequest/requests" options={{ title: "Solicitações" }} />
          <Stack.Screen name="main/validityRequest/requestProducts" options={{ title: "Produtos" }} />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
