import Hero from "@/components/Hero";
import HotelCard, { type Hotel } from "@/components/HotelCard";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

const getHotels = async () => {
  try {
    return await api.get<{ data: Hotel[] }>(
      "/api/hotels?populate=*&sort=stars:desc",
      { cache: "no-store" } as RequestInit
    );
  } catch (err) {
    console.error('[Hotels fetch error]', err);
    return { data: [] as Hotel[] };
  }
};

const Home = async () => {
  const hotels = await getHotels();

  return (
    <main>
      <Hero />

      <section className="pt-36 lg:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">Featured Hotels</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Hand-picked properties across Kuala Lumpur — use the search above to filter by your dates and preferences.
            </p>
          </div>

          {hotels.data.length === 0 ? (
            <p className="text-center text-gray-400 py-12">
              No hotels found. Make sure the backend is running.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.data.map((hotel) => (
                <HotelCard key={hotel.documentId} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
