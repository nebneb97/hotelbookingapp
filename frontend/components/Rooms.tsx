import RoomsList from "./RoomList";
import { api } from "@/lib/api";

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

const Rooms = async () => {
  const rooms = await getRooms();
  return (
    <section>
      <div className="container mx-auto">
        <RoomsList rooms={rooms} />
      </div>
    </section>
  );
};

export default Rooms;
