import { DateInput } from "@/components/dateInput";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";
import { DropdownInput } from "@/components/dropdownInput";

export default function VistoriaFormulario() {
    //Id do usuario
    const [userId, setUserId] = useState<string | null>(null);

    //Codigo da filial
    const [codFilial, setCodFilial] = React.useState<string | null>(null);;

    const filiais = [
        {label: "Matriz", value: "1"},
        {label: "Faruk", value: "2"},
        {label: "Carajás", value: "3"},
        {label: "VS10", value: "4"},
        {label: "Xinguara", value: "5"},
        {label: "Cidade Jardim", value: "7"},
    ];

    //Codigo do produto
    const [codProd, setCodProd] = React.useState("");

    //Data de Vencimento
    const [dataVencimento, setDataVencimento] = useState<Date | undefined>(undefined);

    //Quantidade
    const [quantidade, setQuantidade] = React.useState("");

    //Texto de observacao
    const [observacao, setObservacao] = React.useState("");


    const resumoPress = () => {
        console.log(dataVencimento);
    }

    const pegarUserId = async () => {
        try {
            const id = await AsyncStorage.getItem("@user_id");
            if (id !== null) {
                setUserId(id);
            }
        } catch (e) {
            console.error("Erro ao recuperar userId", e);
        }
        return null;
    }

    useEffect(() => {
        pegarUserId();
    }, []);


    const inserirValidade = async () => {
        try {

            if (!dataVencimento || isNaN(dataVencimento.getTime())) {
                Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
                return;
            }

            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/insercao.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codFilial,
                    codProd,
                    dataVencimento,
                    quantidade,
                    observacao,
                    userId
                })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                Alert.alert("Sucesso", resultado.mensagem);
                router.push("/home")
            } else {
                Alert.alert("Erro", resultado.mensagem)
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possivel conectar ao sevidor: " + erro);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.form}>
                <View>
                    <Text style={styles.label}>
                        Filial *
                    </Text>
                    <DropdownInput
                        label="Escolha uma opção"
                        value={codFilial}
                        items={filiais}
                        onChange={(val) => setCodFilial(val)}
                    
                    />

                </View>

                <View>
                    <Text style={styles.label}>
                        Código do produto *
                    </Text>
                    <Input
                        placeholder="Digite o código do produto"
                        keyboardType="numeric"
                        value={codProd}
                        onChangeText={setCodProd}
                    />
                </View>

                <View>
                    <Text style={styles.label}>
                        Data de Validade *
                    </Text>
                    <DateInput
                        label="Data de Vencimento"
                        value={dataVencimento}
                        onChange={setDataVencimento}
                    />
                </View>

                <View>
                    <Text style={styles.label}>
                        Quantidade *
                    </Text>
                    <Input
                        placeholder="Insira a quantidade"
                        keyboardType="numeric"
                        value={quantidade}
                        onChangeText={setQuantidade}
                    />
                </View>

                <View>
                    <Text style={styles.label}>
                        Observação
                    </Text>
                    <Input
                        placeholder="Digite a sua observação"
                        value={observacao}
                        onChangeText={setObservacao}
                    />
                </View>

                <View style={styles.containerBotoes}>
                    <TouchableOpacity style={styles.buttonResumo} activeOpacity={0.5} onPress={resumoPress}>
                        <Text style={styles.textButton}>
                            Resumo
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonInserir} activeOpacity={0.5} onPress={inserirValidade}>
                        <Text style={styles.textButton}>
                            Inserir
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    form: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 14,
    },
    label: {
        color: colors.blue,
        marginBottom: 4,
        fontWeight: "bold"
    },
    containerBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    textButton: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",

    },
    buttonResumo: {
        backgroundColor: "#4A5A6A",
        height: 48,
        width: "45%",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",

    },
    buttonInserir: {
        backgroundColor: "#DA0100",
        height: 48,
        width: "45%",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",

    },

});