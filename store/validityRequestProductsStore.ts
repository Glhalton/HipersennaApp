import { create } from "zustand"

type RequestDataItem = {
  requestId: number,
  branchId: number,
  status: string,
  createdAt: string,
  targetDate: string,
  analystId: number,
  products: Product[]
}

type Product = {
  codProduct: string,
  description: string,
  validityDate: Date,
  quantity: string,
  productStatus: string,
}

type SelectedRequestsStore = {
  requests: RequestDataItem[];
  setLista: (novaLista: RequestDataItem[]) => void;
  resetarLista: () => void;

}

export const validityRequestProductsStore = create<SelectedRequestsStore>((set) => ({
  requests: [],
  setLista: (novaLista) => set({ requests: novaLista }),
  resetarLista: () => set({ requests: [] }),

}));
