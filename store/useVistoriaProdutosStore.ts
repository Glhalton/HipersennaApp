import { create } from "zustand"

type Produto = {
  productCode: number,
  description: string,
  validityDate: string,
  checked: boolean,
};

type VistoriaProdutoStore = {
    produtos: Produto[];
    setProdutos: (lista: Produto[]) => void;
}

export const useVistoriaProdutoStore = create<VistoriaProdutoStore>((set) => ({
    produtos: [],
    setProdutos: (lista) => set({ produtos: lista }),
}));