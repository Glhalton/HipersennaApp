import {create} from "zustand";

type FormDataItem = {
    codProd: string;
    codFilial: string;
    nomeProduto: string;
}

type CriarSolicitacaoStore = {
    nomeProduto: string | null;
    lista: FormDataItem[];
    setNomeProduto: (produto: string | null) => void;
    adicionarItem: (item: FormDataItem) => void;
    removerItem: (index: number) => void;
    resetarLista: () => void;
}

export const useCriarSolicitacaoStore = create<CriarSolicitacaoStore>((set) => ({
    nomeProduto: null,
    lista: [],
    setNomeProduto: (produto) => set({ nomeProduto: produto }),
    adicionarItem: (item) => set((state) => ({ lista: [...state.lista, item] })),
    removerItem: (index) =>
        set((state) => ({
            lista: state.lista.filter((_, i) => i !== index),
        })),
    resetarLista: () => set({ lista: [] }),
}));