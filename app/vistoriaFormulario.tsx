import React, {useState} from "react";

import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { TopBar } from "@/components/topBar";
import { Input } from "@/components/input";
import { DateInput } from "@/components/dateInput";

import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";

export default function VistoriaFormulario(){

    //Codigo do produto
    const [codProd, setCodProd] = React.useState('');

    //Tipo de insercao.
    const[tipoInsercao, setTipoInsercao] = React.useState(null);

    const[open, setOpen] = React.useState(false);
    const [tiposInsecao, setTiposInsercao] = React.useState([
        {label: 'Tipo1', value: 'tipo1'},
        {label: 'Tipo2', value: 'tipo2'},
        {label: 'Tipo3', value: 'tipo3'}
    ]);

    //Data de Vencimento
    const [dataVencimento, setDataVencimento] = useState(new Date());
    
    //Codigo do Bonus
    const [codBonus, setCodBonus] = React.useState('');

    //Quantidade
    const [quantidade, setQuantidade] = React.useState('');

    //Texto de observacao
    const [observacao, setObservacao] = React.useState('');

    const historicoPress = () => {
        console.log(dataVencimento);
    }

    const inserirValidade = async () => {
        try {
            const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/validade/insercao.php",{
                method : "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codProd,
                    tipoInsercao, 
                    dataVencimento, 
                    codBonus,
                    quantidade,
                    observacao
                })
            });

            const resultado = await resposta.json();

            if(resultado.sucesso){
                Alert.alert("Sucesso", resultado.mensagem);
                router.push("/")
            } else {
                Alert.alert("Erro", resultado.mensagem)
            }
        } catch(erro){
            Alert.alert("Erro", "Não foi possivel conectar ao sevidor")
        }
    };

    return(
        <View style={styles.container}>

            <TopBar text="Vistoria"/> 

            <Text style={styles.text}>
                Código do produto
            </Text>
            <Input
                placeholder="Código"
                keyboardType="numeric"
                value={codProd}
                onChangeText={setCodProd}
            />

            <Text style={styles.text}>
                Tipo de inserção
            </Text>
            <DropDownPicker
                open={open}
                value={tipoInsercao}
                items={tiposInsecao}
                setOpen={setOpen}
                setValue={setTipoInsercao}
                setItems={setTiposInsercao}
                placeholder="Selecione o tipo de inserção"
                style={styles.dropdownInsercao}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={{
                    fontSize: 16,
                }}
                placeholderStyle={{
                    opacity: 0.6
                }}
            />


            <Text style={styles.text}>
                Bônus
            </Text>
            <Input 
                placeholder="Selecionar o bônus" 
                keyboardType="numeric"
                value={codBonus}
                onChangeText={setCodBonus}
            />

            <Text style={styles.text}>
                Vencimento
            </Text>
           
            <DateInput
                label = "Data de Vencimento"
                value={dataVencimento}
                onChange={(novaData) => setDataVencimento(novaData)}
            />


            <Text style={styles.text}>
                Quantidade
            </Text>
            <Input 
                placeholder="Insira a quant."
                keyboardType="numeric"
                value={quantidade}
                onChangeText={setQuantidade}
            />

            <Text style={styles.text}>
                Observação
            </Text>
            <Input 
                placeholder="Digite a sua obs."
                value={observacao}
                onChangeText={setObservacao}
            />
            
            <View style={styles.containerBotoes}>
                <TouchableOpacity style={styles.buttonResumo} activeOpacity={0.5} onPress={historicoPress}>
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
            <Text>
                
            </Text>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    text:{
        color: "#205072",
        fontSize: 16,
        paddingLeft: 20,
        fontWeight: "bold"
    },
    containerBotoes:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around"
    
    },
    buttonResumo:{
       backgroundColor: "#4A5A6A",
       height: 48,
       width: 160,
       borderRadius: 8,
       justifyContent: "center",
       alignItems: "center",
       
    },
    buttonInserir:{
       backgroundColor: "#DA0100",
       height: 48,
       width: 160,
       borderRadius: 8,
       justifyContent: "center",
       alignItems: "center",
       
    },
    textButton:{
        fontSize: 16,
        color: "white",
        fontWeight: "bold",

    },
    dropdownInsercao:{
        borderWidth: 0,
        backgroundColor: "#F4F6F8",
        height: 56,
        width: 386,
        margin: 12,
    },
    dropdownContainer:{
        backgroundColor: "#F4F6F8",
        width: 386,
        margin: 12,
        borderColor: "gray"
    },

    label: {
        fontSize: 16,
        marginBottom: 8 
    },
    
})