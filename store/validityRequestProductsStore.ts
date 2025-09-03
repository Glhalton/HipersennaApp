import { create } from "zustand"

type Product = {
  codProduct: number,
  description: string,
  validityDate: string,
  productStatus: number,
}

type RequestDataItem = {
  requestId: number,
  branchId: number,
  status: string,
  createdAt: string,
  targetDate: string,
  analystId: number,
  products: Product[]
}

type SelectedRequestsStore = {
  lista: RequestDataItem[];
  setLista: (novaLista: RequestDataItem[]) => void;         
  resetarLista: () => void;
}

export const validityRequestProductsStore = create<SelectedRequestsStore>((set) => ({
  lista: [],
  setLista: (novaLista) => set({ lista: novaLista }),
  resetarLista: () => set({ lista: [] }),
}));
