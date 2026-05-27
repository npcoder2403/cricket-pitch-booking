import type { Slot } from "../../types";
import SlotBadge from "./SlotBadge";
import Spinner from "../ui/Spinner";

interface SlotGridProps {
  slots: Slot[] | undefined;
  isLoading: boolean;
  selectedSlot: Slot | null;
  onSelect: (slot: Slot) => void;
}

export default function SlotGrid({ slots, isLoading, selectedSlot, onSelect }: SlotGridProps) {
  if (isLoading) return <Spinner />;

  if (!slots || slots.length === 0) {
    return <p className="text-gray-500 text-center py-8">No slots available for this date</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((slot) => (
        <SlotBadge
          key={slot.startTime}
          slot={slot}
          isSelected={selectedSlot?.startTime === slot.startTime}
          onClick={() => {
            if (slot.status === "AVAILABLE") onSelect(slot);
          }}
        />
      ))}
    </div>
  );
}
