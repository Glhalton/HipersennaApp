import { create } from "zustand";

//Tipagem de cada item que sera utilizado
type ProductData = {
  codProduct: string;
  description?: string;
  validityDate: Date,
  quantidade: string;
  observation?: string;
}

type ValidityData = {
  branchId: string,
  createdAt: Date,
  userId: number,
  requestId?: number
}

//Tipagem das itens que serão globais
type VistoriaStore = {
  validityData: ValidityData | null; 
  products: ProductData[];
  addValidity: (validityData: ValidityData) => void;
  addProduct: (Item: ProductData) => void;
  removeProduct: (index: number) => void;
  resetProducts: () => void;
}

//Criação do store
export const validityInsertStore = create<VistoriaStore>((set) => ({
  products: [],
  validityData: null,
  addValidity: (validityData) => set(({validityData})),
  addProduct: (item) => set((state) => ({ products: [...state.products, item] })),
  removeProduct: (index) =>
    set((state) => ({
      products: state.products.filter((_, i) => i !== index),
    })),
  resetProducts: () => set({ products: [] }),
}));