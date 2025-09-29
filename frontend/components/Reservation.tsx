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

const postData = async (url: string, data: object) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const Reservation = ({
  reservations,
  room,
  isUserAuthenticated,
  userData,
}: {
  reservations: any;
  room: any;
  isUserAuthenticated: boolean;
  userData: any;
}) => {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const router = useRouter();

  const formatDateForStrapi = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const saveReservation = async () => {
    setAlertMessage(null);

    // Validate that both dates are selected
    if (!checkInDate || !checkOutDate) {
      setAlertMessage({
        message: "Please select check-in and check-out date",
        type: "error",
      });
      return;
    }

    if (checkInDate.getTime() >= checkOutDate.getTime()) {
      setAlertMessage({
        message: "Check-out date must be after check-in date",
        type: "error",
      });
      return;
    }

    console.log("Reservation saved:", { checkInDate, checkOutDate });

    // Add safety checks for reservations data
    if (!reservations?.data || !Array.isArray(reservations.data)) {
      console.log("No reservations data available");
      // Proceed with booking since no existing reservations to check
    } else {
      // Check for existing reservations with comprehensive safety checks
      const isReserved = reservations.data
        .filter((item: any) => {
          // Safety check: ensure all required properties exist
          return (
            item?.attributes?.room?.data?.id &&
            item.attributes.room.data.id === room?.id &&
            item.attributes.checkIn &&
            item.attributes.checkOut
          );
        })
        .some((item: any) => {
          try {
            const existingCheckIn = new Date(item.attributes.checkIn).setHours(
              0,
              0,
              0,
              0
            );
            const existingCheckOut = new Date(
              item.attributes.checkOut
            ).setHours(0, 0, 0, 0);

            const checkInTime = checkInDate.setHours(0, 0, 0, 0);
            const checkOutTime = checkOutDate.setHours(0, 0, 0, 0);

            // Check if the room is reserved between the check-in and check-out date
            const isReservedBetweenDates =
              (checkInTime >= existingCheckIn &&
                checkInTime < existingCheckOut) ||
              (checkOutTime > existingCheckIn &&
                checkOutTime <= existingCheckOut) ||
              (existingCheckIn > checkInTime &&
                existingCheckIn < checkOutTime) ||
              (existingCheckOut > checkInTime &&
                existingCheckOut <= checkOutTime);

            return isReservedBetweenDates;
          } catch (dateError) {
            console.log("Error processing reservation dates:", dateError);
            return false; // Skip this reservation if there's a date parsing error
          }
        });

      // If the room is reserved, show error and return
      if (isReserved) {
        setAlertMessage({
          message:
            "This room is already booked for the selected dates. Please choose different dates or another room.",
          type: "error",
        });
        return;
      }
    }

    // Proceed with booking
    const data = {
      data: {
        firstname: userData.given_name,
        lastname: userData.family_name,
        email: userData.email,
        checkIn: checkInDate ? formatDateForStrapi(checkInDate) : null,
        checkOut: checkOutDate ? formatDateForStrapi(checkOutDate) : null,
        room: room?.id,
      },
    };

    try {
      await postData("http://127.0.0.1:1337/api/reservations", data);

      setAlertMessage({
        message:
          "Your booking has been successfully confirmed! We look forward to welcoming you on your selected dates.",
        type: "success",
      });

      // Reset form after successful booking
      setCheckInDate(undefined);
      setCheckOutDate(undefined);

      router.refresh();
    } catch (error) {
      setAlertMessage({
        message: "Failed to make reservation. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg shadow-sm border border-orange-200 mb-4">
        {/*Top*/}
        <div className="bg-orange-600 py-4 text-center relative mb-2">
          <h4 className="text-xl font-semibold text-white">Book your room</h4>
          {/*Triangle*/}
          <div className="absolute -bottom-[8px] left-[calc(50%_-_10px)] w-0 h-0 border-l-[10px] border-l-transparent border-t-[8px] border-t-orange-600 border-r-[10px] border-r-transparent"></div>
        </div>
        <div className="flex flex-col gap-4 w-full py-8 px-6">
          {/*check in*/}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Check-in Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size={"lg"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-gray-300 hover:bg-gray-50 transition-colors",
                    !checkInDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? (
                    <span className="text-gray-900 font-medium">
                      {format(checkInDate, "PPP")}
                    </span>
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

          {/*check out*/}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Check-out Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size={"lg"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-gray-300 hover:bg-gray-50 transition-colors",
                    !checkOutDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? (
                    <span className="text-gray-900 font-medium">
                      {format(checkOutDate, "PPP")}
                    </span>
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

          {/* Conditional rendering of the booking button */}
          {isUserAuthenticated ? (
            <Button
              onClick={() => saveReservation()}
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
