import { useNavigate } from "react-router-dom";
import type { Pitch } from "../../types";
import Button from "../ui/Button";

interface PitchCardProps {
  pitch: Pitch;
}

export default function PitchCard({ pitch }: PitchCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900">{pitch.name}</h3>
      <p className="text-gray-500 mt-1">{pitch.location}</p>
      <p className="text-green-700 font-bold mt-3 text-lg">Rs. {pitch.pricePerHour}/hr</p>
      <Button className="mt-4 w-full" onClick={() => navigate(`/book/${pitch.id}`)}>
        View Slots
      </Button>
    </div>
  );
}
