import { apiFetch } from "@/api/api";

type createConsumptionNotesPayload = {
  id: number[];
};

export async function createConsumptionNotesServices({ id }: createConsumptionNotesPayload) {
  return await apiFetch(`/consumption-notes`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
