import AlertModal from "@/components/UI/AlertModal";
import { NoData } from "@/components/UI/NoData";
import { OrdinationButton } from "@/components/UI/OrdinationButton";
import { RowItem } from "@/components/UI/RowItem";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { validityDataStore } from "@/store/validityDataStore";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StatusBar, TouchableOpacity, useColorScheme, View } from "react-native";

type validity = {
  id: number;
  branch_id: number;
  employee_id: number;
  status: string | null;
  request_id: number | null;
  created_at: string;
  modified_at: string;
  hsvalidity_products: [];
};

export default function History() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { alertData, hideAlert, showAlert, visible } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const url = process.env.EXPO_PUBLIC_API_URL;

  const [ordinationItems, setOrdinationItems] = useState([
    { label: "Recentes", value: "desc" },
    { label: "Antigos", value: "asc" },
  ]);

  const [ordination, setOrdination] = useState<"asc" | "desc">("desc");

  const setProducts = validityDataStore((state) => state.setProductsList);

  const [validities, setValidities] = useState<validity[]>([]);

  const [noData, setNoData] = useState(false);

  const getValidities = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      setIsLoading(true);

      const response = await fetch(`${url}/validities/me?orderBy=${ordination}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.length > 0) {
          setValidities(responseData);
          console.log(responseData);
        } else {
          setNoData(true);
        }
      } else {
        showAlert({
          title: "Erro!",
          text: responseData.message,
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons,
        });
        console.log(ordination);
        console.log(responseData.errors);
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error.message}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getValidities();
  }, []);

  useEffect(() => {
    getValidities();
  }, [ordination]);

  if (noData) {
    return <NoData />;
  }

  return (
    <Screen>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View className="">
        <OrdinationButton items={ordinationItems} value={ordination} onChange={(val: any) => setOrdination(val)} />
      </View>

      <View className="flex-1">
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={60} color={theme.iconColor} />
          </View>
        ) : (
          <FlatList
            data={validities}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.6}
                className="border-b border-gray-300 py-2"
                onPress={() => {
                  router.push("./historyProducts");
                  setProducts(item.hsvalidity_products);
                }}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <RowItem label="#" value={item.id} />
                    <RowItem label="Filial: " value={item.branch_id} />
                    <RowItem label="Criado em: " value={new Date(item.created_at).toLocaleDateString("pt-BR")} />
                  </View>
                  <View>
                    <Octicons name="chevron-right" size={30} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {alertData && (
        <AlertModal
          visible={visible}
          ButtonComponentPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData.iconFamily}
        />
      )}
    </Screen>
  );
}
