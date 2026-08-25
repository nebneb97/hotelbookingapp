"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format, isPast } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import AlertMessage from "./AlertMessage";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface ReservationEntry {
  id: number;
  checkIn: string;
  checkOut: string;
  room?: { id: number };
}

interface ReservationProps {
  reservations: { data: ReservationEntry[] } | null;
  room: { id: number; documentId?: string };
  isUserAuthenticated: boolean;
  userData: { given_name: string | null; family_name: string | null; email: string | null } | null;
}

const Reservation = ({
  reservations,
  room,
  isUserAuthenticated,
  userData,
}: ReservationProps) => {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!alertMessage) return;
    const timer = setTimeout(() => setAlertMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [alertMessage]);

  const saveReservation = async () => {
    setAlertMessage(null);

    if (!checkInDate || !checkOutDate) {
      setAlertMessage({ message: "Please select check-in and check-out date", type: "error" });
      return;
    }

    if (checkInDate.getTime() >= checkOutDate.getTime()) {
      setAlertMessage({ message: "Check-out date must be after check-in date", type: "error" });
      return;
    }

    // Client-side conflict check (server also validates)
    if (Array.isArray(reservations?.data)) {
      const newIn = new Date(checkInDate).setHours(0, 0, 0, 0);
      const newOut = new Date(checkOutDate).setHours(0, 0, 0, 0);

      const isReserved = reservations.data
        .filter((item) => item?.room?.id === room?.id && item.checkIn && item.checkOut)
        .some((item) => {
          const eIn = new Date(item.checkIn).setHours(0, 0, 0, 0);
          const eOut = new Date(item.checkOut).setHours(0, 0, 0, 0);
          return (
            (newIn >= eIn && newIn < eOut) ||
            (newOut > eIn && newOut <= eOut) ||
            (eIn > newIn && eIn < newOut)
          );
        });

      if (isReserved) {
        setAlertMessage({
          message: "This room is already booked for the selected dates. Please choose different dates.",
          type: "error",
        });
        return;
      }
    }

    try {
      await api.post("/api/reservations", {
        data: {
          firstname: userData?.given_name,
          lastname: userData?.family_name,
          email: userData?.email,
          checkIn: format(checkInDate, "yyyy-MM-dd"),
          checkOut: format(checkOutDate, "yyyy-MM-dd"),
          room: room?.id,
        },
      });

      setAlertMessage({
        message: "Your booking has been successfully confirmed! We look forward to welcoming you.",
        type: "success",
      });

      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      router.refresh();
    } catch {
      setAlertMessage({ message: "Failed to make reservation. Please try again.", type: "error" });
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg shadow-sm border border-orange-200 mb-4">
        <div className="bg-orange-600 py-4 text-center relative mb-2">
          <h4 className="text-xl font-semibold text-white">Book your room</h4>
          <div className="absolute -bottom-[8px] left-[calc(50%_-_10px)] w-0 h-0 border-l-[10px] border-l-transparent border-t-[8px] border-t-orange-600 border-r-[10px] border-r-transparent"></div>
        </div>
        <div className="flex flex-col gap-4 w-full py-8 px-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Check-in Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-gray-300 hover:bg-gray-50 transition-colors",
                    !checkInDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? (
                    <span className="text-gray-900 font-medium">{format(checkInDate, "PPP")}</span>
                  ) : (
                    <span>Select check-in date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-white w-auto p-0 shadow-lg">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  autoFocus
                  disabled={isPast}
                  className="rounded-md border-0"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Check-out Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-gray-300 hover:bg-gray-50 transition-colors",
                    !checkOutDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? (
                    <span className="text-gray-900 font-medium">{format(checkOutDate, "PPP")}</span>
                  ) : (
                    <span>Select check-out date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-white w-auto p-0 shadow-lg">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  autoFocus
                  disabled={isPast}
                  className="rounded-md border-0"
                />
              </PopoverContent>
            </Popover>
          </div>

          {isUserAuthenticated ? (
            <Button
              onClick={saveReservation}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 mt-4 transition-colors duration-200 shadow-sm"
            >
              Book Now
            </Button>
          ) : (
            <LoginLink>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 mt-4 transition-colors duration-200 shadow-sm"
                size="lg"
              >
                Book Now
              </Button>
            </LoginLink>
          )}
        </div>
      </div>
      {alertMessage && (
        <AlertMessage message={alertMessage.message} type={alertMessage.type} />
      )}
    </div>
  );
};

export default Reservation;
