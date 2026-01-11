import { InfoItem } from "@/components/UI/InfoItem";
import { Screen } from "@/components/UI/Screen";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function ProductData() {
  const product = useLocalSearchParams();
  const [inativity, setInativity] = useState("");
  const [availableStock, setAvailableStock] = useState(0);
  const [availableStockDp6, setAvailableStockDp6] = useState(0);

  const verifyInativity = (value: any) => {
    if (value == undefined) {
      setInativity("ATIVO");
    } else {
      setInativity("INATIVO");
    }
  };

  const calculateAvailableStock = (
    total: number,
    reserved: number,
    blocked: number,
    totaldp6: number,
    reserveddp6: number,
    blockeddp6: number,
  ) => {
    const availableStock = total - (reserved + blocked);
    const availableStockDP6 = totaldp6 - (reserveddp6 + blockeddp6);
    setAvailableStock(availableStock);
    setAvailableStockDp6(availableStockDP6);
  };

  useEffect(() => {
    verifyInativity(product.dtinativo);
    calculateAvailableStock(
      Number(product.qtEstGer),
      Number(product.qtReserv),
      Number(product.qtBloqueada),
      Number(product.qtEstGerDp6),
      Number(product.qtReservDp6),
      Number(product.qtBloqueadaDp6),
    );
  }, []);

  function formatValue(value: number) {
    return value.toFixed(2).replace(".", ",");
  }

  return (
    <Screen>
      <View className="gap-4 pr-2">
        <InfoItem label="Descrição:" value={product.descricao} />
        <InfoItem label="Cód de Barras:" value={product.codAuxiliar} textToCopy={product.codAuxiliar} />
        <View className="flex-row gap-28">
          <View className="gap-4">
            <InfoItem label="Cód Interno:" value={product.codProd} textToCopy={product.codProd} />
            <InfoItem label="Embalagem:" value={product.unidade} />
            <InfoItem label="Qtd. Disponível:" value={availableStock} />
            <InfoItem label="Varejo:" value={`R$ ${formatValue(Number(product.precoVenda))}`} />
            <InfoItem label="Varejo Futuro:" value={`R$ ${formatValue(Number(product.precoTabela))}`} />
            {product.vlOferta && (
              <View className="bg-blue-200 rounded-md">
                <InfoItem label="Oferta:" value={`R$ ${formatValue(Number(product.vlOferta))}`} />
              </View>
            )}
          </View>
          <View className="gap-4">
            <InfoItem label="Situação:" value={inativity} />
            <InfoItem label="Unidade:" value={product.unidade} />
            <InfoItem label="Qtd. Disponível DP6:" value={availableStockDp6} />
            <InfoItem label="Atacado:" value={`R$ ${formatValue(Number(product.precoVendaAtac))}`} />
            <InfoItem label="Atacado Futuro:" value={`R$ ${formatValue(Number(product.precoTabelaAtac))}`} />
          </View>
        </View>
      </View>
    </Screen>
  );
}
