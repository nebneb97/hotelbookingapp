import type { Metadata } from "next";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "TheBooker — Hotel Booking in Kuala Lumpur",
  description: "Discover and book handpicked hotels across Kuala Lumpur. Transparent pricing, instant confirmation, zero hidden fees.",
};
import HotelCard, { type Hotel } from "@/components/HotelCard";
import RecentlyViewed from "@/components/RecentlyViewed";
import NewsletterForm from "@/components/NewsletterForm";
import { api } from "@/lib/api";
import { Search, BedDouble, CalendarCheck, Map, Eye, Tag, FileCheck } from "lucide-react";

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

const STEPS = [
  { icon: Search, label: "Search", desc: "Enter your destination, dates, and number of guests." },
  { icon: BedDouble, label: "Choose your room", desc: "Browse available rooms and pick the one that suits you." },
  { icon: CalendarCheck, label: "Book instantly", desc: "Confirm your reservation in seconds — no hidden fees." },
];

const TRUST = [
  { icon: Map, label: "Carefully selected properties", desc: "Each hotel is personally reviewed for quality and consistency. No inflated listings, no outdated information." },
  { icon: Eye, label: "No account required to browse", desc: "Explore all available rooms and check live availability before signing in. Book only when you're ready." },
  { icon: Tag, label: "Transparent pricing, always", desc: "The rate displayed is the rate you pay. No resort fees or service charges added at checkout." },
  { icon: FileCheck, label: "Clear cancellation policies", desc: "Cancellation terms are shown clearly on every room page before you commit to a booking." },
];

const STATS = [
  { value: "5", label: "Hotels" },
  { value: "16", label: "Rooms" },
  { value: "Kuala Lumpur", label: "Focused" },
  { value: "0", label: "Hidden fees" },
];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    location: "Singapore",
    rating: 5,
    text: "Booked The Pinnacle KL through this app and had a flawless experience. The room was exactly as described and check-in was seamless.",
  },
  {
    name: "Amir R.",
    location: "Kuala Lumpur",
    rating: 5,
    text: "Finally a booking platform that doesn't throw hidden fees at you. The price I saw was the price I paid. Will use again without hesitation.",
  },
  {
    name: "Priya M.",
    location: "Johor Bahru",
    rating: 4,
    text: "The search filters are straightforward and the availability calendar on the room page saved me a lot of unnecessary back and forth.",
  },
];

const Home = async () => {
  const hotels = await getHotels();

  return (
    <main>
      <Hero />

      {/* Stats bar */}
      <section className="border-b border-gray-100 pt-16 lg:pt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-6">
                <span className="text-3xl font-bold text-orange-600">{value}</span>
                <span className="text-sm text-gray-500 mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured hotels */}
      <section className="pt-16 pb-16">
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

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How it works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Book your perfect stay in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {STEPS.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="flex flex-col items-center text-center">
                <div className="relative w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-orange-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why book with us */}
      <section className="bg-orange-50 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-3">Built for KL travellers</h2>
            <p className="text-gray-600 max-w-md mx-auto">We don&apos;t list 50,000 hotels worldwide. We know Kuala Lumpur.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TRUST.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{label}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">What guests say</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Real experiences from travellers who have booked through our platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map(({ name, location, rating, text }) => (
              <div key={name} className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rating ? "text-orange-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-gray-400">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Recently viewed */}
      <RecentlyViewed />

      {/* Newsletter */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-3">Get exclusive deals</h2>
          <p className="text-gray-400 mb-8">
            Subscribe and be the first to hear about limited-time offers and new hotels in Kuala Lumpur.
          </p>
          <NewsletterForm />
          <p className="text-gray-500 text-xs mt-4">No spam. Unsubscribe at any time.</p>
        </div>
      </section>
    </main>
  );
};

export default Home;
