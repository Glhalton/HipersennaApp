import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/colors";
import { validitiesEmployeeStore } from "../../../store/validitiesEmployeeStore";
import { userDataStore } from "../../../store/userDataStore";

export default function History() {

    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

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

    const userId = userDataStore((state) => state.userId);
    const [validities, setValidities] = useState<validity[]>([]);
    const setProducts = validitiesEmployeeStore((state) => state.setProducts);

    const selectValidities = async () => {
        try {
            const response = await fetch(`http://10.101.2.7:3333/validities/employee/${userId}` , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const responseData = await response.json();

            if (responseData.validitiesByEmployee) {
                setValidities(responseData.validitiesByEmployee);
            } else{
                Alert.alert("Erro", responseData.mensagem);
            }
        } catch (error) {
            Alert.alert("Erro!", "Não foi possível conectar ao servidor: " + error)
        }
    }

    useEffect(() => {
        selectValidities();
    }, []);


    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.contentBox}>
                <View style={styles.filterBox}>
                    <Text style={styles.filterText}>
                        Ordernar Por:
                    </Text>
                </View>
                <View style={styles.flatListBox}>

                    <FlatList
                        data={validities}
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
                                            {/* <Text style={styles.label}>HortiFruti | Frios</Text> */}
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
        backgroundColor: Colors.gray,
        height: 30,
        width: 140,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 15,
    },
    filterText: {
        fontFamily: "Lexend-Regular",
        color: "white"
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

})