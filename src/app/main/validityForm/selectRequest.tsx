import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { employeeDataStore } from "../../../../store/employeeDataStore";
import { postValidityDataStore } from "../../../../store/postValidityDataStore";
import { validityRequestDataStore } from "../../../../store/validityRequestDataStore";

type RequestDataItem = {
    id: number,
    branch_id: number,
    status: string,
    created_at: string,
    target_date: string,
    analyst_id: number,
    products: Product[]
}

type Product = {
    product_cod: number,
    description: string,
    validity_date: Date,
    quantity: string,
    status: string,
}

export default function SelectRequest() {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    const userId = employeeDataStore((state) => state.userId);
    const requests = validityRequestDataStore((state) => state.requests);
    const setValidity = postValidityDataStore((state) => state.addValidity);
    const setProductsList = postValidityDataStore((state) => state.setProductList);
    const setRequests = validityRequestDataStore((state) => state.setRequestsList);

    const [filterItems, setFilterItems] = useState([
        { label: "Novos", value: "1" },
        { label: "Antigos", value: "2" }
    ])
    const [ordination, setOrdination] = useState("");
    const [open, setOpen] = React.useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const getValidityRequests = async () => {
        try {
            const response = await fetch(`http://10.101.2.7:3333/validityRequests/employee/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const responseData = await response.json();

            if (responseData.validityRequestsByEmployee) {
                setRequests(responseData.validityRequestsByEmployee);
                console.log(responseData.validityRequestsByEmployee)
            } else {
                Alert.alert("Erro", responseData.mensagem);
            }
        } catch (error) {
            Alert.alert("Erro!", "Não foi possível conectar ao servidor: " + error)
        } finally {
            setIsLoading(false);
        }
    }

    function addValidity(branchId: string, requestId: number) {
        if (!branchId || !userId) {
            Alert.alert("Erro!", "Erro na coleta de dados!");
            return;
        }

        setValidity({
            branch_id: Number(branchId),
            employee_id: userId,
            request_id: requestId,
        })
    }

    function getColor(status: string | null) {
        if (status === "Pendente") return "#FF6200";
        if (status === "Em_andamento") return "#51ABFF";
        if (status === "Concluido") return "#13BE19";
        if (status === "Expirado") return "#E80000";
        return "black";
    }

    //Cria a validade e copia os produtos para uma lista
    const selectedRequest = (item: any) => {
        router.replace("../validityForm/validityRequestProducts");
        setProductsList(item.hsvalidity_request_products);
        addValidity(item.branch_id, item.id);
    }

    const [sortedRequests, setSortedRequests] = useState<RequestDataItem[]>([]);

    const sortRequests = (option: string | null) => {

        let sorted: RequestDataItem[] = [...requests];

        switch (option) {
            case "1":
                sorted.sort((a, b) => b.id - a.id);
                break;
            case "2":
                sorted.sort((a, b) => a.id - b.id);
                break;
        }

        setSortedRequests(sorted);
    }

    const handleOrdinationChange = (newValue: string) => {
        setOrdination(newValue);
        sortRequests(newValue);
    };

    useEffect(() => {
        getValidityRequests();
    }, []);
    useEffect(() => {
        sortRequests(ordination || "1");
    }, [requests]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator color={theme.iconColor} size={60} />
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['bottom']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.titleText, { color: theme.title }]}>
                        Selecione uma solicitação:
                    </Text>

                    <DropDownPicker
                        open={open}
                        value={ordination}
                        items={filterItems}
                        setOpen={setOpen}
                        setValue={(callback) => {
                            const newValue = callback(ordination);
                            handleOrdinationChange(newValue);
                        }}
                        setItems={setFilterItems}
                        placeholder="Ordenar por"
                        style={[styles.dropdownInput, { backgroundColor: theme.inputColor }]}
                        dropDownContainerStyle={[styles.optionsBox, { backgroundColor: theme.inputColor }]}
                        textStyle={[styles.optionsText, { color: theme.title }]}
                        placeholderStyle={[styles.placeholder, { color: theme.text }]}
                    />
                </View>

                <View style={[styles.flatListBox]}>
                    <FlatList
                        data={sortedRequests}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => { selectedRequest(item); }}
                            >
                                <View style={[styles.card, { backgroundColor: theme.uiBackground }]}>
                                    <View style={styles.requestDataBox}>
                                        <View>
                                            <Text style={[styles.cardId, { color: theme.title }]}>
                                                # {item.id}
                                            </Text>
                                            <Text style={[styles.text, { color: theme.text }]}><Text style={[styles.label, { color: theme.title }]}>Filial:</Text> {item.branch_id}</Text>
                                            <Text style={[styles.text, { color: theme.text }]}><Text style={[styles.label, { color: theme.title }]}>Dt. Criação:</Text> {new Date(item.created_at).toLocaleDateString("pt-BR")}</Text>
                                            {/* <Text style={[styles.text, { color: theme.text }]}><Text style={[styles.label, { color: theme.title }]}>Dt. Limite:</Text> {new Date(item.target_date).toLocaleDateString("pt-BR")}</Text> */}
                                            <View style={styles.statusBox}>
                                                <Text style={[styles.label, { color: theme.title }]}>
                                                    Status:
                                                </Text>
                                                <View style={[styles.dotView, { backgroundColor: getColor(item.status), }]}></View>
                                                <Text style={[styles.text, { color: getColor(item.status) }]}>
                                                    {item.status}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.iconBox}>
                                            <Octicons
                                                name="chevron-right"
                                                size={40}
                                                color={theme.iconColor}
                                            />
                                        </View>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
    },
    header: {
        paddingVertical: 15,
    },
    titleText: {
        fontFamily: "Lexend-SemiBold",
        color: Colors.blue,
        fontSize: 25,
        paddingBottom: 10,
    },
    flatListBox: {
        paddingBottom: 110,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 14,
        marginBottom: 15,
        borderColor: Colors.gray,
    },
    requestDataBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    cardId: {
        fontSize: 16,
        fontFamily: "Lexend-Bold",
        color: Colors.blue,
    },
    label: {
        fontFamily: "Lexend-Bold",
        color: Colors.blue,
    },
    text: {
        color: Colors.gray,
        fontFamily: "Lexend-Regular"
    },
    statusBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    dotView: {
        borderRadius: 50,
        width: 13,
        height: 13,
    },
    iconBox: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },

    dropdownInput: {
        minHeight: 30,
        width: 140,
        zIndex: 1,
        borderWidth: 0,
        borderRadius: 20,

    },
    optionsBox: {
        minHeight: 40,
        width: 140,
        borderColor: "gray",
        paddingLeft: 4,
        borderWidth: 0,
        borderTopWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    optionsText: {
        fontFamily: "Lexend-Regular",
    },
    placeholder: {
        fontFamily: "Lexend-Regular",

    },

})