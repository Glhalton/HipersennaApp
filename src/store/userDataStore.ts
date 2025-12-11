import { create } from "zustand";

type User = {
  id: number;
  branch_id: number;
  winthor_id: number;
  role_id: number;
  name: string;
  username: string;
  created_at: string;
  modified_at: string;
  hsusers_permissions: {
    permission_id: number;
    hspermissions: {
      description: string;
    }
  }[];
};


interface UserDadosStore {
  user: User;
  userId: string | null;
  name: string | null;
  username: string | null;
  accessLevel: number | null;
  branchId: number | null;
  winthorId: number | null;
  setUser: (user: User) => void;
  setUserId: (id: string) => void;
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  setAccessLevel: (level: number) => void;
  setBranchId: (branch: number) => void;
  setWinthorId: (winthorId: number) => void;
}

export const userDataStore = create<UserDadosStore>((set) => ({
  user: null,
  winthorId: null,
  userId: null,
  name: null,
  username: null,
  accessLevel: null,
  branchId: null,
  setUser: (user) => set({user: user}),
  setWinthorId: (winthorId) => set({ winthorId: winthorId }),
  setUserId: (id) => set({ userId: id }),
  setName: (name) => set({ name: name }),
  setUsername: (username) => set({ username: username }),
  setAccessLevel: (level) => set({ accessLevel: level }),
  setBranchId: (branch) => set({ branchId: branch }),
}));
