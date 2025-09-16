import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";



export default function Layout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  console.log(colorScheme);

  const [fontsLoaded] = useFonts({
    "Lexend-Regular": require("../../assets/fonts/Lexend/Lexend-Regular.ttf"),
    "Lexend-Bold": require("../../assets/fonts/Lexend/Lexend-Bold.ttf"),
    "Lexend-SemiBold": require("../../assets/fonts/Lexend/Lexend-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.navBackground, },
            headerTintColor: theme.navText,
            headerTitleStyle: { fontFamily: "Lexend-Bold" },
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login" options={{ title: "Cadastro", headerShown: false, }} />
          <Stack.Screen name="auth/forgotPassword" options={{ title: "Mudar Senha", headerShown: false, }} />
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
      </View>
    </SafeAreaProvider>
  );
}
