import NoData from "@/components/noData";
import { PermissionWrapper } from "@/components/permissionWrapper";
import AlertModal from "@/components/UI/AlertModal";
import Button from "@/components/UI/Button";
import ExitModal from "@/components/UI/ExitModal";
import { Input } from "@/components/UI/Input";
import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import {
  createConsumptionGroupsService,
  deleteConsumptionGroupsService,
  getConsumptionGroupsService,
  updateConsumptionGroupsService,
} from "@/services/consumptionGroups.services";
import { consumptionGroupsStore } from "@/store/consumptionGroupsStore";
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConsumptionGroups() {
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
    try {
      setIsLoading(true);
      const data = await getConsumptionGroupsService();

      if (data.length > 0) {
        setConsumptionGroups(data);
        setNoData(false);
      } else {
        setNoData(true);
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: error.message || "Erro inesperado",
        icon: "error-outline",
        color: "red",
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createConsumptionGroups = async () => {
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
    try {
      setIsLoading(true);

      await createConsumptionGroupsService({ description: newconsumptionGroupDescription });

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
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: error.message || "Erro inesperado",
        icon: "error-outline",
        color: "red",
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsumptionGroups = async () => {
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

    try {
      setIsLoading(true);

      await updateConsumptionGroupsService({ description: newconsumptionGroupDescription }, selectedconsumptionGroup);

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
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: error.message || "Erro inesperado",
        icon: "error-outline",
        color: "red",
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConsumptionGroups = async () => {
    try {
      setIsLoading(true);

      await deleteConsumptionGroupsService(selectedconsumptionGroup);

      getconsumptionGroups();
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: error.message || "Erro inesperado",
        icon: "error-outline",
        color: "red",
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getconsumptionGroups();
  }, []);

  if (noData) {
    return <NoData />;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={60} color={"black"} />
      </View>
    );
  }

  return (
    <Screen>
      <View className="flex-1">
        <FlatList
          data={consumptionGroups}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item, index }) => (
            <View className="border-b border-gray-300 py-1 flex-row items-center justify-between">
              <Text>
                {item.id} - {item.description}
              </Text>
              <View className="flex-row gap-2">
                <PermissionWrapper requiredPermissions={[44]}>
                  <TouchableOpacity
                    className="p-1"
                    onPress={() => {
                      setEditOrCreateOption("Edit");
                      setSelectedconsumptionGroup(item.id);
                      setNewconsumptionGroupDescription(item.description);
                      setEditOrCreateModal(true);
                    }}
                  >
                    <MaterialCommunityIcons name="pencil-outline" size={24} />
                  </TouchableOpacity>
                </PermissionWrapper>

                <PermissionWrapper requiredPermissions={[45]}>
                  <TouchableOpacity
                    className="p-1"
                    onPress={() => {
                      setSelectedconsumptionGroup(item.id);
                      setConfirmDeleteModal(true);
                    }}
                  >
                    <Ionicons name="trash-outline" size={24} color={"red"} />
                  </TouchableOpacity>
                </PermissionWrapper>
              </View>
            </View>
          )}
        />
        <PermissionWrapper requiredPermissions={[43]}>
          <TouchableOpacity
            style={[styles.addButton]}
            onPress={() => {
              setEditOrCreateOption("Create");
              setEditOrCreateModal(true);
            }}
          >
            <Ionicons name="add-sharp" size={30} color={"white"} />
          </TouchableOpacity>
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
        <View className="flex-1 items-center justify-center px-10 bg-[rgba(0,0,0,0.53)]">
          <View className="w-full px-4 py-5 bg-white-500 rounded-xl gap-8 ">
            <View>
              <Input
                label="Nome do grupo"
                placeholder="Ex: Administração"
                value={newconsumptionGroupDescription}
                onChangeText={setNewconsumptionGroupDescription}
              />
            </View>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Button
                  text="Cancelar"
                  type={2}
                  onPress={() => {
                    setEditOrCreateModal(false);
                    setNewconsumptionGroupDescription("");
                  }}
                />
              </View>
              <View className="flex-1">
                <Button
                  text="Concluir"
                  onPress={() => {
                    if (editOrCreateOption == "Create") {
                      createConsumptionGroups();
                      setEditOrCreateModal(false);
                    } else {
                      updateConsumptionGroups();
                      setEditOrCreateModal(false);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {alertData && (
        <AlertModal
          visible={visible}
          ButtonComponentPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData.iconFamily}
          iconColor={alertData.color}
        />
      )}

      <ExitModal
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
          (deleteConsumptionGroups(), setConfirmDeleteModal(false));
        }}
        messageButtonRight="Excluir"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "black",
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
