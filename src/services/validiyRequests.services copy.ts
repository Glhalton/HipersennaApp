import { apiFetch } from "@/api/api";

type GetMyValidityRequestsParams = {
  ordination: string;
};

export async function getMyValidityRequests({ ordination }: GetMyValidityRequestsParams) {
  const query = `?orderBy=${ordination}`;

  return apiFetch(`/validity-requests/me${query}`, {
    method: "GET",
  });
}
