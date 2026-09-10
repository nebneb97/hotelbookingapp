import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "./ui/button";
import Dropdown from "./Dropdown";
import MobileNav from "./MobileNav";
import Nav from "./Nav";

const socials = [
  { icon: <FaYoutube />, href: "#" },
  { icon: <FaFacebook />, href: "#" },
  { icon: <FaInstagram />, href: "#" },
  { icon: <FaTwitter />, href: "#" },
];

const Header = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = (await isAuthenticated()) ?? false;
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Left — logo + separator + socials */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/">
              <Image
                src="/TheBooker.png"
                width={130}
                height={40}
                alt="TheBooker"
                priority
                style={{ width: "130px", height: "auto" }}
              />
            </Link>
            <div className="w-px h-8 bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex gap-1.5">
              {socials.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="bg-orange-500 hover:bg-orange-400 text-white text-xs w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Center — desktop nav */}
          <div className="hidden xl:flex flex-1 justify-center">
            <Nav isUserAuthenticated={isUserAuthenticated} />
          </div>

          {/* Right — auth + mobile nav */}
          <div className="flex items-center gap-3 shrink-0">
            {isUserAuthenticated ? (
              <Dropdown user={user} />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <LoginLink>
                  <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10 text-sm">
                    Sign In
                  </Button>
                </LoginLink>
                <RegisterLink>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white text-sm">
                    Register
                  </Button>
                </RegisterLink>
              </div>
            )}
            <div className="xl:hidden">
              <MobileNav />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
