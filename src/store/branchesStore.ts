import { create } from "zustand";

type hsbranches = {
  id: number;
  description: string;
  created_at: string;
  modified_at: string;
};

type branchesStore = {
  branches: hsbranches[] | null;
  setBranchesList: (products: hsbranches[]) => void;
  resetBranchesList: () => void;
};

export const branchesStore = create<branchesStore>((set) => ({
  branches: null,

  setBranchesList: (branches) => set({ branches }),
  resetBranchesList: () => set({ branches: [] }),
}));
