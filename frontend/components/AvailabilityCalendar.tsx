"use client";

import { useState, useEffect } from "react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { api } from "@/lib/api";

const AvailabilityCalendar = ({ roomId }: { roomId: number }) => {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Array<{ checkIn: string; checkOut: string }> }>(
        `/api/reservations?filters[room]=${roomId}&populate=*`,
        { cache: "no-store" } as RequestInit
      )
      .then((data) => {
        const dates: Date[] = [];
        data.data?.forEach(({ checkIn, checkOut }) => {
          const start = new Date(checkIn);
          const end = new Date(checkOut);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
          }
        });
        setBlockedDates(dates);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId]);

  const isDateBlocked = (date: Date) =>
    blockedDates.some(
      (b) => format(b, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

  if (loading) return <p className="text-sm text-gray-500">Loading availability...</p>;

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-800">Room Availability</h3>
      <Calendar
        mode="single"
        className="rounded-md border bg-white"
        disabled={isDateBlocked}
        modifiers={{ booked: blockedDates }}
        modifiersStyles={{
          booked: { backgroundColor: "#fee2e2", color: "#991b1b" },
        }}
      />
      <div className="flex gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-green-100 border border-green-500 rounded" />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-100 border border-red-500 rounded" />
          Booked
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
