import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPitchById } from "../api/pitch.api";
import { reserveSlotApi, confirmBookingApi, cancelReservationApi } from "../api/booking.api";
import { useSlots } from "../hooks/useSlots";
import { useSocket } from "../hooks/useSocket";
import SlotGrid from "../components/booking/SlotGrid";
import BookingConfirmModal from "../components/booking/BookingConfirmModal";
import Spinner from "../components/ui/Spinner";
import type { Slot } from "../types";

export default function BookingPage() {
  const { pitchId } = useParams<{ pitchId: string }>();
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reservedUntil, setReservedUntil] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: pitch, isLoading: pitchLoading } = useQuery({
    queryKey: ["pitch", pitchId],
    queryFn: () => fetchPitchById(pitchId!).then((res) => res.data),
    enabled: !!pitchId,
  });

  const { data: slots, isLoading: slotsLoading } = useSlots(pitchId!, date);
  useSocket(pitchId!, date);

  const handleSlotSelect = async (slot: Slot) => {
    setError(null);
    setSelectedSlot(slot);

    try {
      const res = await reserveSlotApi(pitchId!, date, slot.startTime);
      setReservedUntil(res.data.reservedUntil);
      setShowModal(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to reserve slot");
      setSelectedSlot(null);
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setConfirmLoading(true);

    try {
      await confirmBookingApi(pitchId!, date, selectedSlot.startTime);
      setShowModal(false);
      setSelectedSlot(null);
      setReservedUntil(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to confirm booking");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedSlot) return;

    try {
      await cancelReservationApi(pitchId!, date, selectedSlot.startTime);
    } catch {
      console.error("Failed to cancel reservation");
    }

    setShowModal(false);
    setSelectedSlot(null);
    setReservedUntil(null);
  };

  if (pitchLoading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{pitch?.name}</h1>
        <p className="text-gray-500">{pitch?.location}</p>
        <p className="text-green-700 font-semibold mt-1">Rs. {pitch?.pricePerHour}/hr</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => {
            setDate(e.target.value);
            setSelectedSlot(null);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <SlotGrid
        slots={slots}
        isLoading={slotsLoading}
        selectedSlot={selectedSlot}
        onSelect={handleSlotSelect}
      />

      <BookingConfirmModal
        isOpen={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        slot={selectedSlot}
        pitch={pitch || null}
        date={date}
        reservedUntil={reservedUntil}
        loading={confirmLoading}
      />
    </div>
  );
}
