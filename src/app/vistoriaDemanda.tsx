// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from "react-native";
// import { LargeButton } from "@/components/largeButton";
// import colors from "../../constants/colors";
// import { router} from "expo-router"
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Header } from "@/components/header";
// import { useUserDadosStore } from "../../store/useUserDadosStore";


// // export default function VistoriaDemanda() {

// //     const userId = useUserDadosStore((state) => state.userId);
// //     const [codFilial, setCodFilial] = useState("");
// //     const [codProd, setCodProd] = useState("");
// //     const [dataSolicitacao, setDataSolicitacao] = useState("");
// //     const [status, setStatus] = useState("");

// //     const [dados, setDados] = useState([]);



// //     const consultarSolicitacoes = async () => {
// //         try {
// //             const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/vistoria/demanda.php", {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json"
// //                 },
// //                 body: JSON.stringify({userId})
// //             });

// //             const resultado = await resposta.json();

// //             if (resultado.sucesso){
// //                 setDados(resultado.dados);
// //                 setCodFilial(resultado.codFilial);
// //                 setCodProd(resultado.codProd);
// //                 setDataSolicitacao(resultado.dataSolicitacao);
// //                 setStatus(resultado.status);
// //             } else {
// //                 Alert.alert("Erro", resultado.mensagem);
// //             }
// //         } catch (erro){
// //             Alert.alert("Erro", "Não foi possível conectar ao servidor: " + erro);
// //         }
// //     };

// //     useEffect(() => {
// //         consultarSolicitacoes();
// //     }, []);

// //     return (
// //         <SafeAreaView style={styles.container} edges={["bottom"]}>
// //             <Header
// //                 title="Demanda"
// //                 screen="/home"
// //             />
// //             <View style={styles.cardsContainer}>

// //                 <FlatList
// //                     data={dados}
// //                     keyExtractor={(_, index) => index.toString()}
// //                     contentContainerStyle={{ paddingBottom: 20 }}
// //                     renderItem={({ item, index }) => (
// //                         <View style={styles.card}>
// //                             <Text style={styles.cardTitle}>#{index + 1} - {item.nomeProduto}</Text>
// //                             <View style={styles.dadosItem}>
// //                                 <View>
// //                                     <Text><Text style={styles.label}>Filial:</Text> {item.codFilial}</Text>
// //                                     <Text><Text style={styles.label}>Código:</Text> {item.codProd}</Text>
// //                                 </View>
// //                                 <View>
// //                                     <Text><Text style={styles.label}>Validade:</Text> {new Date(item.dataVencimento).toLocaleDateString("pt-BR")}</Text>
// //                                     <Text><Text style={styles.label}>Quantidade:</Text> {item.quantidade}</Text>
// //                                 </View>
// //                             </View>


// //                             <TouchableOpacity
// //                                 style={styles.removerButton}
// //                                 onPress={() => removeritem(index)}
// //                             >
// //                                 <Text style={styles.removerText}>Remover</Text>
// //                             </TouchableOpacity>
// //                         </View>
// //                     )}
// //                 />


// //                 <View style={styles.inserirButton}>
// //                     <LargeButton
// //                         title="Salvar dados"
// //                         onPress={inserirValidade}
// //                     />
// //                 </View>
// //             </View>

// //         </SafeAreaView>
// //     )
// // }

// // const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     cardsContainer: {
//         paddingHorizontal: 14,
//         paddingTop: 20,
//         flex: 1,
//     },
//     card: {
//         backgroundColor: "white",
//         borderRadius: 12,
//         padding: 12,
//         marginBottom: 12,
//     },
//     cardTitle: {
//         fontSize: 16,
//         fontFamily: "Lexend-Bold",
//         marginBottom: 6,
//         color: colors.blue,

//     },
//     label: {
//         fontFamily: "Lexend-Regular",
//         color: colors.blue,
//     },
//     dadosItem: {
//         flexDirection: "row",
//         gap: 60,
//         marginBottom: 8,
//     },
//     removerButton: {
//         backgroundColor: "#f72929ff",
//         padding: 5,
//         borderRadius: 7,
//         alignItems: "center",
//     },
//     removerText: {
//         color: "white",
//         fontFamily: "Lexend-Bold"
//     },
//     inserirButton: {
//         justifyContent: "flex-end",
//         marginTop: 20,
//         marginBottom: 20,
//     }
// })