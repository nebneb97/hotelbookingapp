import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaFire } from "react-icons/fa";
import StarRating from "./StarRating";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import WishlistButton from "./WishlistButton";

export interface Hotel {
  id: number;
  documentId: string;
  name: string;
  city: string;
  address?: string;
  stars: number;
  description?: string;
  amenities?: string[];
  image?: { url: string };
  rooms?: { id: number; price: number; capacity: number }[];
}

const SCORE_LABELS: Record<string, string> = {
  exceptional: "Exceptional",
  excellent: "Excellent",
  very_good: "Very Good",
  good: "Good",
};

const getReviewScore = (hotel: Hotel) => {
  const score = parseFloat((6 + hotel.stars * 0.5 + (hotel.id % 10) * 0.1).toFixed(1));
  const label =
    score >= 9 ? "exceptional" : score >= 8 ? "excellent" : score >= 7 ? "very_good" : "good";
  return { score, label: SCORE_LABELS[label] };
};

const HotelCard = ({ hotel, nights }: { hotel: Hotel; nights?: number }) => {
  const imgUrl = hotel.image?.url ? api.imageUrl(hotel.image.url) : null;
  const roomCount = hotel.rooms?.length ?? 0;
  const minPrice = roomCount ? Math.min(...hotel.rooms!.map((r) => r.price)) : null;
  const topAmenities = hotel.amenities?.slice(0, 3) ?? [];
  const isPopular = hotel.stars >= 4;
  const isLowAvailability = roomCount > 0 && roomCount <= 2;
  const { score, label: scoreLabel } = getReviewScore(hotel);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
      {/* Image */}
      <div className="relative h-52 w-full bg-gray-100">
        <Link href={`/hotel/${hotel.documentId}`} className="block relative h-full">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={hotel.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isPopular && (
            <span className="flex items-center gap-1 bg-orange-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
              <FaFire className="text-xs" /> Popular
            </span>
          )}
        </div>

        {/* Wishlist */}
        <div className="absolute top-3 right-3">
          <WishlistButton documentId={hotel.documentId} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/hotel/${hotel.documentId}`}>
            <h2 className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors leading-tight">
              {hotel.name}
            </h2>
          </Link>
          <StarRating stars={hotel.stars} />
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <FaMapMarkerAlt className="text-orange-500 shrink-0" />
            <span>{hotel.city}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-slate-800 text-white text-xs font-bold px-2 py-0.5 rounded">
              {score}
            </span>
            <span className="text-xs text-gray-500">{scoreLabel}</span>
          </div>
        </div>

        {topAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {topAmenities.map((a) => (
              <span
                key={a}
                className="text-xs bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-full"
              >
                {a}
              </span>
            ))}
            {(hotel.amenities?.length ?? 0) > 3 && (
              <span className="text-xs text-gray-400">
                +{(hotel.amenities?.length ?? 0) - 3} more
              </span>
            )}
          </div>
        )}

        {/* Urgency signal */}
        {isLowAvailability && (
          <p className="text-xs text-red-500 font-medium mb-3">
            Only {roomCount} room{roomCount > 1 ? "s" : ""} left at this price!
          </p>
        )}

        <div className="flex items-center justify-between">
          {minPrice ? (
            <div>
              <span className="text-xs text-gray-400">from</span>
              <span className="text-orange-600 font-bold text-xl ml-1">
                RM {minPrice}
              </span>
              <span className="text-gray-400 text-xs">/night</span>
              {nights && nights > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  RM {minPrice * nights} total for {nights} night{nights > 1 ? "s" : ""}
                </p>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Check availability</span>
          )}
          <Link href={`/hotel/${hotel.documentId}`}>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              View Hotel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
