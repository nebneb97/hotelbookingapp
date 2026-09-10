import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { TbArrowsMaximize, TbUsers } from "react-icons/tb";
import StarRating from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import HotelViewTracker from "@/components/HotelViewTracker";

interface Room {
  id: number;
  documentId: string;
  title: string;
  type: string;
  price: number;
  capacity: number;
  size: string;
  description: string;
  image?: { url: string };
}

interface Hotel {
  id: number;
  documentId: string;
  name: string;
  city: string;
  address?: string;
  stars: number;
  description?: string;
  amenities?: string[];
  image?: { url: string };
  rooms?: Room[];
}

const getHotel = async (id: string) => {
  try {
    const res = await api.get<{ data: Hotel[] }>(
      `/api/hotels?filters[documentId][$eq]=${id}&populate[rooms][populate]=*&populate[image]=*`,
      { cache: "no-store" } as RequestInit
    );
    return res.data?.[0] ?? null;
  } catch {
    return null;
  }
};

const HotelDetailPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) => {
  const { id } = await params;
  const { checkIn, checkOut, guests } = await searchParams;
  const guestsNum = Number(guests) || 1;

  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = (await isAuthenticated()) ?? false;

  const hotel = await getHotel(id);
  if (!hotel) notFound();

  const imgUrl = hotel.image?.url ? api.imageUrl(hotel.image.url) : null;
  const rooms = hotel.rooms ?? [];

  const minPrice = rooms.length ? Math.min(...rooms.map((r) => r.price)) : null;

  return (
    <section className="min-h-[80vh] pb-16">
      <HotelViewTracker hotel={{
        documentId: hotel.documentId,
        name: hotel.name,
        city: hotel.city,
        stars: hotel.stars,
        minPrice,
        imageUrl: imgUrl,
      }} />
      {/* Hotel hero image */}
      <div className="relative h-72 lg:h-[420px] w-full bg-gray-200">
        {imgUrl ? (
          <Image src={imgUrl} alt={hotel.name} fill className="object-cover" />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">No image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 container mx-auto px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <StarRating stars={hotel.stars} />
              <h1 className="text-3xl lg:text-5xl font-bold text-white mt-1">{hotel.name}</h1>
              <div className="flex items-center gap-1 text-gray-300 mt-1">
                <FaMapMarkerAlt className="text-orange-400" />
                <span className="text-sm">{hotel.address ?? hotel.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left — hotel info */}
          <div className="flex-1">
            {hotel.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">About this hotel</h2>
                <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              </div>
            )}

            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                      <FaCheckCircle className="text-orange-500 shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — sticky booking widget */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 sticky top-24">
              <p className="text-sm text-gray-500 mb-1">Rooms from</p>
              {rooms.length > 0 ? (
                <p className="text-3xl font-bold text-orange-600 mb-1">
                  RM {Math.min(...rooms.map((r) => r.price))}
                  <span className="text-base font-normal text-gray-500">/night</span>
                </p>
              ) : (
                <p className="text-gray-400 mb-4">No rooms available</p>
              )}
              <p className="text-xs text-gray-500 mb-4">
                {checkIn && checkOut
                  ? `Showing availability for your selected dates`
                  : `Select dates below to check availability`}
              </p>
              {rooms.length > 0 && (
                <a
                  href="#rooms"
                  className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mb-4"
                >
                  View Rooms
                </a>
              )}
              <div className="border-t border-orange-200 pt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FaCheckCircle className="text-green-500 shrink-0" />
                  Free cancellation available
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FaCheckCircle className="text-green-500 shrink-0" />
                  No credit card required to browse
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FaCheckCircle className="text-green-500 shrink-0" />
                  Instant confirmation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div id="rooms" className="mt-8">
          <h2 className="text-2xl font-bold mb-6">
            {rooms.length > 0 ? `Available Rooms (${rooms.length})` : "Rooms"}
          </h2>

          {rooms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 mb-2">No rooms match your current filters.</p>
              <Link href={`/hotel/${hotel.documentId}`} className="text-orange-600 hover:underline text-sm">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const roomImg = room.image?.url ? api.imageUrl(room.image.url) : null;
                const meetsCapacity = room.capacity >= guestsNum;
                return (
                  <div
                    key={room.documentId}
                    className={`bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                      !meetsCapacity ? "opacity-60" : ""
                    }`}
                  >
                    {roomImg ? (
                      <div className="relative h-40">
                        <Image src={roomImg} alt={room.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{room.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        {room.size && (
                          <span className="flex items-center gap-1">
                            <TbArrowsMaximize /> {room.size} m²
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <TbUsers /> {room.capacity} guests
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{room.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-600 font-bold">RM {room.price}<span className="text-gray-400 font-normal text-xs">/night</span></span>
                        {meetsCapacity ? (
                          isUserAuthenticated ? (
                            <Link href={`/room/${room.documentId}`}>
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Book</Button>
                            </Link>
                          ) : (
                            <Link href="/api/auth/login">
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Sign in to book</Button>
                            </Link>
                          )
                        ) : (
                          <span className="text-xs text-red-500">Not enough capacity</span>
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

export default HotelDetailPage;
