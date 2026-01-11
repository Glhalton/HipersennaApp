import NoData from "@/components/noData";
import { PermissionWrapper } from "@/components/permissionWrapper";
import Button from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import { RowItem } from "@/components/UI/RowItem";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { consumptionProductsStore } from "@/store/consumptionProductsStore";
import { MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";

type consumptionNotes = {
  id: number;
  employee_id: number;
  created_at: string;
  modified_at: string;
  nfe_number: string | null;
  hsconsumptionProducts: {
    id: number;
    consumption_id: number;
    employee_id: number;
    branch_id: number;
    product_code: number;
    auxiliary_code: string;
    quantity: number;
    group_id: number;
    created_at: string;
    modified_at: string;
    description: string;
    hsconsumption_groups: {
      id: number;
      description: string;
      created_at: string;
      modified_at: string;
    };
  }[];
};

export default function ConsumptionNotes() {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { alertData, hideAlert, showAlert, visible } = useAlert();
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [edit, setEdit] = useState(false);
  const [nfeNumber, setNfeNumber] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [consumptionNoteId, setConsumptionNoteId] = useState<Number>();

  const [consumptionNotes, setconsumptionNotes] = useState<consumptionNotes[]>([]);
  const setconsumptionProducts = consumptionProductsStore((state) => state.setProductsList);

  const getConsumptionNotes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      setIsLoading(true);

      const response = await fetch(`${url}/consumption-notes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setconsumptionNotes(responseData);
      } else if (response.status === 404) {
        setNoData(true);
      } else {
        showAlert({
          title: "Erro!",
          text: responseData.message,
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons,
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possível conectar ao servidor: ${error}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsumptionNote = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/consumption-notes/${consumptionNoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nfe_number: nfeNumber }),
      });

      const responseData = await response.json();

      if (response.ok) {
        getConsumptionNotes();
      } else if (response.status === 404) {
      } else {
      }
    } catch (error: any) {}
  };

  useEffect(() => {
    getConsumptionNotes();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={60} color={theme.iconColor} />
      </View>
    );
  }

  if (noData) {
    return <NoData />;
  }

  return (
    <Screen>
      <View className="flex-1">
        <FlatList
          data={consumptionNotes}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              className="border-b border-gray-300 py-2 flex-row justify-between items-center"
              onPress={() => {
                if (edit) {
                  setConsumptionNoteId(item.id);
                  setNfeNumber(item.nfe_number);
                  setEditModal(true);
                } else {
                  (setconsumptionProducts(item.hsconsumptionProducts),
                    router.push({ pathname: "./consumptionNotesProducts" }));
                }
              }}
            >
              <View>
                <RowItem label={"# "} value={item.id} />
                <RowItem label={"Filial: "} value={item.hsconsumptionProducts[0].branch_id} />
                <RowItem label={"Grupo: "} value={item.hsconsumptionProducts[0].group_id} />
                <RowItem label={"Nota Fiscal: "} value={item.nfe_number ? item.nfe_number : "N/A"} />
                <RowItem label={"Criado em: "} value={new Date(item.created_at).toLocaleDateString("pt-BR")} />
              </View>
              {edit ? (
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="pencil-outline" color={"black"} size={30} />
                </View>
              ) : (
                <View style={styles.iconBox}>
                  <Octicons name="chevron-right" size={30} />
                </View>
              )}
            </TouchableOpacity>
          )}
        />
        <PermissionWrapper requiredPermissions={[36]}>
          <View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "black" }]}
              onPress={() => {
                setEdit(!edit);
              }}
            >
              <MaterialCommunityIcons name="pencil-outline" size={30} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </PermissionWrapper>
      </View>

      <Modal
        visible={editModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setNfeNumber("");
          setEditModal(false);
        }}
      >
        <View className="flex-1 items-center justify-center px-10 bg-[rgba(0,0,0,0.53)]">
          <View className="w-full px-4 py-5 bg-white-500 rounded-xl gap-8 ">
            <View>
              <Input
                label="Nota fiscal:"
                placeholder="0"
                keyboardType="numeric"
                value={nfeNumber}
                onChangeText={setNfeNumber}
              />
            </View>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Button
                  text="Cancelar"
                  type={2}
                  onPress={() => {
                    setEditModal(false);
                    setNfeNumber("");
                  }}
                />
              </View>
              <View className="flex-1">
                <Button
                  text="Concluir"
                  onPress={() => {
                    updateConsumptionNote();
                    setEditModal(false);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "red",
    position: "absolute",
    padding: 15,
    borderRadius: 22,
    bottom: 20,
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
});
