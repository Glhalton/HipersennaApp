import { ItemList } from "@/components/UI/ItemList";
import { Screen } from "@/components/UI/Screen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

export default function dispatchHome() {
  return (
    <Screen>
      <View>
        <ItemList
          IconFamily={MaterialCommunityIcons}
          iconName="pencil-outline"
          label="Cadastrar expedição"
          requiredPermissions={[47]}
          route="./dispatchForm"
        />
        <ItemList
          IconFamily={Ionicons}
          iconName="receipt-outline"
          label="Consultar expedições"
          requiredPermissions={[46]}
          route="./dispatchSearch"
        />
      </View>
    </Screen>
  );
}
