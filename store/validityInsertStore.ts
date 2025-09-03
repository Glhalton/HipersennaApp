import { create } from "zustand";

//Tipagem de cada item que sera utilizado
type FormDataItem = {
  codProd: string;
  dataVencimento: Date;
  quantidade: string;
  observacao: string;
  nomeProduto: string;
}



//Tipagem das itens que serão globais
type VistoriaStore = {
  codFilial: string | null;
  nomeProduto: string | null;
  lista: FormDataItem[];
  setCodFilial: (filial: string | null) => void;
  setNomeProduto: (produto: string | null) => void;
  adicionarItem: (Item: FormDataItem) => void;
  removerItem: (index: number) => void;
  resetarLista: () => void;
}

//Criação do store
export const validityInsertStore = create<VistoriaStore>((set) => ({
  nomeProduto: null,
  lista: [],
  codFilial: null,
  setCodFilial: (filial) => set({ codFilial: filial }),
  setNomeProduto: (produto) => set({ nomeProduto: produto }),
  adicionarItem: (item) => set((state) => ({ lista: [...state.lista, item] })),
  removerItem: (index) =>
    set((state) => ({
      lista: state.lista.filter((_, i) => i !== index),
    })),
  resetarLista: () => set({ lista: [] }),
}));