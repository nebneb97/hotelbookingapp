"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AlertMessage from "@/components/AlertMessage";

const CancelReservation = ({
  reservationId,
  roomName,
}: {
  reservationId: string;
  roomName: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:1337/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to cancel reservation");

      setAlert({
        message: "Your reservation has been successfully cancelled.",
        type: "success",
      });

      // Refresh the bookings list
      router.refresh();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setAlert({
        message: "Failed to cancel reservation. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {alert && (
        <div className="mb-4">
          <AlertMessage message={alert.message} type={alert.type} />
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Cancel"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel your reservation for{" "}
              {roomName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Dismiss</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CancelReservation;
