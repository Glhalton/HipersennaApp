import { create } from "zustand";

type Product = {
  codProduct: number,
  description: string,
  validityDate: Date,
  productStatus: number,
  quantity: number,
};

type VistoriaProdutoStore = {
  produtos: Product[];
  setProdutos: (lista: Product[]) => void;
  setProductStatus: (codProduct: number, status: number) => void;
}

export const requestProductsStore = create<VistoriaProdutoStore>((set) => ({
  produtos: [],
  setProdutos: (lista) => set({ produtos: lista }),
  setProductStatus: (codProduct, status) =>
    set((state) => ({
      produtos: state.produtos.map((p) =>
        p.codProduct === codProduct ? { ...p, productStatus: status } : p
      ),
    }))
}));