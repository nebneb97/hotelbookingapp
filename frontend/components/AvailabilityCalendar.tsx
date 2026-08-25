"use client";

import { useState, useEffect } from "react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

const getBlockedDates = async (roomId: number) => {
  const res = await fetch(
    `http://127.0.0.1:1337/api/reservations?filters[room]=${roomId}&populate=*`,
    {
      cache: "no-store",
    }
  );
  
  const data = await res.json();

  const blockedDates: Date[] = [];
  data.data?.forEach((reservation: { checkIn: string; checkOut: string }) => {
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    
    // Add all dates between check-in and check-out
    for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
      blockedDates.push(new Date(d));
    }
  });
  
  return blockedDates;
};

const AvailabilityCalendar = ({ roomId }: { roomId: number }) => {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlockedDates(roomId).then((dates) => {
      setBlockedDates(dates);
      setLoading(false);
    });
  }, [roomId]);

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(
      (blockedDate) =>
        format(blockedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  if (loading) {
    return <div>Loading availability...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Room Availability</h3>
      <Calendar
        mode="single"
        className="rounded-md border"
        disabled={isDateBlocked}
        modifiers={{
          booked: blockedDates,
        }}
        modifiersStyles={{
          booked: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
          },
        }}
      />
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-500 rounded"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;