import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { FaTag } from "react-icons/fa";

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
    <section className="min-h-[80vh] py-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FaTag /> Limited Time Offer
          </div>
          <h1 className="text-4xl font-bold mb-4">Best Deals</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Enjoy exclusive discounts on our finest rooms. Book now and save 15% on your stay.
          </p>
        </div>

        {rooms.data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No deals available at the moment. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.data.map((room) => {
              const discountedPrice = Math.round(room.price * (1 - DISCOUNT));
              const imgUrl = room.image?.url ? api.imageUrl(room.image.url) : null;
              return (
                <div
                  key={room.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    {imgUrl ? (
                      <Image src={imgUrl} alt={room.title} fill className="object-cover" />
                    ) : (
                      <div className="h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      15% OFF
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1">{room.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 capitalize">
                      {room.type} · {room.capacity} guests
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-gray-400 line-through text-sm">RM {room.price}</span>
                      <span className="text-orange-600 font-bold text-xl">RM {discountedPrice}</span>
                      <span className="text-gray-500 text-sm">/night</span>
                    </div>
                    <Link href={`/room/${room.documentId}`}>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Book This Deal
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsPage;
