"use client";

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

import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

import { FaCalendarCheck, FaHome, FaSignOutAlt } from "react-icons/fa";

interface KindeUser {
  given_name?: string | null;
  family_name?: string | null;
  email?: string | null;
  picture?: string | null;
}

const Dropdown = ({ user }: { user: KindeUser | null }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          {/* FIXED: Avatar with better error handling */}
          <Avatar>
            <AvatarImage
              src={user?.picture ?? undefined}
              alt={`${user?.given_name} ${user?.family_name}`}
            />
            <AvatarFallback className="bg-orange-700 text-white">
              {user?.given_name?.[0] || ''}
              {user?.family_name?.[0] || ''}
            </AvatarFallback>
          </Avatar>

          {/* FIXED: Name and email with better layout */}
          <div className="flex flex-col">
            <div className="flex gap-1 font-bold">
              <p>{user?.given_name}</p>
              <p>{user?.family_name}</p>
            </div>
            <p className="text-sm font-semibold text-gray-600">{user?.email}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 mt-4 p-4 flex flex-col gap-2 bg-white"
        align="start"
      >
        <DropdownMenuLabel>My Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/">
            <DropdownMenuItem className="hover:bg-amber-50">
              Homepage
              <DropdownMenuShortcut className="text-lg text-orange-500">
                <FaHome />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard">
            <DropdownMenuItem className="hover:bg-amber-50">
              My Bookings
              <DropdownMenuShortcut className="text-lg text-orange-500">
                <FaCalendarCheck />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutLink>
          <DropdownMenuItem className="text-red-600 hover:bg-amber-50">
            Log out
            <DropdownMenuShortcut className="text-lg text-orange-500">
              <FaSignOutAlt />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </LogoutLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
