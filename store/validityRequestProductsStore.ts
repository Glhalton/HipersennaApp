import { create } from "zustand"

type RequestDataItem = {
  id: number,
  branch_id: number,
  status: string,
  created_at: string,
  target_date: string,
  analyst_id: number,
  products: Product[]
}

type Product = {
  product_cod: string,
  validity_date: Date,
  description: string,
  quantity: string,
  status: string,
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
