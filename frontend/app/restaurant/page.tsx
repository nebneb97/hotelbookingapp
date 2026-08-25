import { FaUtensils, FaClock, FaWineGlassAlt, FaStar } from "react-icons/fa";

const highlights = [
  {
    icon: FaUtensils,
    title: "Fine Dining",
    desc: "Curated menus crafted by our award-winning executive chef",
  },
  {
    icon: FaWineGlassAlt,
    title: "Wine & Cocktails",
    desc: "Extensive cellar featuring over 200 fine wines and signature cocktails",
  },
  {
    icon: FaClock,
    title: "Opening Hours",
    desc: "Breakfast 7–10am · Lunch 12–3pm · Dinner 6–10pm",
  },
  {
    icon: FaStar,
    title: "Guest Favourite",
    desc: "Rated 4.9/5 by our guests for three consecutive years",
  },
];

const RestaurantPage = () => {
  return (
    <section className="min-h-[80vh]">
      <div className="h-[40vh] bg-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-serif mb-4">The Booker Restaurant</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            An unforgettable culinary journey at the heart of the hotel
          </p>
        </div>
      </div>

      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="text-center p-6 rounded-xl bg-orange-50 border border-orange-100"
            >
              <div className="text-orange-600 text-3xl flex justify-center mb-4">
                <Icon />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <h2 className="text-3xl font-bold mb-4">Table Reservations Coming Soon</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Online restaurant reservations will be available shortly. For now, please contact our front desk or visit us in person.
          </p>
          <p className="mt-4 text-orange-600 font-semibold">+60 3-1234 5678</p>
        </div>
      </div>
    </section>
  );
};

export default RestaurantPage;
