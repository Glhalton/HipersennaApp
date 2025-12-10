import { ButtonComponent } from "@/components/buttonComponent";
import { Input } from "@/components/input";
import ModalAlert from "@/components/modalAlert";
import { Colors } from "@/constants/colors";
import { useAlert } from "@/hooks/useAlert";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { Image, Linking, Modal, Platform, StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VersionCheck from "react-native-version-check";

export default function Index() {

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const url = process.env.EXPO_PUBLIC_API_URL;
  const appVersion = Constants.expoConfig?.version;
  const [hasUpdate, setHasUpdate] = useState(false);

  const { visible, alertData, hideAlert, showAlert } = useAlert();
  const { isLoading, login } = useAuth(url!, showAlert);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const openPlayStore = () => {
    Linking.openURL("https://play.google.com/store/apps/details?id=com.hipersenna.GHSApp");
  };

  async function checkForUpdate() {
    try {
      const androidPackageName = Constants.expoConfig?.android?.package;

      const currentVersion = Constants.expoConfig?.version;

      if (!currentVersion) {
        return;
      }

      const latestVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === "android" ? "playStore" : "appStore",
        packageName: Platform.OS === "android" ? androidPackageName : "",
      });

      setHasUpdate(latestVersion > currentVersion);

      if (hasUpdate) {
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkForUpdate();
  }, []);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar barStyle={"dark-content"} />
      <View style={[styles.header]}>
        <Image source={theme.logoIcon} resizeMode="contain" style={{ height: 80 }} />
        <Text style={[styles.title, { color: theme.title }]}>GHSApp</Text>
      </View>

      <View style={[styles.main]}>
        <View>
          <Input
            value={username}
            onChangeText={(username) => setUsername(username.replace(/\s/g, ""))}
            label="Usuário:"
            IconRight={FontAwesome}
            iconRightName="user"
            placeholder="Digite o seu usuário"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Input
            value={password}
            onChangeText={setPassword}
            label="Senha:"
            IconRight={Octicons}
            iconRightName={showPassword ? "eye-closed" : "eye"}
            placeholder="Digite a sua senha"
            secureTextEntry={showPassword}
            onIconRightPress={() => setShowPassword(!showPassword)}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.loginButtonComponent}>
          <ButtonComponent
            text="Login"
            onPress={() => login(username, password)}
            loading={isLoading}
            style={{backgroundColor: theme.button2}}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: theme.text }]}>{appVersion}</Text>
      </View>

      <Modal animationType="fade" transparent={true} visible={hasUpdate}>
        <View style={styles.modalContainerCenter}>
          <View style={[styles.modalBox, { backgroundColor: theme.itemBackground }]}>
            <MaterialIcons name="update" size={110} color={Colors.red2} />
            <View style={styles.textBox}>
              <Text style={[styles.titleText, { color: theme.title }]}>App desatualizado</Text>
              <Text style={[styles.text, { color: theme.text }]}>
                A versão do app é menor que a versão publicada na play store, atualize para a nova versão.
              </Text>
            </View>
            <View style={styles.updateButtonComponentBox}>
              <ButtonComponent style={{backgroundColor: theme.button2, borderRadius: 12}} text={"Atualizar"} onPress={openPlayStore} />
            </View>
          </View>
        </View>
      </Modal>

      {alertData && (
        <ModalAlert
          visible={visible}
          onRequestClose={hideAlert}
          ButtonComponentPress={hideAlert}
          title={alertData.title}
          text={alertData.text}
          iconCenterName={alertData.icon}
          IconCenter={alertData.iconFamily}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 70,
    gap: 10,
  },
  title: {
    fontFamily: "Roboto-Bold",
    color: "white",
    fontSize: 30,
  },
  main: {
    width: "100%",
    maxWidth: 500,
    gap: 12,
  },
  loginButtonComponent: {
    paddingVertical: 20,
  },
  footer: {
    padding: 20,
  },
  versionText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  modalContainerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "rgba(0, 0, 0, 0.53)",
  },
  modalBox: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  textBox: {
    paddingBottom: 20,
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  updateButtonComponentBox: {
    width: "100%",
  },
  titleText: {
    fontFamily: "Roboto-Bold",
    fontSize: 24,
    color: Colors.blue,
  },
  text: {
    fontFamily: "Roboto-Regular",
    textAlign: "center",
    color: Colors.gray,
  },
});
