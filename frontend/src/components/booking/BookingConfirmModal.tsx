import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { Slot, Pitch } from "../../types";

interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  slot: Slot | null;
  pitch: Pitch | null;
  date: string;
  reservedUntil: string | null;
  loading: boolean;
}

export default function BookingConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  slot,
  pitch,
  date,
  reservedUntil,
  loading,
}: BookingConfirmModalProps) {
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (!reservedUntil) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((new Date(reservedUntil).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [reservedUntil]);

  useEffect(() => {
    if (timeLeft <= 0 && reservedUntil) {
      onClose();
    }
  }, [timeLeft, reservedUntil, onClose]);

  if (!slot || !pitch) return null;

  const startHour = new Date(slot.startTime).getHours();
  const endHour = new Date(slot.endTime).getHours();
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-500">Pitch</span>
          <span className="font-medium">{pitch.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Date</span>
          <span className="font-medium">{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Time</span>
          <span className="font-medium">{`${String(startHour).padStart(2, "0")}:00 - ${String(endHour).padStart(2, "0")}:00`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Price</span>
          <span className="font-medium text-green-700">Rs. {pitch.pricePerHour}</span>
        </div>
      </div>

      {reservedUntil && (
        <div className={`text-center p-3 rounded-lg mb-4 ${timeLeft <= 30 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
          Reservation expires in {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={onConfirm} disabled={loading}>
          {loading ? "Confirming..." : "Confirm Booking"}
        </Button>
      </div>
    </Modal>
  );
}
