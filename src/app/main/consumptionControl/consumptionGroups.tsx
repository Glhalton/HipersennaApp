import { ButtonComponent } from "@/components/buttonComponent";
import { Input } from "@/components/input";
import ModalAlert from "@/components/modalAlert";
import ModalPopup from "@/components/modalPopup";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
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

type ConsumerGroup = {
  id: number;
  description: string;
  created_at: string;
  modified_at: string;
};

export default function ConsumptionGroups() {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const [isLoading, setIsLoading] = useState(false);

  const [consumerGroups, setConsumerGroups] = useState<ConsumerGroup[]>();
  const [newConsumerGroupDescription, setNewConsumerGroupDescription] = useState("");

  const [editOrCreateModal, setEditOrCreateModal] = useState(false);
  const [editOrCreateOption, setEditOrCreateOption] = useState("");

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [selectedConsumerGroup, setSelectedConsumerGroup] = useState<number>();
  const { alertData, hideAlert, showAlert, visible } = useAlert();

  const getConsumerGroups = async () => {
    const token = await AsyncStorage.getItem("token");

    setIsLoading(true);

    try {
      const response = await fetch(`${url}/consumer-groups`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setConsumerGroups(responseData);
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

  const createConsumerGroups = async () => {
    if (!newConsumerGroupDescription) {
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
      const response = await fetch(`${url}/consumer-groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newConsumerGroupDescription }),
      });

      const responseData = await response.json();

      if (response.ok) {
        showAlert({
          title: "Sucesso!",
          text: "Grupo de consumo criado com sucesso!",
          icon: "check-circle-outline",
          color: "#13BE19",
          onClose: () => {
            getConsumerGroups();
            setNewConsumerGroupDescription("");
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

  const updateConsumerGroups = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/consumer-groups/${selectedConsumerGroup}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newConsumerGroupDescription }),
      });

      const responseData = await response.json();

      if (response.ok) {
        showAlert({
          title: "Sucesso!",
          text: "Grupo de consumo editado com sucesso!",
          icon: "check-circle-outline",
          color: "#13BE19",
          onClose: () => {
            getConsumerGroups();
            setNewConsumerGroupDescription("");
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

  const deleteConsumerGroups = async (id: number) => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(`${url}/consumer-groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        getConsumerGroups();
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
    getConsumerGroups();
  }, []);

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
          data={consumerGroups}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          style={[styles.flatList, { borderColor: theme.border }]}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity activeOpacity={0.6} style={styles.card} onPress={() => {}}>
              <View style={styles.dataBox}>
                <View style={styles.rowBox}>
                  <Text style={[styles.label, { color: theme.title }]}>{item.id} - </Text>
                  <Text style={[styles.text, { color: theme.title }]}>{item.description} </Text>
                </View>
                <View style={styles.rowButtonsBox}>
                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => {
                      setEditOrCreateOption("Edit");
                      setSelectedConsumerGroup(item.id);
                      setNewConsumerGroupDescription(item.description);
                      setEditOrCreateModal(true);
                    }}
                  >
                    <MaterialCommunityIcons name="pencil-outline" color={theme.iconColor} size={30} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { borderColor: theme.cancel }]}
                    onPress={() => {
                      setSelectedConsumerGroup(item.id);
                      setConfirmDeleteModal(true);
                    }}
                  >
                    <Ionicons name="trash-outline" size={30} color={theme.cancel} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.iconColor }]}
            onPress={() => {
              setEditOrCreateOption("Create");
              setEditOrCreateModal(true);
            }}
          >
            <Ionicons name="add-sharp" size={40} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={editOrCreateModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setEditOrCreateModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, { backgroundColor: theme.background }]}>
            <View>
              <Input
                label="Nome do grupo:"
                placeholder="Nome"
                value={newConsumerGroupDescription}
                onChangeText={setNewConsumerGroupDescription}
              />
            </View>
            <View style={styles.buttonsBox}>
              <ButtonComponent
                text="Concluir"
                style={{ backgroundColor: theme.button, borderRadius: 12 }}
                onPress={() => {
                  if (editOrCreateOption == "Create") {
                    createConsumerGroups();
                    setEditOrCreateModal(false);
                  } else {
                    updateConsumerGroups();
                    setEditOrCreateModal(false);
                  }
                }}
              />
              <ButtonComponent
                text="Cancelar"
                style={{ backgroundColor: theme.button2, borderRadius: 12 }}
                onPress={() => {
                  setEditOrCreateModal(false);
                  setNewConsumerGroupDescription("");
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
          (deleteConsumerGroups(selectedConsumerGroup), setConfirmDeleteModal(false));
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
    paddingVertical: 10,
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
    gap: 50,
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
