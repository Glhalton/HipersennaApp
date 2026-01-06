import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import VersionCheck from "react-native-version-check";

export function useCheckAppUpdate() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  const isDev = __DEV__ || Constants.expoConfig?.extra?.environment === "development";

  if (isDev) {
    return { hasUpdate: false, loading: false };
  }

  async function checkForUpdate() {
    try {
      const packageName = Constants.expoConfig?.android?.package;

      const result = await VersionCheck.needUpdate({
        packageName,
        provider: Platform.OS === "android" ? "playStore" : "appStore",
      });
      console.log(result);
      setHasUpdate(result?.isNeeded ?? false);
    } catch (error: any) {
      console.log("Erro ao verificar versão", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkForUpdate();
  }, []);

  return { hasUpdate, loading };
}
