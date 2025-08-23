import { create } from "zustand"

type Produto = {
    cod_produto: string;
    name: string;
};

type VistoriaProdutoStore = {
    produtos: Produto[];
    setProdutos: (lista: Produto[]) => void;
}

export const useVistoriaProdutoStore = create<VistoriaProdutoStore>((set) => ({
    produtos: [],
    setProdutos: (lista) => set({ produtos: lista }),
}));