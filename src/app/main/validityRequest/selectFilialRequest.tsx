import { DropdownInput } from "@/components/dropdownInput";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LargeButton } from "@/components/largeButton";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";
import { requestsInsertStore } from "../../../../store/requestsInsertStore";

export default function SelectFilialRequest() {

    //Codigo da filial
    const codFilial = requestsInsertStore((state) => state.codFilial);
    const setCodFilial = requestsInsertStore((state) => state.setCodFilial);
    const codConferente = requestsInsertStore((state) => state.codConferente);
    const setCodConferente = requestsInsertStore((state) => state.setCodConferente);

    //Opções do select de filial
    const filiais = [
        { label: "1 - Matriz", value: "1" },
        { label: "2 - Faruk", value: "2" },
        { label: "3 - Carajás", value: "3" },
        { label: "4 - VS10", value: "4" },
        { label: "5 - Xinguara", value: "5" },
        { label: "6 - DP6", value: "6" },
        { label: "7 - Cidade Jardim", value: "7" },
    ];


    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <Header
                text="Seleção de Filial"
                navigationType="back"
            />
            <View style={styles.formulario}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Selecione a filial e conferente desejados:
                    </Text>
                </View>

                <View>
                    <Text style={styles.label}>
                        Filial:
                    </Text>
                    <DropdownInput
                        value={codFilial}
                        items={filiais}
                        onChange={(val) => setCodFilial(val)}
                    />
                </View>

                <View>
                    <Text style={styles.label}>
                        Conferente:
                    </Text>
                    <Input
                        placeholder="Digite o código do conferente"
                        value={codConferente || ""}
                        onChangeText={setCodConferente}
                    />
                </View>
                {codFilial && codConferente && (
                    <View style={styles.buttonContainer}>
                        <LargeButton
                            text="Continuar"
                            onPress={() => router.push("./requestForm")}
                        />
                        
                    </View>
                )}

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    formulario: {
        flex: 1,
        marginHorizontal: 14,
        paddingTop: 100,

    },
    titleContainer: {
        paddingVertical: 20,
    },
    title: {
        fontSize: 30,
        color: colors.blue,
        fontFamily: "Lexend-Regular",
        textAlign: "center",
    },
    label: {
        color: colors.blue,
        marginBottom: 4,
        fontFamily: "Lexend-Bold",
    },
    buttonContainer: {

    }
})