import { useQuery } from "@tanstack/react-query";
import { fetchMyBookings } from "../api/booking.api";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

export default function MyBookings() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => fetchMyBookings().then((res) => res.data),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {!bookings || bookings.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No bookings yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Pitch</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Time</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const startHour = new Date(booking.startTime).getHours();
                const endHour = new Date(booking.endTime).getHours();
                return (
                  <tr key={booking.id} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{booking.pitch.name}</div>
                      <div className="text-sm text-gray-500">{booking.pitch.location}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {`${String(startHour).padStart(2, "0")}:00 - ${String(endHour).padStart(2, "0")}:00`}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={booking.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
