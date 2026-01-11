import { apiFetch } from "@/api/api";

export type CreateConsumptionGroupPayload = {
  description: string;
};

export async function getConsumptionGroupsService() {
  return await apiFetch(`/consumption-groups`, {
    method: "GET",
  });
}
export async function createConsumptionGroupsService(payload: CreateConsumptionGroupPayload) {
  return await apiFetch(`/consumption-groups`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateConsumptionGroupsService(payload: CreateConsumptionGroupPayload, id: number) {
  return await apiFetch(`/consumption-groups/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteConsumptionGroupsService(id: number) {
  return await apiFetch(`/consumption-groups/${id}`, {
    method: "DELETE",
  });
}
