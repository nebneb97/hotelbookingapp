import Link from "next/link";
import RoomsList from "./RoomList";
import { api } from "@/lib/api";
import { format, parseISO, differenceInDays } from "date-fns";

interface Room {
  id: number;
  documentId: string;
  title: string;
  type: string;
  price: number;
  capacity: number;
  image?: { url: string };
}

const getRooms = async () => {
  try {
    return await api.get<{ data: Room[] }>(`/api/rooms?populate=*`, {
      cache: "no-store",
    } as RequestInit);
  } catch {
    return { data: [] as Room[] };
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

const Rooms = async ({
  checkIn,
  checkOut,
}: {
  checkIn?: string;
  checkOut?: string;
}) => {
  const rooms = await getRooms();

  let displayRooms = rooms;
  if (checkIn && checkOut) {
    const bookedIds = await getBookedRoomIds(checkIn, checkOut);
    displayRooms = { data: rooms.data.filter((r) => !bookedIds.includes(r.id)) };
  }

  const searchSummary =
    checkIn && checkOut
      ? {
          formattedIn: format(parseISO(checkIn), "d MMM yyyy"),
          formattedOut: format(parseISO(checkOut), "d MMM yyyy"),
          nights: differenceInDays(parseISO(checkOut), parseISO(checkIn)),
          count: displayRooms.data.length,
        }
      : null;

  return (
    <section>
      <div className="container mx-auto">
        {searchSummary && (
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="inline-flex flex-wrap justify-center items-center gap-x-3 gap-y-1 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-sm text-sm">
              <span className="font-semibold text-gray-800">
                {searchSummary.count}{" "}
                {searchSummary.count === 1 ? "room" : "rooms"} available
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-600">
                {searchSummary.formattedIn} → {searchSummary.formattedOut}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-600">
                {searchSummary.nights}{" "}
                {searchSummary.nights === 1 ? "night" : "nights"}
              </span>
              <span className="text-gray-300">·</span>
              <Link href="/" className="text-orange-600 hover:underline font-medium">
                Clear
              </Link>
            </div>
            {searchSummary.count === 0 && (
              <p className="text-red-600 text-sm font-medium">
                No rooms available for these dates. Try different dates.
              </p>
            )}
          </div>
        )}
        <RoomsList rooms={displayRooms} />
      </div>
    </section>
  );
};

export default Rooms;
