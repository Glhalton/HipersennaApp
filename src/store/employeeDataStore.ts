import { create } from "zustand";

interface UserDadosStore {
  userId: string | null;
  name: string | null;
  username: string | null;
  accessLevel: number | null;
  branchId: number | null;
  winthorId: number | null;
  setUserId: (id: string) => void;
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  setAccessLevel: (level: number) => void;
  setBranchId: (branch: number) => void;
  setWinthorId: (winthorId: number) => void;
}

export const employeeDataStore = create<UserDadosStore>((set) => ({
  winthorId: null,
  userId: null,
  name: null,
  username: null,
  accessLevel: null,
  branchId: null,
  setWinthorId: (winthorId) => set({ winthorId: winthorId }),
  setUserId: (id) => set({ userId: id }),
  setName: (name) => set({ name: name }),
  setUsername: (username) => set({ username: username }),
  setAccessLevel: (level) => set({ accessLevel: level }),
  setBranchId: (branch) => set({ branchId: branch }),
}));
