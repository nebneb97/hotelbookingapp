"use client";

import { useEffect } from "react";
import { trackHotelView, type RecentHotel } from "./RecentlyViewed";

const HotelViewTracker = ({ hotel }: { hotel: RecentHotel }) => {
  useEffect(() => {
    trackHotelView(hotel);
  }, [hotel]);

  return null;
};

export default HotelViewTracker;
