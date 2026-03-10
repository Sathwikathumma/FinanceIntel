import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type FinancialDataInput } from "@shared/routes";

export function useFinancialData() {
  return useQuery({
    queryKey: [api.financialData.get.path],
    queryFn: async () => {
      const res = await fetch(api.financialData.get.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch financial data");
      return api.financialData.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateFinancialData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FinancialDataInput) => {
      const res = await fetch(api.financialData.update.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Validation error");
        }
        throw new Error("Failed to update financial data");
      }
      return api.financialData.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.financialData.get.path] });
    },
  });
}
