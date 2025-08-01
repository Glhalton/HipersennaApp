import { SmallButton } from "@/components/smallButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { Suspense, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View, } from "react-native";

export default function Home(){
    const [userId, setUserId] = useState<string | null>(null);

    const [count, setCount] = useState(0);

    const botaoAddPress = () => {
        router.push("/vistoriaFormulario");
    }

    const botaoHistoricPress = () => {
        router.push("/historico");
    }

    const pegarUserId = async () => {
        try{
            const id = await AsyncStorage.getItem("@user_id");
            if(id !==null){
                setUserId(id);
            }
        } catch (e){
            console.error("Erro ao recuperar userId", e);
            Alert.alert("Erro ao recuperar userId");
        }
        return null;
    }

    useEffect(() => {
        pegarUserId();
    }, []);


    useEffect(() => {
        const fetchCount = async () => {
            try {
                const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/home/dadosUsuario.php",{
                    method : "POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId
                    })
                });

                const resultado = await resposta.json();

                if(resultado.sucesso){
                    setCount(resultado.quantidade_vistorias);
                }
            
            } catch (error){
                console.error("Erro ao buscar contagem: ", error);
            }
        };

        fetchCount();

        const interval = setInterval(fetchCount, 10000);

        return () => clearInterval(interval);
    
    }, [userId]);
    

    return(

       
            <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerText}>Validade</Text>
                <Image style={styles.engrenagemImg} source={require("../../assets/images/Engrenagem.png")}/>
            </View>

            <View style={styles.containerBemVindo}>
                <Text style={styles.tituloBemVindo}>
                    <Suspense fallback="Loading">
                        Bem vindo de volta, ID: {userId}
                    </Suspense>
                    
                    
                </Text>
                <View style={styles.containerbuttons}>
                    <SmallButton title="Histórico" onPress={botaoHistoricPress}/>
                    <SmallButton title="Add" onPress={botaoAddPress}/>                    
                </View>
            </View>

            <View style={styles.containerDashboard}>
                <Text style={styles.titulo}>
                    Dashboard
                </Text>
                <View style={styles.dashboardRowItens}>
                    <View style={styles.dashboardItem}>
                        <Text style={styles.dashboardItemText}>Total de {"\n"}vistorias: </Text>
                        <Suspense fallback="Loading">
                            <Text style={styles.dashboardItemValue}>{count}</Text>
                        </Suspense>
                        
                    </View>
                    <View style={styles.dashboardItem}>
                        <Text style={styles.dashboardItemText}>Vencerão em {"\n"}breve</Text>
                        <Text style={styles.dashboardItemValue}>
                            2
                        </Text>
                    </View>
                </View>
                <View style={styles.dashboardLargeItem}>
                    <Text style={styles.dashboardItemText}>Vencidos </Text>
                    <Text style={styles.dashboardItemValue}>1</Text>
                </View>
            </View>
            <View style={styles.containerAcessoRapido}>
                <Text>
                    Acesso rápido
                </Text>
            </View>
            
        </View>

        
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "flex-start",
        backgroundColor: "white",
        color:"#205072",
    },
    header:{
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 50,
    },
    headerText:{
        fontSize: 18,
        fontWeight: "bold",
        color: "#205072",
        paddingLeft: 30
    },
    engrenagemImg:{
        marginRight:30,
    },
    containerBemVindo:{
        width: "100%"
    },
    tituloBemVindo:{
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        paddingBottom: 20,
        paddingTop: 20,
        color:"#205072",
    },
    containerbuttons:{
        flexDirection: "row", 
        justifyContent:"space-around", 
        width: "100%",
    },
    containerDashboard:{
        width: "100%",
    },
    dashboardRowItens:{
        flexDirection: "row",
        justifyContent: "space-around"
    },
    dashboardItem:{
        backgroundColor:"#F4F6F8",
        height: 134,
        width: 171,
        borderRadius: 12,
        justifyContent: "center",
    },
    dashboardItemText:{
        fontSize: 16,
        color: "#205072",
        paddingLeft: 20,
        
    },
    dashboardItemValue:{
        fontSize: 24,
        fontWeight: "bold",
        color: "#205072",
        paddingLeft: 20,
    },
    dashboardLargeItem:{
        backgroundColor:"#F4F6F8",
        height: 134,
        width: 374,
        borderRadius: 12,
        justifyContent: "center",
        marginTop: 20,
        marginLeft: 20,

    },
    containerAcessoRapido:{

    },

    titulo:{
        fontSize: 22,
        fontWeight: "bold",
        color: "#205072",
        padding: 30
    }
})