import { ButtonComponent } from "@/components/buttonComponent";
import { Input } from "@/components/input";
import ModalAlert from "@/components/modalAlert";
import ModalPopup from "@/components/modalPopup";
import NoData from "@/components/noData";
import { PermissionWrapper } from "@/components/permissionWrapper";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { consumptionGroupsStore } from "@/store/consumptionGroupsStore";
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function ConsumptionGroups() {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const [isLoading, setIsLoading] = useState(false);

  const consumptionGroups = consumptionGroupsStore((state) => state.consumptionGroups);
  const setConsumptionGroups = consumptionGroupsStore((state) => state.setGroupsList);
  const [newconsumptionGroupDescription, setNewconsumptionGroupDescription] = useState("");

  const [editOrCreateModal, setEditOrCreateModal] = useState(false);
  const [editOrCreateOption, setEditOrCreateOption] = useState("");

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [selectedconsumptionGroup, setSelectedconsumptionGroup] = useState<number>();
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const [noData, setNoData] = useState(false);

  const getconsumptionGroups = async () => {
    const token = await AsyncStorage.getItem("token");

    setIsLoading(true);

    try {
      const response = await fetch(`${url}/consumption-groups`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setConsumptionGroups(responseData);
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

  const createconsumptionGroups = async () => {
    if (!newconsumptionGroupDescription) {
      showAlert({
        title: "Atenção!",
        text: "Preencha todos os campos obrigatórios!",
        icon: "alert",
        color: Colors.orange,
        iconFamily: Octicons,
      });
      return;
    }

    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/consumption-groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newconsumptionGroupDescription }),
      });

      const responseData = await response.json();

      if (response.ok) {
        showAlert({
          title: "Sucesso!",
          text: "Grupo de consumo criado com sucesso!",
          icon: "check-circle-outline",
          color: "#13BE19",
          onClose: () => {
            getconsumptionGroups();
            setNewconsumptionGroupDescription("");
          },
          iconFamily: MaterialIcons,
        });
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
    }
  };

  const updateconsumptionGroups = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/consumption-groups/${selectedconsumptionGroup}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newconsumptionGroupDescription }),
      });

      const responseData = await response.json();

      if (response.ok) {
        showAlert({
          title: "Sucesso!",
          text: "Grupo de consumo editado com sucesso!",
          icon: "check-circle-outline",
          color: "#13BE19",
          onClose: () => {
            getconsumptionGroups();
            setNewconsumptionGroupDescription("");
          },
          iconFamily: MaterialIcons,
        });
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
    }
  };

  const deleteconsumptionGroups = async (id: number) => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/consumption-groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        getconsumptionGroups();
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
    }
  };

  useEffect(() => {
    getconsumptionGroups();
  }, []);

  if (noData) {
    return (
      <SafeAreaView style={[styles.container]} edges={["bottom"]}>
        <NoData />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={60} color={theme.iconColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}></View>
      <View style={styles.main}>
        <FlatList
          data={consumptionGroups}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          style={[styles.flatList, { borderColor: theme.border }]}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.dataBox}>
                <View style={styles.rowBox}>
                  <Text style={[styles.label, { color: theme.title }]}>{item.id} - </Text>
                  <Text style={[styles.text, { color: theme.title }]}>{item.description} </Text>
                </View>
                <View style={styles.rowButtonsBox}>
                  <PermissionWrapper requiredPermissions={[44]}>
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={() => {
                        setEditOrCreateOption("Edit");
                        setSelectedconsumptionGroup(item.id);
                        setNewconsumptionGroupDescription(item.description);
                        setEditOrCreateModal(true);
                      }}
                    >
                      <MaterialCommunityIcons name="pencil-outline" color={theme.iconColor} size={27} />
                    </TouchableOpacity>
                  </PermissionWrapper>

                  <PermissionWrapper requiredPermissions={[45]}>
                    <TouchableOpacity
                      style={[styles.button, { borderColor: theme.cancel }]}
                      onPress={() => {
                        setSelectedconsumptionGroup(item.id);
                        setConfirmDeleteModal(true);
                      }}
                    >
                      <Ionicons name="trash-outline" size={27} color={theme.cancel} />
                    </TouchableOpacity>
                  </PermissionWrapper>
                </View>
              </View>
            </View>
          )}
        />
        <PermissionWrapper requiredPermissions={[43]}>
          <View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.iconColor }]}
              onPress={() => {
                setEditOrCreateOption("Create");
                setEditOrCreateModal(true);
              }}
            >
              <Ionicons name="add-sharp" size={30} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </PermissionWrapper>
      </View>

      <Modal
        visible={editOrCreateModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setEditOrCreateModal(false);
          setNewconsumptionGroupDescription("");
        }}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, { backgroundColor: theme.background }]}>
            <View>
              <Input
                label="Nome do grupo"
                placeholder="Ex: Administração"
                value={newconsumptionGroupDescription}
                onChangeText={setNewconsumptionGroupDescription}
              />
            </View>
            <View style={styles.buttonsBox}>
              <ButtonComponent
                text="Concluir"
                style={{ backgroundColor: theme.button, borderRadius: 12 }}
                onPress={() => {
                  if (editOrCreateOption == "Create") {
                    createconsumptionGroups();
                    setEditOrCreateModal(false);
                  } else {
                    updateconsumptionGroups();
                    setEditOrCreateModal(false);
                  }
                }}
              />
              <ButtonComponent
                text="Cancelar"
                style={{ backgroundColor: theme.button2, borderRadius: 12 }}
                onPress={() => {
                  setEditOrCreateModal(false);
                  setNewconsumptionGroupDescription("");
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {alertData && (
        <ModalAlert
          visible={visible}
          ButtonComponentPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData.iconFamily}
          iconColor={alertData.color}
        />
      )}

      <ModalPopup
        visible={confirmDeleteModal}
        title="Aviso!"
        message="Deseja excluir esse item?"
        onRequestClose={() => {
          setConfirmDeleteModal(false);
        }}
        ButtonComponentLeft={() => {
          setConfirmDeleteModal(false);
        }}
        ButtonComponentRight={() => {
          (deleteconsumptionGroups(selectedconsumptionGroup), setConfirmDeleteModal(false));
        }}
        messageButtonRight="Excluir"
      />
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
    fontFamily: "Roboto-SemiBold",
    fontSize: 18,
  },
  text: {
    color: Colors.gray,
    fontFamily: "Roboto-Regular",
    fontSize: 18,
  },
  dataBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowBox: {
    flexDirection: "row",
  },
  flatList: {},
  button: {
    padding: 5,
  },
  rowButtonsBox: {
    flexDirection: "row",
    gap: 10,
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
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.53)",
  },
  modalBox: {
    gap: 30,
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
