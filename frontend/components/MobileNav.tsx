"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Link from "next/link";
import path from "path";
import { FaBars } from "react-icons/fa";

const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Restaurant",
    path: "/",
  },
  {
    name: "Pool",
    path: "/",
  },
  {
    name: "Best Deals",
    path: "/",
  },
  {
    name: "Contact",
    path: "/",
  },
];

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className="text-2xl text-black flex items-center">
        <FaBars />
      </SheetTrigger>
      <SheetContent side="left" className="bg-white flex justify-center items-center">
        <nav className="flex flex-col gap-8 text-center">
          {links.map((link, index) => {
            return (
              <Link
                href={link.path}
                key={index}
                className="text-2xl font-primary hover:text-orange-600"
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
