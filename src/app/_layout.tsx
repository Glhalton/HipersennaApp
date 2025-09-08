import { router, Stack } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import colors from "../../constants/colors";


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
          headerStyle: { backgroundColor: colors.red2,},
          headerTintColor: colors.white,
          headerTitleStyle: { fontFamily: "Lexend-Bold" }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" options={{ title: "Cadastro", headerShown: false, }} />
        <Stack.Screen name="main/home" options={{ title: "Cadastro", headerShown: false, }} />
        <Stack.Screen name="main/settings" options={{ title: "Configurações" }} />
        <Stack.Screen name="main/history" options={{ title: "Histórico" }} />
        <Stack.Screen name="main/validityForm/selectType" options={{ title: "Seleção de Tipo" }} />
        <Stack.Screen name="main/validityForm/selectFilialValidity" options={{ title: "Seleção de Filial" }} />
        <Stack.Screen name="main/validityForm/validityForm" options={{ title: "Vistoria" }} />
        <Stack.Screen name="main/validityForm/validitySummary" options={{ title: "Resumo" }} />
        <Stack.Screen name="main/validityForm/selectRequest" options={{ title: "Solicitações" }} />
        <Stack.Screen name="main/validityForm/validityRequestProducts" options={{ title: "Produtos" }} />
        <Stack.Screen name="main/validityRequest/requests" options={{ title: "Solicitações" }} />
        <Stack.Screen name="main/validityRequest/requestForm" options={{ title: "Solicitação" }} />
        <Stack.Screen name="main/validityRequest/requestSummary" options={{ title: "Resumo" }} />
        <Stack.Screen name="main/validityRequest/requestProducts" options={{ title: "Produtos" }} />
        <Stack.Screen name="main/validityRequest/selectFilialRequest" options={{ title: "Solicitações" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
