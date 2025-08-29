import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { DropdownInput } from "@/components/dropdownInput";
import { DateInput } from "@/components/dateInput";
import { Input } from "@/components/input";
import colors from "../../../../constants/colors";
import { DataTable } from "react-native-paper";
import { LargeButton } from "@/components/largeButton";

export default function ValidityReport() {

    interface DadoRelatorio {
        cod_produto: string;
        data_validade: string;
        cod_filial: string;
        tratativa_id: string;
        status_id: string;
    }

    const [codFilial, setCodFilial] = useState("");;

    const [codProd, setCodProd] = useState("");
    const [produto, setProduto] = useState<{ descricao: string } | null>(null);

    const [timer, setTimer] = useState<number | null>(null);


    const [filtroData, setFiltroData] = useState("");
    const [quantDias, setQuantDias] = useState("");
    const [dataInicial, setDataInicial] = useState<Date | undefined>(undefined);
    const [dataFinal, setDataFinal] = useState<Date | undefined>(undefined);
    const [dados, setDados] = useState<DadoRelatorio[]>([]);

    const filialItems = [
        { label: "Matriz", value: "1" },
        { label: "Faruk", value: "2" },
        { label: "Carajás", value: "3" },
        { label: "VS10", value: "4" },
        { label: "Xinguara", value: "5" },
        { label: "Cidade Jardim", value: "7" },
    ];

    const filtroDataItems = [
        { label: "Intervalo de data", value: "1" },
        { label: "Quant. dias para vencer", value: "2" }
    ]


    const buscarDados = async () => {
        try {
            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/relatorios/relatorioVencimento.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codFilial,
                    codProd,
                    quantDias,
                    dataInicial: dataInicial ? dataInicial.toISOString().split("T")[0] : "",
                    dataFinal: dataFinal ? dataFinal.toISOString().split("T")[0] : ""
                })
            });

            //const texto = await resposta.text();
            //console.log("RESPOSTA BRUTA DA API:", texto);

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                setDados(resultado.dados);
            } else {
                Alert.alert("Erro", resultado.mensagem);
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possível conectar ao servidor " + erro);

        }
    };


    useEffect(() => {
        if (codProd.trim() === "") {
            setProduto(null);
            return;
        }


        if (timer) clearTimeout(timer);

        const newTimer = setTimeout(() => {
            buscarProduto();
        }, 500);

        setTimer(newTimer);
    }, [codProd]);

    const buscarProduto = async () => {
        try {
            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/consultarProduto.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ codProd })
            });

            //const texto = await resposta.text();
            //console.log("RESPOSTA BRUTA DA API:", texto);

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                setProduto(resultado.produto);
            } else {
                setProduto(resultado.mensagem);
            }
        } catch (erro) {
            Alert.alert("Erro", "Não foi possível buscar o produto." + erro);
        }
    };

    return (
        <View style={styles.container}>



            <View style={styles.form}>
                <View>
                    <Text style={styles.label}>
                        Filial*
                    </Text>
                    <DropdownInput
                        value={codFilial}
                        items={filialItems}
                        onChange={(val) => setCodFilial(val)}
                    />
                </View>
                <View>
                    <Text style={styles.label}>
                        Código do produto *
                    </Text>
                    <View style={styles.produtoContainer}>
                        <View style={styles.codigoProdutoInput}>
                            <Input
                                placeholder="Produto"
                                keyboardType="numeric"
                                value={codProd}
                                onChangeText={setCodProd}
                            />
                        </View>
                        <View style={styles.nomeProdutoContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>


                                <Text style={styles.nomeProduto}>
                                    {produto?.descricao || "Produto não encontrado"}
                                </Text>
                            </ScrollView>
                        </View>

                    </View>
                </View>
                <View>
                    <Text style={styles.label}>
                        Buscar dados por*
                    </Text>
                    <DropdownInput
                        value={filtroData}
                        items={filtroDataItems}
                        onChange={(val) => setFiltroData(val)}
                    />
                </View>


                {filtroData == "1" && (
                    <View style={styles.intervaloDatas}>
                        <View style={styles.dataInicial}>
                            <Text style={styles.label}>
                                Data Inicial*
                            </Text>
                            <DateInput
                                label="Selecione a data inicial"
                                value={dataInicial}
                                onChange={setDataInicial}
                            />
                        </View>
                        <View style={styles.dataFinal}>
                            <Text style={styles.label}>
                                Data Final*
                            </Text>
                            <DateInput
                                label="Selecione a data final"
                                value={dataFinal}
                                onChange={setDataFinal}
                            />
                        </View>




                    </View>
                )}

                {filtroData == "2" && (
                    <View>
                        <Text style={styles.label}>
                            Quantidade de Dias para vencer
                        </Text>
                        <Input
                            placeholder="Digite a quantidade de dias"
                            keyboardType="numeric"
                            value={quantDias}
                            onChangeText={setQuantDias}
                        />
                    </View>
                )}
                <View style={styles.button}>

                    <LargeButton
                        title="Buscar"
                        onPress={buscarDados}
                    />

                </View>


            </View>
            <View style={styles.tableContainer}>
                <ScrollView horizontal>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={styles.cell}>Codigo</DataTable.Title>   
                            <DataTable.Title style={styles.cell}>Data de Validade</DataTable.Title>
                            <DataTable.Title style={styles.cell}>Filial</DataTable.Title>
                            <DataTable.Title style={styles.cell}>Tratativa</DataTable.Title>
                            <DataTable.Title style={styles.cell}>Status</DataTable.Title>
                        </DataTable.Header>

                        {dados.map((item, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.cell}>{item.cod_produto}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>{item.data_validade}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>{item.cod_filial}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>{item.tratativa_id}</DataTable.Cell>
                                <DataTable.Cell style={styles.cell}>{item.status_id}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",

    },
    scrollContainer: {
        color: colors.blue,
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 40,
    },
    form: {
        paddingTop: 30,
        paddingHorizontal: 14,
    },
    label: {
        color: colors.blue,
        marginBottom: 4,
        fontWeight: "bold"
    },
    produtoContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    codigoProdutoInput: {
        width: "30%"
    },
    nomeProdutoContainer: {
        backgroundColor: "#b7def0ff",
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        width: "65%"
    },
    nomeProduto: {
        fontSize: 15,
        color: colors.blue,
        fontWeight: "bold"
    },
    intervaloDatas: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    dataInicial: {
        width: "45%",
    },
    dataFinal: {
        width: "45%",
    },
    button: {
        marginVertical: 20,
    },
    tableContainer: {
        paddingHorizontal: 14,

    },
    cell: {
        paddingHorizontal: 10,
        minWidth: 120, //
        justifyContent: "center",
    }

})  