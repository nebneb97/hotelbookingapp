"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useState, useEffect, useCallback } from "react";
import AlertMessage from "@/components/AlertMessage";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
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
import EditReservation from "@/components/EditReservations";
import BookingReceipt from "@/components/BookingReceipt";
import { api } from "@/lib/api";

interface Room {
  documentId: string;
  title: string;
  price: number;
  type: string;
  capacity: number;
  size: string;
  image?: { url: string };
}

interface Reservation {
  id: number;
  documentId: string;
  firstname: string;
  lastname: string;
  email: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  room?: Room;
}

const getUserReservations = (userEmail: string) =>
  api.get<{ data: Reservation[] }>(
    `/api/reservations?filters[email][$eq]=${userEmail}&populate=*`,
    { cache: "no-store" } as RequestInit
  );

const deleteReservation = (reservationDocumentId: string, userEmail: string) =>
  api.del(`/api/reservations/${reservationDocumentId}`, {
    headers: { email: userEmail },
  });

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const [userReservations, setUserReservations] = useState<{ data: Reservation[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await getUserReservations(user.email);
      setUserReservations(data);
    } catch {
      setAlertMessage({
        message: "Failed to load your reservations. Please try again.",
        type: "error",
      });
    }
  }, [user?.email]);

  useEffect(() => {
    const load = async () => {
      if (isLoading) return;
      if (!isAuthenticated || !user?.email) {
        setLoading(false);
        return;
      }
      await fetchReservations();
      setLoading(false);
    };
    load();
  }, [user, isAuthenticated, isLoading, fetchReservations]);

  useEffect(() => {
    if (!alertMessage) return;
    const timer = setTimeout(() => setAlertMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [alertMessage]);

  const handleCancelReservation = async (reservationDocumentId: string) => {
    if (!user?.email) return;
    setCancellingId(reservationDocumentId);
    try {
      await deleteReservation(reservationDocumentId, user.email);
      setAlertMessage({
        message: "Your reservation has been successfully cancelled.",
        type: "success",
      });
      await fetchReservations();
    } catch {
      setAlertMessage({
        message: "Failed to cancel reservation. Please try again.",
        type: "error",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const getReservationStatus = (checkInDate: Date, checkOutDate: Date) => {
    const now = new Date();
    if (now < checkInDate) return "upcoming";
    if (now >= checkInDate && now <= checkOutDate) return "active";
    return "completed";
  };

  const canCancelReservation = (checkInDate: Date) => {
    const cutoff = new Date(checkInDate);
    cutoff.setHours(cutoff.getHours() - 24);
    return new Date() < cutoff;
  };

  if (isLoading || loading) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading your bookings...</p>
      </section>
    );
  }

  if (!isAuthenticated || !user?.email) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Please log in to view your bookings.
          </p>
          <Link href="/api/auth/login">
            <Button className="bg-orange-600 hover:bg-orange-700">Login</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8">
        <h3 className="text-2xl font-bold mb-12 border-b pb-4 text-center lg:text-left">
          My Bookings
        </h3>

        {alertMessage && (
          <div className="mb-6">
            <AlertMessage
              message={alertMessage.message}
              type={alertMessage.type}
            />
          </div>
        )}

        <div className="space-y-6">
          {!userReservations?.data || userReservations.data.length < 1 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  No Reservations Found
                </h4>
                <p className="text-gray-600 mb-6">
                  You don&apos;t have any reservations yet. Start by booking a
                  room!
                </p>
                <Link href="/">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Browse Rooms
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userReservations.data
                .filter((r: Reservation) => r?.checkIn && r?.checkOut)
                .map((reservation: Reservation) => {
                  const checkInDate = new Date(reservation.checkIn);
                  const checkOutDate = new Date(reservation.checkOut);

                  if (
                    isNaN(checkInDate.getTime()) ||
                    isNaN(checkOutDate.getTime())
                  ) {
                    return null;
                  }

                  const room = reservation.room;
                  const status = getReservationStatus(checkInDate, checkOutDate);
                  const canCancel = canCancelReservation(checkInDate);
                  const nights = Math.ceil(
                    (checkOutDate.getTime() - checkInDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={reservation.documentId}
                      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {room?.image?.url && (
                        <div className="h-48 relative">
                          <Image
                            src={api.imageUrl(room.image.url)}
                            alt={room.title || "Room"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                          {room?.title || "Room"}
                        </h4>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Guest:</span>{" "}
                            {reservation.firstname} {reservation.lastname}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span>{" "}
                            {reservation.email}
                          </p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Check-in:</span>
                            <span className="text-gray-900">
                              {format(checkInDate, "PPP")}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Check-out:</span>
                            <span className="text-gray-900">
                              {format(checkOutDate, "PPP")}
                            </span>
                          </div>
                          {room?.price && (
                            <div className="flex justify-between text-sm font-medium border-t pt-2 mt-2">
                              <span className="text-gray-700">
                                Total ({nights} night{nights !== 1 ? "s" : ""}):
                              </span>
                              <span className="text-orange-600">
                                RM {room.price * nights}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              status === "upcoming"
                                ? "bg-blue-100 text-blue-800"
                                : status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {status === "upcoming"
                              ? "Upcoming"
                              : status === "active"
                              ? "Active"
                              : "Completed"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {room?.documentId && (
                            <Link href={`/room/${room.documentId}`}>
                              <Button variant="outline" size="sm">
                                View Room
                              </Button>
                            </Link>
                          )}

                          {status !== "completed" && room && (
                            <BookingReceipt
                              reservation={reservation}
                              room={room}
                            />
                          )}

                          {canCancel && status === "upcoming" && user?.email && (
                            <EditReservation
                              reservation={reservation}
                              userEmail={user.email}
                              onSuccess={fetchReservations}
                            />
                          )}

                          {canCancel && status === "upcoming" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={
                                    cancellingId === reservation.documentId
                                  }
                                >
                                  {cancellingId === reservation.documentId
                                    ? "Cancelling..."
                                    : "Cancel"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently cancel your
                                    reservation for{" "}
                                    {room?.title || "this room"}. This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Dismiss</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleCancelReservation(
                                        reservation.documentId
                                      )
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Confirm Cancellation
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
