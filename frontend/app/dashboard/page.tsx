"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

// Client-side function to fetch user reservations
const getUserReservations = async (userEmail: string) => {
  const res = await fetch(
    `http://127.0.0.1:1337/api/reservations?filters[email][$eq]=${userEmail}&populate=*`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reservations");
  }

  return await res.json();
};

// Client-side function to delete reservation
const deleteReservation = async (reservationId: string) => {
  const res = await fetch(
    `http://127.0.0.1:1337/api/reservations/${reservationId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to cancel reservation");
  }

  return await res.json();
};

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const [userReservations, setUserReservations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch reservations when user is available
  useEffect(() => {
    const fetchReservations = async () => {
      if (isLoading) return; // Wait for auth to complete
      
      if (!isAuthenticated || !user?.email) {
        console.log("User not authenticated or no email");
        setLoading(false);
        return;
      }

      console.log("=== DEBUGGING RESERVATIONS ===");
      console.log("User email from auth:", user.email);
      console.log("Fetching from URL:", `http://127.0.0.1:1337/api/reservations?filters[email][$eq]=${user.email}&populate=*`);

      try {
        // First, let's try getting ALL reservations to see the data structure
        const allReservationsRes = await fetch(
          `http://127.0.0.1:1337/api/reservations?populate=*`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );
        
        if (allReservationsRes.ok) {
          const allReservationsData = await allReservationsRes.json();
          console.log("ALL reservations in database:", allReservationsData);
          console.log("Total reservations count:", allReservationsData.data?.length || 0);
          
          // Log each reservation's email for comparison
          allReservationsData.data?.forEach((reservation: any, index: number) => {
            console.log(`Reservation ${index + 1}:`);
            console.log("- ID:", reservation.id);
            console.log("- Email in DB:", reservation.attributes?.email);
            console.log("- User email:", user.email);
            console.log("- Emails match:", reservation.attributes?.email === user.email);
            console.log("- Full reservation:", reservation);
          });
        }

        // Now try the filtered request
        const data = await getUserReservations(user.email);
        console.log("FILTERED reservations response:", data);
        console.log("Filtered reservations count:", data.data?.length || 0);
        
        setUserReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setAlertMessage({
          message: "Failed to load your reservations. Please try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, isAuthenticated, isLoading]);

  // Clear alert message after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleCancelReservation = async (reservationId: string) => {
    setCancellingId(reservationId);

    try {
      await deleteReservation(reservationId);

      setAlertMessage({
        message: "Your reservation has been successfully cancelled.",
        type: "success",
      });

      // Refresh reservations data
      if (user?.email) {
        const updatedData = await getUserReservations(user.email);
        setUserReservations(updatedData);
      }
    } catch (error) {
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
    const now = new Date();
    const cutoffTime = new Date(checkInDate);
    cutoffTime.setHours(cutoffTime.getHours() - 24);
    return now < cutoffTime;
  };

  // Show loading while auth is being determined
  if (isLoading || loading) {
    return (
      <section className="min-h-[80vh]">
        <div className="container mx-auto py-8 h-full">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show login prompt if user is not authenticated
  if (!isAuthenticated || !user?.email) {
    return (
      <section className="min-h-[80vh]">
        <div className="container mx-auto py-8 h-full">
          <div className="text-center">
            <p className="text-lg text-gray-600">
              Please log in to view your bookings.
            </p>
            <Link href="/api/auth/login">
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8 h-full">
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
                  You don&apos;t have any reservations yet. Start by booking a room!
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
                .filter(
                  (reservation: any) =>
                    reservation?.checkIn && 
                    reservation?.checkOut
                )
                .map((reservation: any) => {
                  try {
                    const checkInDate = new Date(reservation.checkIn);
                    const checkOutDate = new Date(reservation.checkOut);
                    const room = reservation.room;
                    const status = getReservationStatus(
                      checkInDate,
                      checkOutDate
                    );
                    const canCancel = canCancelReservation(checkInDate);

                    if (
                      isNaN(checkInDate.getTime()) ||
                      isNaN(checkOutDate.getTime())
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={reservation.id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {/* Room Image - if available */}
                        {room?.image?.data?.[0] && (
                          <div className="h-48 bg-gray-200 relative">
                            <Image
                              src={`http://127.0.0.1:1337${room.image.data[0].attributes.url}`}
                              alt={room.title || "Room"}
                              width={400}
                              height={192}
                              className="w-full h-full object-cover"
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
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                Check-in:
                              </span>
                              <span className="text-sm text-gray-900">
                                {format(checkInDate, "PPP")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                Check-out:
                              </span>
                              <span className="text-sm text-gray-900">
                                {format(checkOutDate, "PPP")}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-4">
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

                          <div className="flex gap-2 justify-between">
                            {room && (
                              <Link href={`/rooms/${room.id}`}>
                                <Button variant="outline" size="sm">
                                  View Room
                                </Button>
                              </Link>
                            )}

                            {canCancel && status === "upcoming" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={cancellingId === reservation.id}
                                  >
                                    {cancellingId === reservation.id
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
                                      This action cannot be undone. This will
                                      permanently cancel your reservation for{" "}
                                      {room?.title || "this room"}.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Dismiss
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleCancelReservation(reservation.id)
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  } catch (error) {
                    console.error("Error rendering reservation:", error);
                    return null;
                  }
                })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;