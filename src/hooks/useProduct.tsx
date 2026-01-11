import { getProducts } from "@/services/products.services";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
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

export function useProduct(showAlert: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [listProductFilter, setListProductsFilter] = useState<Product[]>();
  const [productData, setProductData] = useState<Product>();
  const [productsListModal, setProductsListModal] = useState(false);

  const productSearch = async (filter: string, filterValue: string, branchId: number) => {
    if (!branchId || !filterValue) {
      showAlert({
        title: "Atenção!",
        text: "Preencha todos os campos obrigatórios!",
        icon: "alert",
        color: "red",
        iconFamily: Octicons,
      });
      return;
    }

    try {
      setIsLoading(true);

      const data = await getProducts({ branchId, filter, filterValue });

      if (data.length > 0) {
        if (filter === "descricao") {
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
      } else if (data.length === 0) {
        showAlert({
          title: "Erro",
          text: "Produto não encontrado.",
          icon: "error-outline",
          color: Colors.red,
          iconFamily: MaterialIcons,
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Erro!",
        text: error.message || "Erro inesperado",
        icon: "error-outline",
        color: "red",
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
