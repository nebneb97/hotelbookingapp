"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { FaBars } from "react-icons/fa";

const links = [
  { name: "Home", path: "/" },
  { name: "Hotels", path: "/hotels" },
  { name: "Best Deals", path: "/deals" },
  { name: "Contact", path: "/contact" },
];

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className="text-2xl text-white flex items-center">
        <FaBars />
      </SheetTrigger>
      <SheetContent side="left" className="bg-slate-900 flex justify-center items-center">
        <nav className="flex flex-col gap-8 text-center">
          {links.map((link, index) => (
            <Link
              href={link.path}
              key={index}
              className="text-2xl text-white font-primary hover:text-orange-600"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
