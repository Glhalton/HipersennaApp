import { create } from "zustand";

type ValidityData = {
  branchId: string,
  createdAt: string,
  userId: number,
  requestId: number | null
}

type ProductData = {
  codProduct: string;
  description?: string;
  productStatus?: string,
  validityDate: Date,
  quantity: string;
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
  updateProductQuantity: (index: number, quantity: string) => void;
  updateProductStatus: (index: number, value: string) => void
}

//Criação do store
export const validityInsertStore = create<VistoriaStore>((set) => ({
  productsList: [],
  validityData: {
    branchId: "",
    createdAt: "",
    userId: 0,
    requestId: null
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
      branchId: "",
      createdAt: "",
      userId: 0,
      requestId: null
    },
  }),
  updateProductQuantity: (index: number, quantity: string) =>
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