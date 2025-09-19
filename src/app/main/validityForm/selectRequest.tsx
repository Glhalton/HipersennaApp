import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../../constants/colors";
import { userDataStore } from "../../../../store/userDataStore";
import { validityInsertStore } from "../../../../store/validityInsertStore";
import { validityRequestProductsStore } from "../../../../store/validityRequestProductsStore";
import DropDownPicker from "react-native-dropdown-picker";

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
    product_cod: string,
    description: string,
    validity_date: Date,
    quantity: string,
    status: string,
}

export default function SelectRequest() {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];


    const [items, setItems] = useState([
        { label: "Novos", value: "1" },
        { label: "Antigos", value: "2" }
    ])

    const [ordination, setOrdination] = useState("");

    const [open, setOpen] = React.useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const requests = validityRequestProductsStore((state) => state.requests);
    const setRequests = validityRequestProductsStore((state) => state.setLista);
    const userId = userDataStore((state) => state.userId);
    const setProductsList = validityInsertStore((state) => state.setProductList);
    const setValidity = validityInsertStore((state) => state.addValidity);

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
            } else {
                Alert.alert("Erro", responseData.mensagem);
            }
        } catch (error) {
            Alert.alert("Erro!", "Não foi possível conectar ao servidor: " + error)
        }
    }

    //Cria a validade
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

    //Define a cor de acordo com o status
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

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
            <View style={styles.contentBox}>
                <View style={styles.header}>
                    <View style={styles.titleBox}>
                        <Text style={[styles.titleText, { color: theme.title }]}>
                            Selecione uma solicitação:
                        </Text>
                    </View>
                    <View style={styles.filterBox}>
                        <View style={styles.filterBox}>
                            <DropDownPicker
                                open={open}
                                value={ordination}
                                items={items}
                                setOpen={setOpen}
                                setValue={(callback) => {
                                    const newValue = callback(ordination);
                                    handleOrdinationChange(newValue);
                                }}
                                setItems={setItems}
                                placeholder="Ordenar por"
                                style={[styles.dropdownInput, { backgroundColor: theme.inputColor }]}
                                dropDownContainerStyle={[styles.optionsBox, { backgroundColor: theme.inputColor }]}
                                textStyle={[styles.optionsText, { color: theme.title }]}
                                placeholderStyle={[styles.placeholder, { color: theme.text }]}
                            />
                        </View>
                    </View>
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
                                    <Text style={[styles.cardTitle, { color: theme.title }]}>
                                        #{item.id}
                                    </Text>
                                    <View style={styles.requestDataBox}>
                                        <View>
                                            <Text style={[styles.text, { color: theme.text }]}><Text style={[styles.label, { color: theme.title }]}>Filial:</Text> {item.branch_id}</Text>
                                            <View style={styles.dates}>
                                                <Text style={[styles.text, { color: theme.text }]}><Text style={[styles.label, { color: theme.title }]}>Dt. Criação:</Text> {new Date(item.created_at).toLocaleDateString("pt-BR")}</Text>
                                                {/* <Text style={[styles.text, { color: theme.text }]}><Text style={[styles.label, { color: theme.title }]}>Dt. Limite:</Text> {new Date(item.target_date).toLocaleDateString("pt-BR")}</Text> */}
                                            </View>
                                            <View style={styles.statusBox}>
                                                <Text style={[styles.label, { color: theme.title }]}>
                                                    Status:
                                                </Text>
                                                <View style={[styles.dotView, { backgroundColor: getColor(item.status),  }]}></View>
                                                <Text style={[styles.statusText, { color: getColor(item.status) }]}>
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
        backgroundColor: Colors.background
    },
    contentBox: {
        paddingHorizontal: 14,
        flex: 1,
    },
    header: {
        paddingVertical: 15,
    },
    titleBox: {
        paddingBottom: 10,
    },
    titleText: {
        fontFamily: "Lexend-SemiBold",
        color: Colors.blue,
        fontSize: 25
    },
    filterBox: {

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
    cardTitle: {
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
    requestDataBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    dates: {

    },
    statusBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    statusText: {
        fontFamily: "Lexend-Regular"
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