import { apiFetch } from "@/api/api";

type createConsumptionProductPayload = {
  branch_id: number;
  group_id: number;
  product_code: number;
  auxiliary_code: string;
  quantity: number;
};

type GetConsumptionProductParams = {
  productCode: string;
  consumptionGroupId: string;
  branchId: string;
};

export async function getConsumptionProductService({
  productCode,
  branchId,
  consumptionGroupId,
}: GetConsumptionProductParams) {
  return apiFetch(
    `/consumption-products?product_code=${productCode}&branch_id=${branchId}&group_id=${consumptionGroupId}`,
    {
      method: "GET",
    },
  );
}

export async function createConsumptionProduct(payload: createConsumptionProductPayload) {
  return apiFetch("/consumption-products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
