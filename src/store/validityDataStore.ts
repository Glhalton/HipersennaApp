import { create } from "zustand";

type Validity = {
  branch_id: number;
  request_id: number | null;
  products: Product[];
};

type Product = {
  id?: number;
  auxiliary_code: string;
  product_code: number;
  description?: string;
  validity_date: Date;
  quantity: number;
  status?: string;
};

type VistoriaStore = {
  validity: Validity;
  addValidity: (validity: Validity) => void;
  addProduct: (product: Product) => void;
  setProductsList: (products: Product[]) => void;
  removeProduct: (index: number) => void;
  resetProductsList: () => void;
  resetValidityData: () => void;
  setProductQuantity: (id: number, quantity: number) => void;
  setProductStatus: (id: number, status: string) => void;
};

export const validityDataStore = create<VistoriaStore>((set) => ({
  validity: {
    branch_id: 0,
    request_id: null,
    products: [],
  },
  addValidity: (validity) => set({ validity }),

  addProduct: (product) =>
    set((state) => ({ validity: { ...state.validity, products: [...state.validity.products, product] } })),

  setProductsList: (products) =>
    set((state) => ({
      validity: {
        ...state.validity,
        products,
      },
    })),

  removeProduct: (index) =>
    set((state) => ({
      validity: {
        ...state.validity,
        products: state.validity.products.filter((_, i) => i !== index),
      },
    })),

  resetProductsList: () =>
    set((state) => ({
      validity: {
        ...state.validity,
        products: [],
      },
    })),

  resetValidityData: () =>
    set({
      validity: {
        branch_id: 0,
        request_id: null,
        products: [],
      },
    }),

  setProductQuantity: (id, quantity) =>
    set((state) => ({
      validity: {
        ...state.validity,
        products: state.validity.products.map((p) => (p.id === id ? { ...p, quantity } : p)),
      },
    })),

  setProductStatus: (id, status) =>
    set((state) => ({
      validity: {
        ...state.validity,
        products: state.validity.products.map((p) => (p.id === id ? { ...p, status } : p)),
      },
    })),
}));
