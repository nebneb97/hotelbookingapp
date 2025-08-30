import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const socials = [
  { icon: <FaYoutube />, href: "#" },
  { icon: <FaFacebook />, href: "#" },
  { icon: <FaInstagram />, href: "#" },
  { icon: <FaTwitter />, href: "#" },
];

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

//components
import { Button } from "./ui/button";
import Dropdown from "./Dropdown";
import MobileNav from "./MobileNav";
import Nav from "./Nav";

const Header = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = (await isAuthenticated()) ?? false;

  const user = await getUser();
  console.log("user from header", user);

  return (
    <header className=" py-6 shadow-md ">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          {/* logo and social icons*/}
          <div className="flex items-center gap-5 justify-between">
            {/* logo*/}
            <Link href={"/"}>
              <Image src="/logo.svg" width={160} height={160} alt="logo" />
            </Link>
            {/* seperator*/}
            <div className="w-[1px] h-[40px] bg-gray-300"></div>
            {/*socials*/}
            <div className="flex gap-2 ">
              {socials.map((item, index) => {
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className="bg-orange-500 text-white hover:bg-orange-600 text-sm w-[28px] h-[28px] flex items-center justify-center rounded-full transition-all"
                  >
                    {item.icon}
                  </Link>
                );
              })}
            </div>
          </div>
          {/*Sign In and Sign Up*/}
          <div className="flex items-center justify-center gap-8 xl:w-max">
            <div className="flex items-center gap-2 xl:order-2">
              {isUserAuthenticated ? (
                <Dropdown user={user} />
              ) : (
                <div className="flex gap-4">
                  <LoginLink>
                    <Button>Sign In</Button>
                  </LoginLink>
                  <RegisterLink>
                    <Button>Register</Button>
                  </RegisterLink>
                </div>
              )}
            </div>
            {/*Mobile Nav*/}
            <div className="xl:hidden  flex items-center">
              <MobileNav/>
            </div>
            {/*Desktop Nav*/}
            <div className="hidden xl:flex items-center">
              <Nav isUserAuthenticated={isUserAuthenticated} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
