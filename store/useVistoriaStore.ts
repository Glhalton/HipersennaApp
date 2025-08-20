import { create } from "zustand"

//Tipagem de cada item que sera utilizado
type FormDataItem = {
  codProd: string;
  codFilial: string;
  dataVencimento: Date;
  quantidade: string;
  observacao: string;
  nomeProduto: string;
}



//Tipagem das itens que serão globais
type VistoriaStore = {
  nomeProduto: string | null;
  lista: FormDataItem[];
  setNomeProduto: (produto: string | null) => void;
  adicionarItem: (Item: FormDataItem) => void;
  removerItem: (index: number) => void;
  resetarLista: () => void;
}

//Criação do store
export const useVistoriaStore = create<VistoriaStore>((set) => ({
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