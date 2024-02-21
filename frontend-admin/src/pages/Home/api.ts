import { SalesGraphPeriod } from "@api-contract/common";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { useAfterVerifyTokenNavigation } from "~/providers/after-verify-token-navigation";
import { useUser } from "~/providers/user";

export function useDashboardGraph(date: Date, period: SalesGraphPeriod) {
  return useQuery({
    queryKey: ["sales", date, period],
    queryFn: async () => {
      const r = await client.dashboard.salesGraph({
        query: { date: date.toISOString() },
        params: { period },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    staleTime: 0,
  });
}

export function useDashboardRecentData() {
  return useQuery({
    queryKey: ["recent_date"],
    queryFn: async () => {
      const r = await client.dashboard.recentCustomersOrders();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    staleTime: 0,
  });
}

export function useVerifyToken({
  onError,
}: {
  onError: (err: unknown) => void;
}) {
  const [_, setUser] = useUser();

  return useMutation({
    mutationFn: async () => {
      const r = await client.admin.verifyToken();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess: ({ email }) => {
      setUser({ email });
    },
    onError: (e) => {
      onError(e);
    },
  });
}
