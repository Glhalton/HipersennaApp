import { create } from "zustand"

//Tipagem de cada item que sera utilizado
type FormDataItem = {
  codProd: string;
  nomeProduto: string;
}

//Tipagem das itens que serão globais
type criarSolicitacaoStore = {
  codFilial: string | null;
  codConferente: string | null;
  nomeProduto: string | null;
  lista: FormDataItem[];
  setCodFilial: (filial: string | null) => void;
  setNomeProduto: (produto: string | null) => void;
  setCodConferente: (conferente: string | null) => void;
  adicionarItem: (Item: FormDataItem) => void;
  removerItem: (index: number) => void;
  resetarLista: () => void;
}

//Criação do store
export const useCriarSolicitacaoStore = create<criarSolicitacaoStore>((set) => ({
  nomeProduto: null,
  lista: [],
  codFilial: null,
  codConferente: null,
  setCodFilial: (filial) => set({ codFilial: filial }),
  setNomeProduto: (produto) => set({ nomeProduto: produto }),
  setCodConferente: (conferente) => set({codConferente: conferente}),
  adicionarItem: (item) => set((state) => ({ lista: [...state.lista, item] })),
  removerItem: (index) =>
    set((state) => ({
      lista: state.lista.filter((_, i) => i !== index),
    })),
  resetarLista: () => set({ lista: [] }),
}));