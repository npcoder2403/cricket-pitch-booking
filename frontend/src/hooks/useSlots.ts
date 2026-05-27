import { useQuery } from "@tanstack/react-query";
import { fetchSlots } from "../api/slot.api";

export function useSlots(pitchId: string, date: string) {
  return useQuery({
    queryKey: ["slots", pitchId, date],
    queryFn: () => fetchSlots(pitchId, date).then((res) => res.data),
    enabled: !!pitchId && !!date,
    refetchInterval: 10000,
  });
}
