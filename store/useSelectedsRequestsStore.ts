import { create } from "zustand"

type Product = {
  productCode: number,
  description: string,
  validityDate: string,
  checked: boolean,
}

type RequestDataItem = {
  requestId: number,
  branchId: number,
  status: string,
  createdAt: string,
  targetDate: string,
  analystId: number,
  checked: boolean,
  products: Product[]
}

type SelectedRequestsStore = {
  lista: RequestDataItem[];
  setLista: (novaLista: RequestDataItem[]) => void;
  toggleCheck: (id: number) => void;                 
  resetarLista: () => void;
}

export const useSelectedRequestsStore = create<SelectedRequestsStore>((set) => ({
  lista: [],
  setLista: (novaLista) => set({ lista: novaLista }),
  toggleCheck: (id) =>
    set((state) => ({
      lista: state.lista.map((item) =>
        item.requestId === id ? { ...item, checked: !item.checked } : item
      )
    })),
  resetarLista: () => set({ lista: [] }),
}));
