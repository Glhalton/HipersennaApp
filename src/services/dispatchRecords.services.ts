import { apiFetch } from "@/api/api";

export type CreateDispatchPayload = {
  branch_id: string;
  nfe_number: string;
  bonus_number: string;
  seal_number: string;
  license_plate: string;
};

type GetDispatchParams = {
  filter: string;
  filterValue: string;
  branchId: string;
};

export async function createDispatch(payload: CreateDispatchPayload) {
  return apiFetch("/dispatch-records", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDispatch({ branchId, filter, filterValue }: GetDispatchParams) {
  const query = `?${filter}=${filterValue}&branch_id=${branchId}`;

  return apiFetch(`/dispatch-records${query}`, {
    method: "GET",
  });
}
