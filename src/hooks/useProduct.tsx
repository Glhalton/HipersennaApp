import { MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Colors } from "../constants/colors";

type Product = {
  codAuxiliar: string;
  codComprador: number;
  codProd: number;
  codFornec: number;
  codDepto: number;
  descricao: string;
  comprador: string;
  precoTabela: number;
  precoVenda: number;
  precoTabelaAtac: number;
  precoVendaAtac: number;
  fatorConversao: number;
  unidade: string;
  embalagem: string;
  dtInativo: string | null;
  qtEstGer: number;
  qtReserv: number;
  qtBloqueada: number;
  qtEstGerDp6: number;
  qtReservDp6: number;
  qtBloqueadaDp6: number;
};

export function useProduct(url: string, showAlert: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [listProductFilter, setListProductsFilter] = useState<Product[]>();
  const [productData, setProductData] = useState<Product>();
  const [productsListModal, setProductsListModal] = useState(false);

  const productSearch = async (optionFilter: string, codProductInput: string, branchId: number) => {
    if (!branchId || !codProductInput) {
      showAlert({
        title: "Atenção!",
        text: "Preencha todos os campos obrigatórios!",
        icon: "alert",
        color: Colors.orange,
        iconFamily: Octicons,
      });
      return;
    }

    const token = await AsyncStorage.getItem("token");

    try {
      setIsLoading(true);
      const response = await fetch(`${url}/products/?${optionFilter}=${codProductInput}&codfilial=${branchId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (optionFilter == "descricao") {
          setListProductsFilter(data);
          setProductsListModal(true);
          return null;
        } else {
          if (data.length > 1) {
            setListProductsFilter(data);
            setProductsListModal(true);
            return null;
          } else {
            setProductData(data[0]);
            const product: Product = data[0];
            return product;
          }
        }
      } else {
        if (response.status == 404) {
          showAlert({
            title: "Erro!",
            text: "Produto não encontrado",
            icon: "error-outline",
            color: Colors.red,
            iconFamily: MaterialIcons,
          });
        } else {
          showAlert({
            title: "Erro!",
            text: `${data.message}`,
            icon: "error-outline",
            color: Colors.red,
            iconFamily: MaterialIcons,
          });
        }
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: `Não foi possivel conectar ao servidor: ${error.message}`,
        icon: "error-outline",
        color: Colors.red,
        iconFamily: MaterialIcons,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    productSearch,
    isLoading,
    productData,
    listProductFilter,
    setProductData,
    setListProductsFilter,
    setProductsListModal,
    productsListModal,
  };
}
