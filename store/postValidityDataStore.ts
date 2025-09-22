import { create } from "zustand";

type Validity = {
  branch_id: number;
  employee_id: string;
  request_id: number | null;
}

type Product = {
  product_cod: number;
  description?: string;
  productStatus?: string;
  validity_date: Date,
  quantity: number;
}

type VistoriaStore = {
  validity: Validity;
  productsList: Product[];
  addValidity: (validity: Validity) => void;
  addProduct: (product: Product) => void;
  setProductList: (products: Product[]) => void;
  removeProduct: (index: number) => void;
  resetProductsList: () => void;
  resetValidityData: () => void;
  updateProductQuantity: (index: number, quantity: number) => void;
  updateProductStatus: (index: number, status: string) => void;
}

export const postValidityDataStore = create<VistoriaStore>((set) => ({
  productsList: [],
  validity: {
    branch_id: 0,
    employee_id: "",
    request_id: null
  },
  addValidity: (validity) => set({ validity }),
  addProduct: (item) => set((state) => ({ productsList: [...state.productsList, item] })),
  setProductList: (products) => set({ productsList: products }),
  removeProduct: (index) =>
    set((state) => ({
      productsList: state.productsList.filter((_, i) => i !== index),
    })),
  resetProductsList: () => set({ productsList: [] }),
  resetValidityData: () => set({
    validity: {
      branch_id: 0,
      employee_id: "",
      request_id: null
    },
  }),
  updateProductQuantity: (index: number, quantity: number) =>
    set((state) => {
      const updated = [...state.productsList];
      updated[index] = { ...updated[index], quantity };
      return { productsList: updated };
    }),
  updateProductStatus: (index: number, productStatus: string) =>
    set((state) => {
      const updated = [...state.productsList];
      updated[index] = { ...updated[index], productStatus };
      return { productsList: updated };
    }),
}));