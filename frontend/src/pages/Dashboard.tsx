import { useQuery } from "@tanstack/react-query";
import { fetchPitches } from "../api/pitch.api";
import PitchCard from "../components/booking/PitchCard";
import Spinner from "../components/ui/Spinner";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["pitches"],
    queryFn: () => fetchPitches().then((res) => res.data),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Pitches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </div>
    </div>
  );
}
