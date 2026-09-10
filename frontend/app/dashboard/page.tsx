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
import { BedDouble, CalendarDays, Hotel, ArrowRight, PhoneCall } from "lucide-react";

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

const STATUS_STYLES = {
  upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
  active: "bg-green-50 text-green-700 border border-green-200",
  completed: "bg-gray-100 text-gray-500 border border-gray-200",
};

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const [userReservations, setUserReservations] = useState<{ data: Reservation[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await getUserReservations(user.email);
      setUserReservations(data);
    } catch {
      setAlertMessage({ message: "Failed to load your reservations. Please try again.", type: "error" });
    }
  }, [user?.email]);

  useEffect(() => {
    const load = async () => {
      if (isLoading) return;
      if (!isAuthenticated || !user?.email) { setLoading(false); return; }
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
      setAlertMessage({ message: "Your reservation has been successfully cancelled.", type: "success" });
      await fetchReservations();
    } catch {
      setAlertMessage({ message: "Failed to cancel reservation. Please try again.", type: "error" });
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
      <section className="min-h-[80vh]">
        <div className="bg-slate-900 h-36 animate-pulse" />
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !user?.email) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Please log in to view your bookings.</p>
          <Link href="/api/auth/login">
            <Button className="bg-orange-600 hover:bg-orange-700">Sign In</Button>
          </Link>
        </div>
      </section>
    );
  }

  const reservations = (userReservations?.data ?? []).filter((r) => r?.checkIn && r?.checkOut);
  const upcoming = reservations.filter((r) => getReservationStatus(new Date(r.checkIn), new Date(r.checkOut)) === "upcoming");
  const completed = reservations.filter((r) => getReservationStatus(new Date(r.checkIn), new Date(r.checkOut)) === "completed");
  const totalNights = completed.reduce((acc, r) => {
    const nights = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return acc + nights;
  }, 0);

  const firstName = user.given_name ?? user.email.split("@")[0];
  const initials = `${user.given_name?.[0] ?? ""}${user.family_name?.[0] ?? ""}`.toUpperCase() || user.email[0].toUpperCase();

  return (
    <section className="min-h-[80vh] bg-gray-50">

      {/* Welcome banner */}
      <div className="bg-slate-900 py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-0.5">Welcome back</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{firstName}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{upcoming.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Upcoming</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{completed.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Completed</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{totalNights}</p>
              <p className="text-xs text-gray-400 mt-0.5">Nights stayed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {alertMessage && (
          <div className="mb-6">
            <AlertMessage message={alertMessage.message} type={alertMessage.type} />
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h2>

        {reservations.length === 0 ? (
          <div className="space-y-6">
            {/* Empty state */}
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BedDouble className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                You haven&apos;t made any reservations yet. Browse our hotels and find your perfect stay in Kuala Lumpur.
              </p>
              <Link href="/hotels">
                <Button className="bg-orange-600 hover:bg-orange-500 text-white gap-2">
                  Browse Hotels <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Quick action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <Link href="/hotels" className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-orange-200 transition-all group">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <Hotel className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Browse Hotels</p>
                  <p className="text-xs text-gray-500 mt-0.5">Find your next stay</p>
                </div>
              </Link>
              <Link href="/hotels?checkIn=&checkOut=" className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-orange-200 transition-all group">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <CalendarDays className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Check Availability</p>
                  <p className="text-xs text-gray-500 mt-0.5">Search by date</p>
                </div>
              </Link>
              <Link href="/contact" className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-orange-200 transition-all group">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <PhoneCall className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Contact Us</p>
                  <p className="text-xs text-gray-500 mt-0.5">We&apos;re here to help</p>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => {
              const checkInDate = new Date(reservation.checkIn);
              const checkOutDate = new Date(reservation.checkOut);
              if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return null;

              const room = reservation.room;
              const status = getReservationStatus(checkInDate, checkOutDate);
              const canCancel = canCancelReservation(checkInDate);
              const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={reservation.documentId} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  {room?.image?.url ? (
                    <div className="h-44 relative shrink-0">
                      <Image src={api.imageUrl(room.image.url)} alt={room.title || "Room"} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
                        {status === "upcoming" ? "Upcoming" : status === "active" ? "Active" : "Completed"}
                      </span>
                    </div>
                  ) : (
                    <div className="h-20 bg-orange-50 flex items-center justify-center shrink-0">
                      <BedDouble className="w-8 h-8 text-orange-300" />
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h4 className="font-bold text-gray-900 text-base leading-tight">{room?.title || "Room"}</h4>
                      {!room?.image?.url && (
                        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
                          {status === "upcoming" ? "Upcoming" : status === "active" ? "Active" : "Completed"}
                        </span>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 mb-3">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Check-in</p>
                        <p className="text-sm font-bold text-gray-900">{format(checkInDate, "d MMM")}</p>
                        <p className="text-[10px] text-gray-400">{format(checkInDate, "yyyy")}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full h-px bg-gray-200 relative">
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 bg-gray-50 px-1">
                            {nights}n
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Check-out</p>
                        <p className="text-sm font-bold text-gray-900">{format(checkOutDate, "d MMM")}</p>
                        <p className="text-[10px] text-gray-400">{format(checkOutDate, "yyyy")}</p>
                      </div>
                    </div>

                    {/* Guest + total */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-500">{reservation.firstname} {reservation.lastname}</span>
                      {room?.price && (
                        <span className="font-bold text-orange-600">RM {room.price * nights}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-100">
                      {room?.documentId && (
                        <Link href={`/room/${room.documentId}`}>
                          <Button variant="outline" size="sm" className="text-xs">View Room</Button>
                        </Link>
                      )}
                      {status !== "completed" && room && (
                        <BookingReceipt reservation={reservation} room={room} />
                      )}
                      {canCancel && status === "upcoming" && user?.email && (
                        <EditReservation reservation={reservation} userEmail={user.email} onSuccess={fetchReservations} />
                      )}
                      {canCancel && status === "upcoming" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="text-xs" disabled={cancellingId === reservation.documentId}>
                              {cancellingId === reservation.documentId ? "Cancelling..." : "Cancel"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel this reservation?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently cancel your reservation for {room?.title || "this room"}. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Dismiss</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancelReservation(reservation.documentId)} className="bg-red-600 hover:bg-red-700">
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
    </section>
  );
};

export default Dashboard;
