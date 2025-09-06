import { router, Stack } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function Layout() {
  const [fontsLoaded] = useFonts({
    "Lexend-Regular": require("../../assets/fonts/Lexend/Lexend-Regular.ttf"),
    "Lexend-Bold": require("../../assets/fonts/Lexend/Lexend-Bold.ttf"),
    "Lexend-SemiBold": require("../../assets/fonts/Lexend/Lexend-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {},
          headerTintColor: "#205072",
          headerTitleStyle: { fontWeight: "bold", fontFamily: "Lexend" }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-up" options={{ title: "Cadastro" }} />
        <Stack.Screen name="vistoriaFormulario" options={{ title: "Vistoria" }} />
        <Stack.Screen name="home" />
        <Stack.Screen name="relatorios" options={{ title: "Relatórios" }} />
        <Stack.Screen name="relatorioVencimento" options={{ title: "Relatório Vencimento" }} />
        <Stack.Screen name="relatorioBonus" options={{ title: "Relatório Bônus" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
