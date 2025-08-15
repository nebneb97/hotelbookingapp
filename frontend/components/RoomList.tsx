"use client";
import Link from "next/link";
import Image from "next/image";
import { FaStar, FaStarHalf } from "react-icons/fa";

const RoomList = ({ rooms }: { rooms: any }) => {
  return (
    <section className="container py-16">
      {/* Heading */}
      <div className="flex flex-col items-center text-center pb-10">
        <div className="mb-4 relative w-12 h-12">
          <Image
            src="/heading-icon.svg"
            alt="Decorative icon"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Our Rooms
        </h1>
      </div>
      <div className="h-12"></div>
      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-4">
        {rooms.data.map((room: any) => {
          const imgUrl = room.image?.url
            ? `http://127.0.0.1:1337${room.image.url}`
            : "/assets/Code Kid.jpg";

          return (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <Link href={`/room/${room.id}`}>
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={imgUrl}
                    alt={room.title || "Room image"}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="p-4 flex flex-col justify-between h-[180px]">
                <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                  <span>Capacity: {room.capacity} people</span>
                  <div className="flex gap-1 text-accent">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalf />
                  </div>
                </div>

                <Link href={`/room/${room.id}`}>
                  <h2 className="text-lg font-semibold text-primary hover:text-accent transition-colors">
                    {room.title}
                  </h2>
                </Link>

                <p className="text-md font-medium text-accent">
                  {room.price}
                  <span className="text-gray-500"> /night</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RoomList;
