import { create } from "zustand";

type Request = {
  id: number;
  branch_id: number;
  status: string;
  created_at: string;
  target_date: string;
  analyst_id: number;
  products: Product[];
};

type Product = {
  product_cod: number;
  validity_date: Date;
  description: string;
  quantity: string;
  status: string;
};

type SelectedRequestsStore = {
  requests: Request[];
  products: Product[];
  setRequestsList: (novaLista: Request[]) => void;
  resetList: () => void;
  setProductsList: (productsList: Product[]) => void;
  setProductStatus: (product_cod: number, status: number) => void;
};

export const validityRequestDataStore = create<SelectedRequestsStore>(
  (set) => ({
    requests: [],
    products: [],
    resetList: () => set({ requests: [] }),
    setRequestsList: (novaLista) => set({ requests: novaLista }),
    setProductsList: (lista) => set({ products: lista }),
    setProductStatus: (product_cod, status) =>
      set((state) => ({
        products: state.products.map((p) =>
          p.product_cod === product_cod ? { ...p, productStatus: status } : p,
        ),
      })),
  }),
);
