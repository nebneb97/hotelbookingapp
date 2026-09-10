import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { FaTag } from "react-icons/fa";
import { Clock } from "lucide-react";

export const dynamic = "force-dynamic";

interface Room {
  id: number;
  documentId: string;
  title: string;
  type: string;
  price: number;
  capacity: number;
  image?: { url: string };
}

const DISCOUNT = 0.15;

const getDeals = async () => {
  try {
    return await api.get<{ data: Room[] }>("/api/rooms?populate=*", {
      cache: "no-store",
    } as RequestInit);
  } catch {
    return { data: [] as Room[] };
  }
};

const DealsPage = async () => {
  const rooms = await getDeals();

  return (
    <section className="min-h-[80vh]">

      {/* Hero banner */}
      <div className="bg-slate-900 py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
          <FaTag className="text-xs" /> Limited Time
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Best Deals</h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Exclusive discounts on our finest rooms in Kuala Lumpur. Book now and save 15% on your stay.
        </p>
        <div className="flex items-center justify-center gap-2 mt-5 text-orange-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>Offers valid while availability lasts</span>
        </div>
      </div>

      {/* Savings bar */}
      <div className="bg-orange-600">
        <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3 text-white text-sm font-medium">
          <FaTag />
          <span>All rooms below are 15% off — no code needed. Discount applied at checkout.</span>
        </div>
      </div>

      {/* Room grid */}
      <div className="container mx-auto px-4 py-14">
        {rooms.data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-gray-700 mb-2">No deals right now</p>
            <p className="text-gray-500 mb-6">Check back soon — new offers are added regularly.</p>
            <Link href="/hotels">
              <Button className="bg-orange-600 hover:bg-orange-500">Browse All Hotels</Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-800">{rooms.data.length} deals</span> available
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.data.map((room) => {
                const discountedPrice = Math.round(room.price * (1 - DISCOUNT));
                const imgUrl = room.image?.url ? api.imageUrl(room.image.url) : null;
                return (
                  <div
                    key={room.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <div className="relative h-48">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={room.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                          No image
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        15% OFF
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-1 text-gray-900">{room.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 capitalize">
                        {room.type} · Up to {room.capacity} guest{room.capacity !== 1 ? "s" : ""}
                      </p>
                      <div className="flex items-end gap-2 mb-5">
                        <span className="text-gray-400 line-through text-sm">RM {room.price}</span>
                        <span className="text-orange-600 font-bold text-2xl">RM {discountedPrice}</span>
                        <span className="text-gray-400 text-sm mb-0.5">/night</span>
                      </div>
                      <Link href={`/room/${room.documentId}`}>
                        <Button className="w-full bg-orange-600 hover:bg-orange-500 text-white">
                          Book This Deal
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DealsPage;
