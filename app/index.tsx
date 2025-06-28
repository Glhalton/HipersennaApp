//Importação do react e dos componentes do react-native
import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable} from "react-native";
import { router } from "expo-router";

//Função principal que será executada no aplicativo
export default function Login() {

  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  
  //Funcao verificar login
  const botaoPressionado = () => {

    router.push("/home")
  }


  return (
    <View style={styles.container}>
      <View style={styles.containerLogin}>
        <Text style={styles.textTitle}>
          Bem vindo de volta!
        </Text>

        <TextInput 
          style={styles.input}
          placeholder="Nome de usuario"
          onChangeText={onChangeUsername}
          value={username}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          onChangeText={onChangePassword}
          value={password}
          secureTextEntry={true}
        />

        <Text style={{ color:"#205072", paddingTop: 13, paddingBottom: 25, width: 358, fontSize: 14}}>
          Esqueceu a sua senha?
        </Text>
        
        <Pressable onPress={botaoPressionado} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
  
      </View>
    </View>
  )
}

//Estilizaçoes utilizadas dentro da função principal:
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    backgroundColor: 'white',
    fontFamily: "Lexend"
  },
  containerLogin:{
    marginTop: 80,
    alignItems: 'center',
  },
  textTitle:{
    color: "#205072",
    fontSize: 28,
    fontWeight: 'bold'
  },
  input:{
    backgroundColor: "#F4F6F8",
    height: 56,
    minWidth: 358,
    maxWidth: 400,
    margin: 12,
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button:{
    height: 48,
    width: 358,
    backgroundColor: "#DA0100",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText:{
    color: "white",
    fontSize: 16,
    fontWeight: "700",    
  }
})
