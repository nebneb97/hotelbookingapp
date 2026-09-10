"use client";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

const links = [
  { name: "Home", path: "/" },
  { name: "Hotels", path: "/hotels" },
  { name: "Best Deals", path: "/deals" },
  { name: "Contact", path: "/contact" },
];

const Nav = ({ isUserAuthenticated }: { isUserAuthenticated: boolean }) => {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="flex flex-col lg:flex-row gap-6">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.path}
              className={`font-bold text-[13px] uppercase tracking-[3px] transition-all ${
                pathname === link.path
                  ? "text-orange-500"
                  : "hover:text-orange-600"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      {!isUserAuthenticated && pathname === "/dashboard" && redirect("/")}
    </nav>
  );
};

export default Nav;
