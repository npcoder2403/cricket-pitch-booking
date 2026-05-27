export interface GeneratedSlot {
  startTime: Date;
  endTime: Date;
}

export function generateSlots(date: string): GeneratedSlot[] {
  const slots: GeneratedSlot[] = [];

  for (let hour = 6; hour < 22; hour++) {
    const startTime = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00.000Z`);
    const endTime = new Date(`${date}T${String(hour + 1).padStart(2, "0")}:00:00.000Z`);
    slots.push({ startTime, endTime });
  }

  return slots;
}
