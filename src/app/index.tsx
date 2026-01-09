import AlertModal from "@/components/UI/AlertModal";
import Button from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import { Screen } from "@/components/UI/Screen";
import UpdateModal from "@/components/UI/UpdateModal";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { useCheckAppUpdate } from "@/hooks/useCheckAppUpdate";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useState } from "react";
import { Image, StatusBar, Text, View } from "react-native";

export default function Index() {
  const appVersion = Constants.expoConfig?.version;
  const { hasUpdate } = useCheckAppUpdate();

  const { visible, alertData, hideAlert, showAlert } = useAlert();
  const { isLoading, login } = useAuth(showAlert);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  return (
    <Screen>
      <StatusBar barStyle={"dark-content"} />
      <View className="gap-5 py-20 ">
        <Image
          className="h-20 box-border w-full"
          source={require("../../assets/images/hipersenna-logo-gray.png")}
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-black-700 text-center">GHSApp</Text>
      </View>

      <View className="flex-1 w-full gap-8">
        <View className="gap-4">
          <Input
            label="Usuário"
            placeholder="Digite o seu usuário"
            value={username}
            onChangeText={(username) => setUsername(username.replace(/\s/g, ""))}
            autoCapitalize="none"
            IconRightFamily={Ionicons}
            iconRightName="person-outline"
          />

          <Input
            label="Senha"
            placeholder="Digite a sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={showPassword}
            autoCapitalize="none"
            IconRightFamily={Ionicons}
            iconRightName={showPassword ? "eye-off-outline" : "eye-outline"}
            onIconRightPress={() => setShowPassword(!showPassword)}
          />
        </View>

        <Button text="Login" onPress={() => login(username, password)} loading={isLoading} />
      </View>

      <View className="pb-5 items-center">
        <Text>{appVersion}</Text>
      </View>

      <UpdateModal visible={hasUpdate} />

      {alertData && (
        <AlertModal
          visible={visible}
          onRequestClose={hideAlert}
          ButtonComponentPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData.iconFamily}
        />
      )}
    </Screen>
  );
}
