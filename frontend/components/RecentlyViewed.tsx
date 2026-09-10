"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import { api } from "@/lib/api";

const STORAGE_KEY = "thebooker_recently_viewed";

export interface RecentHotel {
  documentId: string;
  name: string;
  city: string;
  stars: number;
  minPrice: number | null;
  imageUrl: string | null;
}

export const trackHotelView = (hotel: RecentHotel) => {
  try {
    const existing: RecentHotel[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    );
    const updated = [
      hotel,
      ...existing.filter((h) => h.documentId !== hotel.documentId),
    ].slice(0, 4);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
};

const RecentlyViewed = () => {
  const [hotels, setHotels] = useState<RecentHotel[]>([]);

  useEffect(() => {
    try {
      const stored: RecentHotel[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
      );
      setHotels(stored);
    } catch {}
  }, []);

  if (hotels.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hotels.map((hotel) => (
            <Link
              key={hotel.documentId}
              href={`/hotel/${hotel.documentId}`}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-28 bg-gray-100">
                {hotel.imageUrl ? (
                  <Image
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-900 leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                  {hotel.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <FaMapMarkerAlt className="text-orange-400 shrink-0" />
                  {hotel.city}
                </div>
                {hotel.minPrice && (
                  <p className="text-xs text-orange-600 font-semibold mt-1">
                    from RM {hotel.minPrice}/night
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
