"use client";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

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


const Nav = ({ isUserAuthenticated }: { isUserAuthenticated: boolean}) => {
  console.log(isUserAuthenticated);
  const pathname = usePathname();
  return (
    <nav>
      <ul className="flex flex-col lg:flex-row gap-6">
        {links.map((link, index) => {
          return (
            <li key={index}>
              <Link href={link.path} className="font-bold text-[13px] uppercase tracking-[3px] hover:text-orange-600 transition-all">
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
      {/*Redirected to the homepage if the user is not authenticated and pathname is 'dashboard' */}
      {!isUserAuthenticated && pathname === "/dashboard" && redirect("/")}
    </nav>
  );
};

export default Nav;
