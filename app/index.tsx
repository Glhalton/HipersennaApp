//Importação do react e dos componentes do react-native
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

//Função principal que será executada no aplicativo
export default function LoginScreen() {
  const [text, onChangeText] = React.useState('');


  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Olá mundo!
      </Text>
      <TextInput 
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Insira seu nome"
        clearTextOnFocus={false}
        autoFocus={false}
      />

   
    </View>
  )
}

//Estilizaçoes utilizadas dentro da função principal:
const styles = StyleSheet.create({
  text:{
    fontSize: 24,
    fontWeight: 'bold'
  },

  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'whitet'
  },
  input:{
    height: 40,
    minWidth: 300,
    maxWidth: 400,
    margin: 12,
    borderWidth: 1,
    padding: 10
  }
})
