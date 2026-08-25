"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isPast, isAfter } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const SearchBar = () => {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    params.set("guests", String(guests));
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 flex flex-col lg:flex-row gap-3 items-end w-full max-w-4xl">
      {/* City */}
      <div className="flex-1 space-y-1 w-full">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Destination</p>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Where are you going?"
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="flex-1 space-y-1 w-full">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Check-in</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-gray-200 text-sm",
                !checkIn && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
              {checkIn ? format(checkIn, "dd MMM yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white shadow-lg z-50">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={(date) => {
                setCheckIn(date);
                if (checkOut && date && !isAfter(checkOut, date)) setCheckOut(undefined);
              }}
              disabled={isPast}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Check-out */}
      <div className="flex-1 space-y-1 w-full">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Check-out</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-gray-200 text-sm",
                !checkOut && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
              {checkOut ? format(checkOut, "dd MMM yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white shadow-lg z-50">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => isPast(date) || (checkIn ? date <= checkIn : false)}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Guests */}
      <div className="space-y-1 w-full lg:w-36">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Guests</p>
        <div className="relative">
          <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white appearance-none"
          >
            {GUEST_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="bg-orange-600 hover:bg-orange-700 text-white px-8 w-full lg:w-auto shrink-0"
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
