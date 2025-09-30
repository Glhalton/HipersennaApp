import { LargeButton } from "../../../components/largeButton";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../../constants/colors";

const relatorioVencimento = () => {
  router.push("./relatorioVencimento");
};
const relatorioBonus = () => {
  router.push("./relatorioBonus");
};

export default function SelectReport() {
  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.titulo}>Escolha o tipo de relatório:</Text>
        </View>
        <View style={styles.relatorioVencimentos}>
          <LargeButton
            text="Relatório de Vencimentos"
            onPress={relatorioVencimento}
          />
        </View>
        <View style={styles.relatorioBonus}>
          <LargeButton text="Relatório de Bônus" onPress={relatorioBonus} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 150,
  },
  titulo: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    color: Colors.blue,
  },
  relatorioVencimentos: {
    marginTop: 30,
    marginBottom: 30,
  },
  relatorioBonus: {},
});
