import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Hotels", href: "/hotels" },
  { label: "Best Deals", href: "/deals" },
  { label: "Contact", href: "/contact" },
];

const supportLinks = [
  { label: "Cancellation Policy", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "FAQs", href: "#" },
];

const socials = [
  { icon: <FaYoutube />, href: "#" },
  { icon: <FaFacebook />, href: "#" },
  { icon: <FaInstagram />, href: "#" },
  { icon: <FaTwitter />, href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/">
              <Image src="/TheBooker.png" width={140} height={40} alt="TheBooker Logo" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              A curated hotel booking platform for travellers in Kuala Lumpur. Simple, transparent, and fee-free.
            </p>
            <div className="flex gap-3 mt-1">
              {socials.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-sm w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-orange-400 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-orange-400 mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-orange-400 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MdOutlineEmail className="text-orange-500 shrink-0 text-base" />
                support@thebooker.com
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MdOutlinePhone className="text-orange-500 shrink-0 text-base" />
                +60 3-1234 5678
              </li>
              <li className="text-gray-400 text-sm mt-2 leading-relaxed">
                Available daily<br />9:00 AM – 10:00 PM MYT
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TheBooker Company. All rights reserved.</p>
          <p>Kuala Lumpur, Malaysia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
