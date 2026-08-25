import { FaSwimmingPool, FaClock, FaChild, FaSun } from "react-icons/fa";

const features = [
  {
    icon: FaSwimmingPool,
    title: "Infinity Pool",
    desc: "25-metre heated infinity pool with panoramic city views",
  },
  {
    icon: FaSun,
    title: "Pool Deck",
    desc: "Sun loungers, private cabanas, and poolside bar service",
  },
  {
    icon: FaChild,
    title: "Kids Pool",
    desc: "Dedicated shallow pool with full-time lifeguard supervision",
  },
  {
    icon: FaClock,
    title: "Opening Hours",
    desc: "Open daily 7am – 10pm for all hotel guests",
  },
];

const PoolPage = () => {
  return (
    <section className="min-h-[80vh]">
      <div className="h-[40vh] bg-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-serif mb-4">Pool &amp; Leisure</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Relax, refresh, and recharge at our world-class pool facilities
          </p>
        </div>
      </div>

      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100"
            >
              <div className="text-blue-600 text-3xl flex justify-center mb-4">
                <Icon />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Pool Access</h2>
          <p className="text-gray-300 max-w-md mx-auto mb-6">
            Pool access is complimentary for all hotel guests. Day passes for
            non-guests are available at the front desk.
          </p>
          <p className="text-orange-400 font-semibold text-lg">
            Day Pass: RM 80 per person
          </p>
        </div>
      </div>
    </section>
  );
};

export default PoolPage;
