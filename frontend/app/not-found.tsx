import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Hotel, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">404 — Page not found</p>
        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-4">Oops.</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-orange-600 hover:bg-orange-500 text-white gap-2">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <Link href="/hotels">
            <Button variant="outline" className="gap-2">
              <Hotel className="w-4 h-4" /> Browse Hotels
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className="gap-2 text-gray-500">
              <Search className="w-4 h-4" /> Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
