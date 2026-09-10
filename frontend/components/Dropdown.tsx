"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { FaCalendarCheck, FaHome, FaSignOutAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";

interface KindeUser {
  given_name?: string | null;
  family_name?: string | null;
  email?: string | null;
  picture?: string | null;
}

const Dropdown = ({ user }: { user: KindeUser | null }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <>
      {/* Full-screen logout overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[999] bg-slate-900 flex flex-col items-center justify-center gap-5">
          <Image
            src="/TheBooker.png"
            width={160}
            height={50}
            alt="TheBooker"
            style={{ width: "160px", height: "auto" }}
          />
          <div className="flex items-center gap-2 text-white">
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
            <span className="text-sm font-medium">Signing you out…</span>
          </div>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar>
              <AvatarImage
                src={user?.picture ?? undefined}
                alt={`${user?.given_name} ${user?.family_name}`}
              />
              <AvatarFallback className="bg-orange-600 text-white font-semibold">
                {user?.given_name?.[0] ?? ""}
                {user?.family_name?.[0] ?? ""}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-bold text-white">
                {user?.given_name} {user?.family_name}
              </span>
              <span className="text-xs text-gray-400">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 mt-3 p-2 bg-white shadow-lg" align="end">
          <DropdownMenuLabel className="px-2 py-1.5">
            <p className="text-sm font-semibold text-gray-900">
              {user?.given_name} {user?.family_name}
            </p>
            <p className="text-xs text-gray-500 font-normal">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/">
              <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 rounded-md">
                Home
                <DropdownMenuShortcut>
                  <FaHome className="text-orange-500" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard">
              <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 rounded-md">
                My Bookings
                <DropdownMenuShortcut>
                  <FaCalendarCheck className="text-orange-500" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <div onClick={() => setIsLoggingOut(true)}>
            <LogoutLink>
              <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50 rounded-md focus:text-red-600">
                Sign out
                <DropdownMenuShortcut>
                  <FaSignOutAlt className="text-red-500" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </LogoutLink>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Dropdown;
