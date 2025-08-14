import { create } from "zustand"

//Tipagem de cada item que sera utilizado
type FormDataItem = {
  codProd: string;
  codFilial: string;
  dataVencimento: Date;
  quantidade: string;
  observacao: string;
  nomeProduto: string,
}



//Tipagem das itens que serão globais
type VistoriaStore = {
  nomeProduto: string | null;
  userId: string | null;
  lista: FormDataItem[];
  setUserId: (id: string | null) => void;
  setNomeProduto: (produto: string | null) => void;
  adicionarItem: (Item: FormDataItem) => void;
  removerItem: (index: number) => void;
  resetarLista: () => void;
}

//Criação do store
export const useVistoriaStore = create<VistoriaStore>((set) => ({
  userId: null,
  nomeProduto: null,
  lista: [],
  setUserId: (id) => set({ userId: id }),
  setNomeProduto: (produto) => set({ nomeProduto: produto }),
  adicionarItem: (item) => set((state) => ({ lista: [...state.lista, item] })),
  removerItem: (index) =>
    set((state) => ({
      lista: state.lista.filter((_, i) => i !== index),
    })),
  resetarLista: () => set({ lista: [] }),
}));