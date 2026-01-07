import { ItemList } from "@/components/UI/ItemList";
import { Screen } from "@/components/UI/Screen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar, Text, View } from "react-native";

export default function Modules() {
  return (
    <Screen>
      <StatusBar barStyle="light-content" />
      <View className="gap-4">
        <Text className="font-bold text-3xl">Módulos</Text>
        <View>
          <ItemList
            IconFamily={Ionicons}
            iconName="search"
            label="Consulta de produtos"
            requiredPermissions={[7]}
            route="../product/searchProduct"
          />

          {/* <ItemList
            IconFamily={Ionicons}
            iconName="clipboard-outline"
            label="Controle de Consumos"
            requiredPermissions={[34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]}
            mode="ANY"
            route="../consumption-control/consumptionHome"
          /> */}

          <ItemList
            IconFamily={MaterialCommunityIcons}
            iconName="truck-outline"
            label="Expedição de cargas"
            route="../merchandise-dispatch/dispatchForm"
          />

          {/* <ItemList
            IconFamily={Ionicons}
            iconName="pricetag-outline"
            label="Cotação de preços"
            requiredRole={1}
            route="../priceQuotation/selectFilialQuotation"
          /> */}

          {/* <ItemList IconFamily={Ionicons} iconName="document-text-outline" label="Requisição" requiredRole={1} /> */}

          <ItemList
            IconFamily={Ionicons}
            iconName="calendar-outline"
            label="Vencimento"
            requiredPermissions={[29, 31]}
            mode="ANY"
            route="../validity/validityHome"
          />
        </View>
      </View>
    </Screen>
  );
}
