"use client";
import Link from "next/link";
import Image from "next/image";
import { FaStar, FaStarHalf, FaUser } from "react-icons/fa";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const RoomList = ({ rooms }: { rooms: any }) => {
  const [roomType, setRoomType] = useState("all");
  const [filteredRooms, setFilteredRooms] = useState([]);

  useEffect(() => {
    const filtered =
      rooms.data?.filter((room: any) => {
        return roomType === "all" ? true : roomType === room.type;
      }) || [];
    setFilteredRooms(filtered);
  }, [roomType, rooms]);

  console.log(filteredRooms);
  console.log("First room structure:", rooms.data?.[0]);
  console.log("First room ID:", rooms.data?.[0]?.id);
  console.log("First room documentId:", rooms.data?.[0]?.documentId);
  return (
    <section className="py-16 min-h-[90vh]">
      {/* Heading */}
      <div className="flex flex-col items-center text-center ">
        <div className="mb-6 relative w-20 h-20">
          <Image
            src="/heading-icon.svg"
            alt="Decorative icon"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight  drop-shadow-lg mb-8">
          Our Rooms
        </h1>
      </div>

      {/*Tabs*/}
      <Tabs
        defaultValue="all"
        className="w-[240px] lg:w-[540px] lg:h-auto mb-8 mx-auto"
      >
        <TabsList className="w-full h-full lg-h[46px] flex flex-col lg:flex-row">
          <TabsTrigger
            className="w-full h-full"
            value="all"
            onClick={() => setRoomType("all")}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            className="w-full h-full"
            value="single"
            onClick={() => setRoomType("single")}
          >
            Single
          </TabsTrigger>
          <TabsTrigger
            className="w-full h-full"
            value="double"
            onClick={() => setRoomType("double")}
          >
            Double
          </TabsTrigger>
          <TabsTrigger
            className="w-full h-full"
            value="extended"
            onClick={() => setRoomType("extended")}
          >
            Extended
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-4">
        {filteredRooms.map((room: any) => {
          const imgUrl = room.image?.url
            ? `http://127.0.0.1:1337${room.image.url}`
            : "/assets/Code Kid.jpg";

          return (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              {/* Image */}
              <Link href={`/room/${room.documentId}`}>
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
                  <span className="flex items-center gap-1">
                    <FaUser className="text-gray-500" /> {room.capacity} people
                  </span>
                  <div className="flex gap-1 text-accent">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalf />
                  </div>
                </div>

                <Link href={`/room/${room.id}`}>
                  <h2 className="text-lg font-bold tracking-tight text-primary hover:text-accent transition-colors">
                    {room.title}
                  </h2>
                </Link>

                <p className="text-lg font-semibold text-accent">
                  RM {room.price}{" "}
                  <span className="text-gray-500 text-sm">/night</span>
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
