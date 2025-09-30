import { create } from "zustand";

interface UserDadosStore {
  token: string | null;
  userId: string | null;
  name: string | null;
  username: string | null;
  accessLevel: number | null;
  branchId: number | null;
  setToken: (token: string) => void;
  setUserId: (id: string) => void;
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  setAccessLevel: (level: number) => void;
  setBranchId: (branch: number) => void;
}

export const employeeDataStore = create<UserDadosStore>((set) => ({
  token: null,
  userId: null,
  name: null,
  username: null,
  accessLevel: null,
  branchId: null,
  setToken: (token) => set({ token: token }),
  setUserId: (id) => set({ userId: id }),
  setName: (name) => set({ name: name }),
  setUsername: (username) => set({ username: username }),
  setAccessLevel: (level) => set({ accessLevel: level }),
  setBranchId: (branch) => set({ branchId: branch }),
}));
