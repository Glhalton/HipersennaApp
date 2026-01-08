import { Colors } from "@/constants/colors";
import { userDataStore } from "@/store/userDataStore";
import { StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const user = userDataStore((state) => state.user);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>DADOS DO USUÁRIO:</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.dataBox}>
          <View style={styles.rowBox}>
            <Text style={[styles.label, { color: theme.text }]}>Nome:</Text>
            <Text style={styles.text}>{user.name}</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={[styles.label, { color: theme.text }]}>Username:</Text>
            <Text style={styles.text}>{user.username}</Text>
          </View>
          <View style={[styles.rowBox]}>
            <Text style={[styles.label, { color: theme.text }]}>Cargo: </Text>
            <Text style={styles.text}>{user.role.description}</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={[styles.label, { color: theme.text }]}>Filial:</Text>
            <Text style={styles.text}>{user.branch_id}</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={[styles.label, { color: theme.text }]}>Código do Winthor:</Text>
            <Text style={styles.text}>{user.winthor_id}</Text>
          </View>
          <View style={[styles.rowBox, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, { color: theme.text }]}>Código do GHSApp:</Text>
            <Text style={styles.text}>{user.id}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: { paddingVertical: 15 },
  title: {
    fontFamily: "Roboto-SemiBold",
    fontSize: 16,
  },
  main: {},
  dataBox: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  rowBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderColor: "#aaaaaaff",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  text: { color: Colors.gray },
  label: {
    fontFamily: "Roboto-Bold",
  },
});
