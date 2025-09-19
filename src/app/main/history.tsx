import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { validitiesEmployeeStore } from "../../../store/validitiesEmployeeStore";
import { userDataStore } from "../../../store/userDataStore";
import DropDownPicker from "react-native-dropdown-picker";

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

    const [isLoading, setIsLoading] = useState(true);

    const [ordinationItems, setOrdinationItems] = useState([
        { label: "Recentes", value: "1" },
        { label: "Antigos", value: "2" }
    ])
    const [ordination, setOrdination] = useState("");
    const [open, setOpen] = React.useState(false);

    const userId = userDataStore((state) => state.userId);
    const setProducts = validitiesEmployeeStore((state) => state.setProducts);
    const [validities, setValidities] = useState<validity[]>([]);
    const [sortedValidities, setSortedValidities] = useState<validity[]>([]);

    const selectValidities = async () => {
        try {
            const response = await fetch(`http://10.101.2.7:3333/validities/employee/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const responseData = await response.json();

            if (responseData.validitiesByEmployee) {
                setValidities(responseData.validitiesByEmployee);
            } else {
                Alert.alert("Erro", responseData.mensagem);
            }
        } catch (error) {
            Alert.alert("Erro!", "Não foi possível conectar ao servidor: " + error)
        } finally {
            setIsLoading(false);
        }
    }

    const sortValidities = (option: string | null) => {

        let sorted = [...validities];

        switch (option) {
            case "1":
                sorted.sort((a, b) => b.id - a.id);
                break;
            case "2":
                sorted.sort((a, b) => a.id - b.id);
                break;
        }

        setSortedValidities(sorted);
    }

    const handleOrdinationChange = (newValue: string) => {
        setOrdination(newValue);
        sortValidities(newValue);
    };

    useEffect(() => {
        selectValidities();
    }, []);

    useEffect(() => {
        sortValidities(ordination || "1");
    }, [validities]);


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={theme.iconColor} />
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.contentBox}>
                <View style={styles.filterBox}>
                    <DropDownPicker
                        open={open}
                        value={ordination}
                        items={ordinationItems}
                        setOpen={setOpen}
                        setValue={(callback) => {
                            const newValue = callback(ordination);
                            handleOrdinationChange(newValue);
                        }}
                        setItems={setOrdinationItems}
                        placeholder="Ordenar por"
                        style={[styles.dropdownInput, { backgroundColor: theme.inputColor }]}
                        dropDownContainerStyle={[styles.optionsBox, { backgroundColor: theme.inputColor }]}
                        textStyle={[styles.optionsText, { color: theme.title }]}
                        placeholderStyle={[styles.placeholder, { color: theme.text }]}
                    />
                </View>
                <View style={styles.flatListBox}>

                    <FlatList
                        data={sortedValidities}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => { router.push("./historyProducts"); setProducts(item.hsvalidity_products); }}
                            >
                                <View style={[styles.card, { backgroundColor: theme.uiBackground }]}>
                                    <Text style={[styles.cardTitle, { color: theme.title }]}>
                                        # {item.id}
                                    </Text>
                                    <View style={styles.requestDataBox}>
                                        <View>
                                            <Text style={[styles.text, { color: theme.text }]}><Text style={[styles.label, { color: theme.title }]}>Filial:</Text> {item.branch_id}</Text>
                                            <View style={styles.dates}>
                                                <Text style={[styles.text, { color: theme.text }]}><Text style={[styles.label, { color: theme.title }]}>Dt. Criação:</Text> {new Date(item.created_at).toLocaleDateString("pt-BR")}</Text>
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
    },
    contentBox: {
        paddingHorizontal: 14,
        flex: 1,
    },
    filterBox: {
        paddingVertical: 15,
    },
    flatListBox: {
        paddingBottom: 60
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
        fontFamily: "Lexend-Regular",
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