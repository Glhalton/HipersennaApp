//Importação do react e dos componentes do react-native
import React from "react";
import { View, Text, StyleSheet, Alert, Pressable,} from "react-native";
import { LargeButton } from "@/components/largeButton";
import { Input } from "@/components/input";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';


//Função principal que será executada no aplicativo
export default function Login() {

  //Valores Input Login
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  //Funcao verificar login
  const fazerLogin = async () => {
      try {
          const resposta = await fetch("http://10.101.2.7/ApiHipersennaApp/autenticacao/login.php",{
              method : "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({username, password})
          });
          
          const resultado = await resposta.json();

          if (resultado.sucesso){

            await AsyncStorage.setItem('@user_id', resultado.userId.toString());
            
            router.push("/home")
          } else{
            Alert.alert("Erro", resultado.mensagem);
          }
      } catch (erro){
          Alert.alert("Erro", "Não foi possível conectar ao servidor")
      }
  };

  const botaoCadastro = () => {
    router.push("/createProfile")
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
        

        <Text style={{ color:"#205072", paddingTop: 13, paddingBottom: 25, width: 358, fontSize: 14 }}>
          Esqueceu a sua senha?
        </Text>
        
        <LargeButton title="Login" onPress={fazerLogin}/>

      </View>

      <View style={styles.containerCadastro}>
        <Pressable style={styles.botaoCadastro} onPress={botaoCadastro} >
          <Text style={styles.textoCadastro}>
            Não tem uma conta? Cadastre-se
          </Text>
        </Pressable>
      </View>

    </View>
  )
}


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
    fontWeight: 'bold',
  },
  containerCadastro:{
    flex: 1,
    justifyContent:"flex-end",
  },
  botaoCadastro:{
    padding: 20, 
    width: 358, 
    alignItems: "center",
    marginBottom: 20,
  },
  textoCadastro:{
    color:"#205072", 
    fontSize: 14 
  }
})
