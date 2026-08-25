"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AlertMessage from "./AlertMessage";
import { api } from "@/lib/api";

interface EditReservationProps {
  reservation: {
    documentId: string;
    checkIn: string;
    checkOut: string;
  };
  userEmail: string;
  onSuccess: () => void;
}

const EditReservation = ({ reservation, userEmail, onSuccess }: EditReservationProps) => {
  const [checkInDate, setCheckInDate] = useState<Date>(new Date(reservation.checkIn));
  const [checkOutDate, setCheckOutDate] = useState<Date>(new Date(reservation.checkOut));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const handleUpdate = async () => {
    if (checkInDate >= checkOutDate) {
      setAlertMessage({
        message: "Check-out date must be after check-in date",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `/api/reservations/${reservation.documentId}`,
        {
          data: {
            checkIn: format(checkInDate, "yyyy-MM-dd"),
            checkOut: format(checkOutDate, "yyyy-MM-dd"),
          },
        },
        { headers: { email: userEmail } }
      );

      setAlertMessage({
        message: "Reservation updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        setOpen(false);
        onSuccess();
      }, 1500);
    } catch {
      setAlertMessage({
        message: "Failed to update reservation. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Dates
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>
          <DialogDescription>
            Modify your check-in and check-out dates
          </DialogDescription>
        </DialogHeader>

        {alertMessage && (
          <AlertMessage message={alertMessage.message} type={alertMessage.type} />
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Check-in Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(checkInDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={(date) => date && setCheckInDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Check-out Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(checkOutDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={(date) => date && setCheckOutDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Reservation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditReservation;
