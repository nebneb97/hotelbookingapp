import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="h-[70vh] lg:h-[85vh] bg-hero bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative container mx-auto h-full flex justify-center items-center pb-24 lg:pb-32 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-orange-400 font-semibold uppercase tracking-widest text-sm">
            Find your perfect stay
          </p>
          <h1 className="text-4xl lg:text-7xl font-serif text-white max-w-[900px] leading-tight">
            Experience hospitality at its finest
          </h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Discover curated hotels across Malaysia — from luxury towers to heritage retreats.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 px-4 flex justify-center z-10">
        <SearchBar />
      </div>
    </section>
  );
};

export default Hero;
