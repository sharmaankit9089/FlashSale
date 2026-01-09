import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useLiveProducts() {
  return useQuery({
    queryKey: ["live-products"],
    queryFn: async () => {
      const res = await api.get("/products/live");
      return res.data;
    },
    refetchInterval: 5000 // polling every 5 seconds
  });
}
