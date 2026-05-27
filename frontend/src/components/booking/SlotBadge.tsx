import type { Slot } from "../../types";

interface SlotBadgeProps {
  slot: Slot;
  isSelected: boolean;
  onClick: () => void;
}

export default function SlotBadge({ slot, isSelected, onClick }: SlotBadgeProps) {
  const startHour = new Date(slot.startTime).getHours();
  const endHour = new Date(slot.endTime).getHours();
  const label = `${String(startHour).padStart(2, "0")}:00 - ${String(endHour).padStart(2, "0")}:00`;

  const baseClass = "p-3 rounded-lg text-center text-sm font-medium transition-all border-2";

  if (isSelected) {
    return (
      <button className={`${baseClass} bg-purple-100 border-purple-500 text-purple-700 cursor-pointer`} onClick={onClick}>
        {label}
        <div className="text-xs mt-1">Selected</div>
      </button>
    );
  }

  if (slot.status === "BOOKED") {
    return (
      <div className={`${baseClass} bg-red-50 border-red-200 text-red-600 cursor-not-allowed`}>
        {label}
        <div className="text-xs mt-1">Booked</div>
      </div>
    );
  }

  if (slot.status === "RESERVED") {
    return (
      <div className={`${baseClass} bg-amber-50 border-amber-200 text-amber-600 cursor-not-allowed`}>
        {label}
        <div className="text-xs mt-1">Reserved</div>
      </div>
    );
  }

  return (
    <button className={`${baseClass} bg-green-50 border-green-200 text-green-700 hover:bg-green-100 cursor-pointer`} onClick={onClick}>
      {label}
      <div className="text-xs mt-1">Available</div>
    </button>
  );
}
