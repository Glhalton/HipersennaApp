//Importação do react e dos componentes do react-native
import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable} from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

//Função principal que será executada no aplicativo
export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  
  const botaoPressionado = () => {navigation.navigate('HomeScreen')}


  return (
    <View style={styles.container}>
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
      
      <Pressable
        style={styles.button}
        onPress={botaoPressionado}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      
    </View>
  )
}

//Estilizaçoes utilizadas dentro da função principal:
const styles = StyleSheet.create({
  textTitle:{
    color: "#205072",
    fontSize: 28,
    fontWeight: 'bold'
  },
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
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
    fontWeight: 700,    
  }
})
