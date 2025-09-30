import { create } from "zustand";

type Validity = {
  id: number;
  branch_id: number;
  employee_id: string;
  request_id: number | null;
  created_at: string;
  modified_at: string;
  products: Product[];
};

type Product = {
  id: number;
  validity_id: number;
  product_cod: number;
  quantity: number;
  description: string;
  validity_date: string;
  treat_id: number;
};

type ValidityStore = {
  products: Product[];
  setProducts: (lista: Product[]) => void;
};

export const getValidityDataStore = create<ValidityStore>((set) => ({
  products: [],
  setProducts: (lista) => set({ products: lista }),
}));
