import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import StarRating from "./StarRating";
import { Button } from "./ui/button";
import { api } from "@/lib/api";

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

const HotelCard = ({ hotel }: { hotel: Hotel }) => {
  const imgUrl = hotel.image?.url ? api.imageUrl(hotel.image.url) : null;
  const minPrice = hotel.rooms?.length
    ? Math.min(...hotel.rooms.map((r) => r.price))
    : null;
  const topAmenities = hotel.amenities?.slice(0, 3) ?? [];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
      <Link href={`/hotel/${hotel.documentId}`}>
        <div className="relative h-52 w-full bg-gray-100">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={hotel.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/hotel/${hotel.documentId}`}>
            <h2 className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors leading-tight">
              {hotel.name}
            </h2>
          </Link>
          <StarRating stars={hotel.stars} />
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <FaMapMarkerAlt className="text-orange-500 shrink-0" />
          <span>{hotel.city}</span>
        </div>

        {topAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
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

        <div className="flex items-center justify-between">
          {minPrice ? (
            <div>
              <span className="text-xs text-gray-400">from</span>
              <span className="text-orange-600 font-bold text-xl ml-1">
                RM {minPrice}
              </span>
              <span className="text-gray-400 text-xs">/night</span>
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
