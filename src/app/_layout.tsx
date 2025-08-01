import { Stack } from "expo-router";

export default function Layout() {
  return(
    <Stack  screenOptions={{headerStyle: {}, headerTintColor: "#205072", headerTitleStyle:{fontWeight: "bold", }}}>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="sign-up" options={{title: "Cadastro"}}/>
      <Stack.Screen name="vistoriaFormulario" options={{title: "Vistoria"}}/>
      <Stack.Screen name="home" options={{headerShown: false}}/>
    </Stack>
  )
}
    