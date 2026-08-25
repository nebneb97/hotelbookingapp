import Link from "next/link";
import HotelCard, { type Hotel } from "@/components/HotelCard";
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
  searchParams: Promise<{ city?: string; checkIn?: string; checkOut?: string; guests?: string }>;
}) => {
  const { city, checkIn, checkOut, guests } = await searchParams;
  const guestsNum = Number(guests) || 1;

  const { data: allHotels } = await getHotels();
  const bookedRoomIds = checkIn && checkOut ? await getBookedRoomIds(checkIn, checkOut) : [];

  const filtered = allHotels
    .map((hotel) => {
      const availableRooms = (hotel.rooms ?? []).filter((room) => {
        const hasCapacity = room.capacity >= guestsNum;
        const isAvailable = !bookedRoomIds.includes(room.id);
        return hasCapacity && (checkIn && checkOut ? isAvailable : true);
      });
      return { ...hotel, rooms: availableRooms };
    })
    .filter((hotel) => {
      const matchesCity = city
        ? hotel.city.toLowerCase().includes(city.toLowerCase())
        : true;
      const hasRooms = hotel.rooms.length > 0;
      return matchesCity && hasRooms;
    });

  const hasFilters = city || checkIn || checkOut || guests;
  const nights =
    checkIn && checkOut ? differenceInDays(parseISO(checkOut), parseISO(checkIn)) : null;

  return (
    <section className="min-h-[80vh] py-12">
      <div className="container mx-auto px-4">
        {/* Results summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {city ? `Hotels in ${city}` : "All Hotels"}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filtered.length} properties</span>
            {checkIn && checkOut && (
              <>
                <span>·</span>
                <span>
                  {format(parseISO(checkIn), "d MMM")} → {format(parseISO(checkOut), "d MMM yyyy")}
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
                Clear filters
              </Link>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-gray-700 mb-2">No hotels found</p>
            <p className="text-gray-500 mb-6">Try adjusting your search — different dates, fewer guests, or a different city.</p>
            <Link href="/hotels" className="text-orange-600 hover:underline">
              Clear all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((hotel) => (
              <HotelCard key={hotel.documentId} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelsPage;
