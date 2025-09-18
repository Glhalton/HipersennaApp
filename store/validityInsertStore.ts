import { create } from "zustand";

type ValidityData = {
  branch_id: number,
  employee_id: string,
  request_id: number | null
}

type ProductData = {
  product_cod: number;
  description?: string;
  productStatus?: string,
  validity_date: string,
  quantity: number;
  observation?: string | null;
}

type VistoriaStore = {
  validityData: ValidityData;
  productsList: ProductData[];
  addValidity: (validityData: ValidityData) => void;
  addProduct: (Item: ProductData) => void;
  setProductList: (products: ProductData[]) => void
  removeProduct: (index: number) => void;
  resetProducts: () => void;
  resetValidity: () => void;
  updateProductQuantity: (index: number, quantity: number) => void;
  updateProductStatus: (index: number, value: string) => void
}

//Criação do store
export const validityInsertStore = create<VistoriaStore>((set) => ({
  productsList: [],
  validityData: {
    branch_id: 0,
    employee_id: "",
    request_id: null
  },
  addValidity: (validityData) => set({ validityData }),
  addProduct: (item) => set((state) => ({ productsList: [...state.productsList, item] })),
  setProductList: (products) => set({ productsList: products }),
  removeProduct: (index) =>
    set((state) => ({
      productsList: state.productsList.filter((_, i) => i !== index),
    })),
  resetProducts: () => set({ productsList: [] }),
  resetValidity: () => set({
    validityData: {
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