import { apiFetch } from "@/api/api";

type GetMyValiditiesParams = {
  ordination: string;
};

export async function getMyValidities({ ordination }: GetMyValiditiesParams) {
  const query = `?orderBy=${ordination}`;

  return apiFetch(`/validities/me${query}`, {
    method: "GET",
  });
}
