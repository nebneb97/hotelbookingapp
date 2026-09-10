import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Hotels in Kuala Lumpur",
  description: "Browse all available hotels in Kuala Lumpur. Filter by dates, guests, star rating and price. Book instantly with no hidden fees.",
};
import HotelCard, { type Hotel } from "@/components/HotelCard";
import HotelFilters from "@/components/HotelFilters";
import SearchBar from "@/components/SearchBar";
import { api } from "@/lib/api";
import { format, parseISO, differenceInDays } from "date-fns";

export const dynamic = "force-dynamic";

const getHotels = async () => {
  try {
    return await api.get<{ data: Hotel[] }>(
      "/api/hotels?populate=*&sort=stars:desc",
      { cache: "no-store" } as RequestInit
    );
  } catch {
    return { data: [] as Hotel[] };
  }
};

const getBookedRoomIds = async (checkIn: string, checkOut: string): Promise<number[]> => {
  try {
    const res = await api.get<{ data: Array<{ room?: { id: number } }> }>(
      `/api/reservations?filters[checkIn][$lte]=${checkOut}&filters[checkOut][$gte]=${checkIn}&populate[room][fields][0]=id`,
      { cache: "no-store" } as RequestInit
    );
    return res.data
      .map((r) => r.room?.id)
      .filter((id): id is number => id !== undefined);
  } catch {
    return [];
  }
};

const HotelsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    stars?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) => {
  const { city, checkIn, checkOut, guests, stars, minPrice, maxPrice, sort } =
    await searchParams;

  const guestsNum = Number(guests) || 1;
  const selectedStars = stars?.split(",").map(Number).filter(Boolean) ?? [];
  const min = minPrice ? Number(minPrice) : null;
  const max = maxPrice ? Number(maxPrice) : null;

  const { data: allHotels } = await getHotels();
  const bookedRoomIds =
    checkIn && checkOut ? await getBookedRoomIds(checkIn, checkOut) : [];

  let filtered = allHotels
    .map((hotel) => {
      const availableRooms = (hotel.rooms ?? []).filter((room) => {
        const hasCapacity = room.capacity >= guestsNum;
        const isAvailable = !bookedRoomIds.includes(room.id);
        const aboveMin = min !== null ? room.price >= min : true;
        const belowMax = max !== null ? room.price <= max : true;
        return hasCapacity && aboveMin && belowMax && (checkIn && checkOut ? isAvailable : true);
      });
      return { ...hotel, rooms: availableRooms };
    })
    .filter((hotel) => {
      const matchesCity = city
        ? hotel.city.toLowerCase().includes(city.toLowerCase())
        : true;
      const matchesStars =
        selectedStars.length > 0 ? selectedStars.includes(hotel.stars) : true;
      const hasRooms = hotel.rooms.length > 0;
      return matchesCity && matchesStars && hasRooms;
    });

  // Sort
  if (sort === "price_asc") {
    filtered.sort((a, b) => {
      const aMin = Math.min(...(a.rooms ?? []).map((r) => r.price));
      const bMin = Math.min(...(b.rooms ?? []).map((r) => r.price));
      return aMin - bMin;
    });
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => {
      const aMin = Math.min(...(a.rooms ?? []).map((r) => r.price));
      const bMin = Math.min(...(b.rooms ?? []).map((r) => r.price));
      return bMin - aMin;
    });
  }

  const hasFilters = city || checkIn || checkOut || guests || stars || minPrice || maxPrice;
  const nights =
    checkIn && checkOut
      ? differenceInDays(parseISO(checkOut), parseISO(checkIn))
      : null;

  return (
    <section className="min-h-[80vh]">
      {/* Search bar */}
      <div className="bg-slate-900 py-8">
        <div className="container mx-auto px-4 flex justify-center">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Results summary */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {city ? `Hotels in ${city}` : "All Hotels"}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filtered.length} properties</span>
            {checkIn && checkOut && (
              <>
                <span>·</span>
                <span>
                  {format(parseISO(checkIn), "d MMM")} →{" "}
                  {format(parseISO(checkOut), "d MMM yyyy")}
                </span>
                {nights && (
                  <>
                    <span>·</span>
                    <span>{nights} {nights === 1 ? "night" : "nights"}</span>
                  </>
                )}
              </>
            )}
            {guests && (
              <>
                <span>·</span>
                <span>{guestsNum} {guestsNum === 1 ? "guest" : "guests"}</span>
              </>
            )}
            {hasFilters && (
              <Link href="/hotels" className="text-orange-600 hover:underline ml-2">
                Clear all filters
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Suspense fallback={null}>
            <HotelFilters />
          </Suspense>

          {/* Results */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-semibold text-gray-700 mb-2">No hotels found</p>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters — different dates, fewer guests, or a broader price range.
                </p>
                <Link href="/hotels" className="text-orange-600 hover:underline">
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((hotel) => (
                  <HotelCard key={hotel.documentId} hotel={hotel} nights={nights ?? undefined} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelsPage;
