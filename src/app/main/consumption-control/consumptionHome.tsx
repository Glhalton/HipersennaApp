import { ItemList } from "@/components/UI/ItemList";
import { Screen } from "@/components/UI/Screen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar, useColorScheme } from "react-native";

export default function Modules() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Screen>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

      <ItemList
        IconFamily={MaterialCommunityIcons}
        iconName="pencil-outline"
        label="Cadastro avulso"
        route="./consumptionForm"
        requiredPermissions={[39, 7]}
        mode="ALL"
      />

      <ItemList
        IconFamily={Ionicons}
        iconName="document-attach-outline"
        label="Cadastro assinado"
        route="./consumptionForm"
        requiredPermissions={[39, 7]}
        mode="ALL"
      />

      <ItemList
        IconFamily={Ionicons}
        iconName="people-outline"
        label="Grupos de consumo"
        requiredPermissions={[42]}
        route="./consumptionGroups"
      />

      <ItemList
        IconFamily={Ionicons}
        iconName="archive-outline"
        label="Baixa de produtos"
        requiredPermissions={[38]}
        route="./writeOffProducts"
      />

      <ItemList
        IconFamily={Ionicons}
        iconName="receipt-outline"
        label="Notas de consumo"
        requiredPermissions={[34]}
        route="./consumptionNotes"
      />
    </Screen>
  );
}
