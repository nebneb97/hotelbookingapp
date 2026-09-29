import Reservation from "@/components/Reservation";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import { TbArrowsMaximize, TbUsers } from "react-icons/tb";
import { api } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await api.get<{ data: Array<{ title: string; price: number; description: string }> }>(
      `/api/rooms?filters[documentId][$eq]=${id}&populate=*`,
      { next: { revalidate: 0 } } as RequestInit
    );
    const room = res.data?.[0];
    if (!room) return { title: "Room Not Found" };
    return {
      title: `${room.title} — RM ${room.price}/night`,
      description: room.description ?? `Book ${room.title} at RM ${room.price} per night. Instant confirmation, no hidden fees.`,
    };
  } catch {
    return { title: "Room" };
  }
}

interface Room {
  id: number;
  documentId: string;
  title: string;
  price: number;
  capacity: number;
  size: string;
  description: string;
  image?: { url: string };
}

interface ReservationEntry {
  id: number;
  checkIn: string;
  checkOut: string;
  room?: { id: number };
}

const getRoomData = async (params: { id: string }) =>
  api.get<{ data: Room[] }>(
    `/api/rooms?filters[documentId][$eq]=${params.id}&populate=*`,
    { next: { revalidate: 0 } } as RequestInit
  );

const getReservationData = async () =>
  api.get<{ data: ReservationEntry[] }>(
    `/api/reservations?populate[room][populate]=*`,
    { next: { revalidate: 0 } } as RequestInit
  );

const RoomDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;

  const [roomRes, reservationRes] = await Promise.all([
    getRoomData(resolvedParams),
    getReservationData(),
  ]);

  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = (await isAuthenticated()) ?? false;
  const userData = await getUser();

  if (!roomRes.data || roomRes.data.length === 0) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Room not found</h2>
          <p className="text-gray-600">
            Sorry, the room you are looking for does not exist.
          </p>
        </div>
      </section>
    );
  }

  const room = roomRes.data[0];
  const imgURL = room.image?.url ? api.imageUrl(room.image.url) : null;

  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row lg:gap-10 h-full">
          <div className="flex-1">
            {imgURL && (
              <div className="relative h-[360px] lg:h-[420px] mb-8">
                <Image src={imgURL} fill sizes="(max-width: 1024px) 100vw, calc(100vw - 420px)" alt={room.title || "Room"} className="object-cover" />
              </div>
            )}
            <div className="flex flex-col flex-1 mb-8">
              <div className="flex justify-between items-end mb-4 gap-2">
                <h1 className="text-3xl font-bold mb-0">
                  {room.title || "Untitled Room"}
                </h1>
                <p className="text-orange-600 font-medium text-3xl">
                  {room.price ? (
                    <>
                      RM {room.price}
                      <span className="text-black text-xl">/night</span>
                    </>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div className="flex items-center gap-8 mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-orange-600 text-2xl">
                    <TbArrowsMaximize />
                  </div>
                  <p>{room.size ? `${room.size} sq ft` : "N/A"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-orange-600 text-2xl">
                    <TbUsers />
                  </div>
                  <p>{room.capacity || "N/A"} Guests</p>
                </div>
              </div>
              <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                {room.description || "No description available."}
              </p>
            </div>
          </div>

          <div className="w-full lg:max-w-[360px] space-y-6">
            <Reservation
              reservations={reservationRes}
              room={{ ...room, price: room.price }}
              isUserAuthenticated={isUserAuthenticated}
              userData={userData}
            />
            <AvailabilityCalendar roomId={room.id} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
