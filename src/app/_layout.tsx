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
    "Roboto-Regular": require("../../assets/fonts/Roboto/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../../assets/fonts/Roboto/Roboto-Bold.ttf"),
    "Roboto-SemiBold": require("../../assets/fonts/Roboto/Roboto-SemiBold.ttf"),
    "Roboto-Italic": require("../../assets/fonts/Roboto/Roboto-Italic.ttf"),
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
            headerTitleStyle: { fontFamily: "Roboto-Regular" },
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="main/tabs" options={{ headerShown: false }} />
          <Stack.Screen name="main/product/searchProduct" options={{ title: "Consultar Produto" }} />
          <Stack.Screen name="main/validity/home" options={{ title: "Cadastro", headerShown: false }} />
          <Stack.Screen name="main/validity/history" options={{ title: "Histórico" }} />
          <Stack.Screen name="main/validity/historyProducts" options={{ title: "Histórico" }} />
          <Stack.Screen
            name="main/validity/validityForm/selectFilialValidity"
            options={{ title: "Seleção de Filial" }}
          />
          <Stack.Screen name="main/validity/validityForm/validityForm" options={{ title: "Vistoria" }} />
          <Stack.Screen name="main/validity/validityForm/validitySummary" options={{ title: "Resumo" }} />
          <Stack.Screen name="main/validity/validityForm/selectRequest" options={{ title: "Solicitações" }} />
          <Stack.Screen name="main/validity/validityForm/validityRequestProducts" options={{ title: "Produtos" }} />
          <Stack.Screen name="main/validity/validityRequest/requests" options={{ title: "Solicitações" }} />
          <Stack.Screen name="main/validity/validityRequest/requestProducts" options={{ title: "Produtos" }} />
          
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
