"use client";

import { Button } from "./ui/button";
import { format } from "date-fns";

interface Reservation {
  documentId: string;
  firstname: string;
  lastname: string;
  email: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
}

interface Room {
  title: string;
  type: string;
  capacity: number;
  size: string;
  price: number;
}

const BookingReceipt = ({ reservation, room }: { reservation: Reservation; room: Room }) => {
  const generateReceipt = () => {
    const receiptContent = `
      BOOKING RECEIPT
      ================
      
      Booking Reference: #${reservation.documentId}
      
      Guest Information:
      Name: ${reservation.firstname} ${reservation.lastname}
      Email: ${reservation.email}
      
      Room Details:
      ${room.title}
      Type: ${room.type}
      Capacity: ${room.capacity} guests
      Size: ${room.size} sq ft
      Price: RM ${room.price}/night

      Stay Details:
      Check-in: ${format(new Date(reservation.checkIn), "PPP")}
      Check-out: ${format(new Date(reservation.checkOut), "PPP")}

      Total Nights: ${Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
      Total Amount: RM ${room.price * Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
      
      Booked on: ${format(new Date(reservation.createdAt), "PPP")}
      
      Thank you for choosing The Booker!
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `booking-receipt-${reservation.documentId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={generateReceipt}>
      Download Receipt
    </Button>
  );
};

export default BookingReceipt;