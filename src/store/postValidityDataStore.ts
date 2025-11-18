import { create } from "zustand";

type Validity = {
  branch_id: number;
  request_id: number | null;
  products: Product[];
};

type Product = {
  product_cod: number;
  auxiliary_code: string;
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
  updateProductQuantity: (index: number, quantity: number) => void;
  updateProductStatus: (index: number, status: string) => void;
};

export const postValidityDataStore = create<VistoriaStore>((set) => ({
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

  updateProductQuantity: (index, quantity) =>
    set((state) => {
      const updated = [...state.validity.products];
      updated[index] = { ...updated[index], quantity };
      return {
        validity: {
          ...state.validity,
          products: updated,
        },
      };
    }),

  updateProductStatus: (index, status) =>
    set((state) => {
      const updated = [...state.validity.products];
      updated[index] = { ...updated[index], status };
      return {
        validity: {
          ...state.validity,
          products: updated,
        },
      };
    }),
}));
