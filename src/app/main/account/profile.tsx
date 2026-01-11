import { Screen } from "@/components/UI/Screen";
import { Colors } from "@/constants/colors";
import { userDataStore } from "@/store/userDataStore";
import { StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";

export default function Profile() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const user = userDataStore((state) => state.user);

  return (
    <Screen>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

      <Text className="text-lg font-bold pb-3">DADOS DO USUÁRIO:</Text>

      <View className="bg-white-900 rounded-xl">
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
    </Screen>
  );
}

const styles = StyleSheet.create({
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
