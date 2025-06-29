import React from "react";

import { View, Text, TouchableOpacity, StyleSheet, Button, Platform } from "react-native";
import { TopBar } from "@/components/topBar";
import { Input } from "@/components/input";

import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function VistoriaFormulario(){

    const [codProd, setCodProd] = React.useState('');

    const[open, setOpen] = React.useState(false);
    const[tipoInsercao, setTipoInsercao] = React.useState(null);
    const [tiposInsecao, setTiposInsercao] = React.useState([
        {label: 'Tipo1', value: 'tipo1'},
        {label: 'Tipo2', value: 'tipo2'},
        {label: 'Tipo3', value: 'tipo3'}
    ]);
    
    const[date, setDate] = React.useState(new Date());
    const[show, setShow] = React.useState(false);

    
    const onChange = (event: any, selectedDate: any) => {
        setShow(false);
        if (selectedDate) setDate(selectedDate);
    };

    const [codBonus, setCodBonus] = React.useState('');
    const [dataVencimento, setDataVencimento] = React.useState('');
    const [quantidade, setQuantidade] = React.useState('');
    const [observacao, setObservacao] = React.useState('');

    const inserirPress = () => {
        
    }
    

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
 <View style={{ padding: 20 }}>
      <Button title="Selecionar data" onPress={() => setShow(true)} />
      <Text style={{ marginTop: 10 }}>
        Data selecionada: {date.toLocaleDateString()}
      </Text>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )}
    </View>

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
                <TouchableOpacity style={styles.buttonResumo} activeOpacity={0.5}>
                    <Text style={styles.textButton}>
                        Resumo
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonInserir} activeOpacity={0.5} onPress={inserirPress}>
                    <Text style={styles.textButton}>
                        Inserir
                    </Text>
                </TouchableOpacity>
                
            </View>
            
            
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

        
    }
    
})