import { ItemList } from "@/components/UI/ItemList";
import { Screen } from "@/components/UI/Screen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar, useColorScheme, View } from "react-native";

export default function ValidityHome() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Screen>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View className="">
        <ItemList
          IconFamily={MaterialCommunityIcons}
          iconName="pencil-outline"
          label="Vistoria avulsa"
          requiredPermissions={[29]}
          route="./individualValidity/selectFilialValidity"
        />

        <ItemList
          IconFamily={Ionicons}
          iconName="receipt-outline"
          label="Vistoria por solicitação"
          route="./validityRequest/selectRequest"
        />

        <ItemList
          IconFamily={Ionicons}
          iconName="file-tray-outline"
          label="Solicitações de validade"
          route="./validityRequest/requests"
        />

        <ItemList IconFamily={Ionicons} iconName="time-outline" label="Histórico" route="./history" />
      </View>
    </Screen>
  );
}
