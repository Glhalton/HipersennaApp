//Importação do react e dos componentes do react-native
import React from "react";
import { View, Text, StyleSheet, TextInput} from "react-native";
import { LargeButton } from "@/components/largeButton";
import { Input } from "@/components/input";
import { router } from "expo-router";

//Função principal que será executada no aplicativo
export default function Login() {

  //Valores Input
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  //Funcao verificar login
  const botaoPressionado = () => {
    /*if(username.trim() === "" || password.trim() === ""){
      alert("Preencha todos os campos")
    } else{
        router.push("/home")
    }*/
   router.push("/home")
  }


  return (
    <View style={styles.container}>
      <View style={styles.containerLogin}>
        <Text style={styles.textTitle}>
          Bem vindo de volta!
        </Text>

        <Input
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />

        <Input
          placeholder="Senha"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
        

        <Text style={{ color:"#205072", paddingTop: 13, paddingBottom: 25, width: 358, fontSize: 14}}>
          Esqueceu a sua senha?
        </Text>
        
        <LargeButton title="Login" onPress={botaoPressionado}/>
  
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
})
