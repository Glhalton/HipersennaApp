import { create } from "zustand";

type Product = {
  codProduct: number,
  description: string,
  validityDate: string,
  productStatus: number,
};

type VistoriaProdutoStore = {
    produtos: Product[];
    setProdutos: (lista: Product[]) => void;
}

export const requestProductsStore = create<VistoriaProdutoStore>((set) => ({
    produtos: [],
    setProdutos: (lista) => set({ produtos: lista }),
}));