import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const socials = [
  {
    icon: <FaYoutube />,
    href: "https://www.youtube.com/",
  },
  {
    icon: <FaFacebook />,
    href: "https://www.facebook.com/",
  },
  {
    icon: <FaInstagram />,
    href: "https://www.instagram.com/",
  },
  {
    icon: <FaTwitter />,
    href: "https://www.x.com/",
  },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 py-[40px] lg:py-[60px] text-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/TheBooker.png"
              width={160}
              height={40}
              alt="TheBooker Logo"
            />
          </Link>

          {/* Social Icons */}
          <div className="flex gap-4">
            {socials.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                target="_blank"
                className="bg-orange-600 hover:bg-orange-800 text-white text-lg w-[38px] h-[38px] flex items-center justify-center rounded-full transition-all"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} TheBooker Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
