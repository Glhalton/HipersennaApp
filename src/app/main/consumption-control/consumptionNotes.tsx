import { ButtonComponent } from "@/components/buttonComponent";
import { Input } from "@/components/input";
import NoData from "@/components/noData";
import { PermissionWrapper } from "@/components/permissionWrapper";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { consumptionProductsStore } from "@/store/consumptionProductsStore";
import { MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    return (
      <SafeAreaView style={[styles.container]} edges={["bottom"]}>
        <NoData />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}></View>
      <View style={styles.main}>
        <FlatList
          data={consumptionNotes}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 90 }}
          style={[styles.flatList, { borderColor: theme.border }]}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.card}
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
              <View style={styles.requestDataBox}>
                <View>
                  <Text style={[styles.cardTitle, { color: theme.title }]}># {item.id}</Text>
                  <View style={styles.rowBox}>
                    <Text style={[styles.label, { color: theme.title }]}>Filial: </Text>
                    <Text style={[styles.text, { color: theme.text }]}>{item.hsconsumptionProducts[0].branch_id}</Text>
                    <Text style={[styles.text, { color: theme.text }]}> | </Text>
                    <Text style={[styles.label, { color: theme.title }]}>Grupo: </Text>
                    <Text style={[styles.text, { color: theme.text }]}>{item.hsconsumptionProducts[0].group_id}</Text>
                  </View>
                  <View style={styles.rowBox}>
                    <Text style={[styles.label, { color: theme.title }]}>Nota Fiscal: </Text>
                    <Text style={[styles.text, { color: theme.text }]}>
                      {item.nfe_number ? item.nfe_number : "N/A"}
                    </Text>
                  </View>
                  <View style={styles.rowBox}>
                    <Text style={[styles.label, { color: theme.title }]}>Criado em: </Text>
                    <Text style={[styles.text, { color: theme.text }]}>
                      {new Date(item.created_at).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                </View>
                {edit ? (
                  <View style={styles.iconBox}>
                    <MaterialCommunityIcons name="pencil-outline" color={theme.iconColor} size={30} />
                  </View>
                ) : (
                  <View style={styles.iconBox}>
                    <Octicons name="chevron-right" size={40} color={theme.iconColor} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
        <PermissionWrapper requiredPermissions={[36]}>
          <View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.iconColor }]}
              onPress={() => {
                setEdit(!edit);
              }}
            >
              <MaterialCommunityIcons name="pencil-outline" size={40} color={Colors.white} />
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
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, { backgroundColor: theme.background }]}>
            <View>
              <Input
                label="Número da nota fiscal:"
                placeholder="Nota fiscal"
                keyboardType="numeric"
                value={nfeNumber}
                onChangeText={setNfeNumber}
              />
            </View>
            <View style={styles.buttonsBox}>
              <ButtonComponent
                text="Concluir"
                style={{ backgroundColor: theme.button, borderRadius: 12 }}
                onPress={() => {
                  updateConsumptionNote();
                  setEditModal(false);
                }}
              />
              <ButtonComponent
                text="Cancelar"
                style={{ backgroundColor: theme.button2, borderRadius: 12 }}
                onPress={() => {
                  setEditModal(false);
                  setNfeNumber("");
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {},
  main: {
    flex: 1,
  },
  flatList: {},
  card: {
    borderBottomWidth: 0.5,
    paddingVertical: 8,
    borderColor: Colors.gray,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
  label: {
    fontFamily: "Roboto-Regular",
  },
  text: {
    color: Colors.gray,
    fontFamily: "Roboto-SemiBold",
  },
  requestDataBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dates: {},
  iconBox: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBox: {
    flexDirection: "row",
  },
  addButton: {
    backgroundColor: "red",
    position: "absolute",
    padding: 10,
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
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.53)",
  },
  modalBox: {
    gap: 20,
    maxHeight: 600,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  buttonsBox: {
    gap: 10,
  },
});
