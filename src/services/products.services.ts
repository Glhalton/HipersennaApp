import { apiFetch } from "@/api/api";

type GetProductsParams = {
  filter: string;
  filterValue: string;
  branchId: number;
};

export async function getProducts({ branchId, filter, filterValue }: GetProductsParams) {
  const query = `?${filter}=${filterValue}&codfilial=${branchId}`;

  return apiFetch(`/products${query}`, {
    method: "GET",
  });
}
