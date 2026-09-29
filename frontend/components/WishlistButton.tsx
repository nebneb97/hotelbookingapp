"use client";

import { useState, useEffect, useRef } from "react";
import { FaHeart } from "react-icons/fa";

const STORAGE_KEY = "thebooker_wishlist";

const getWishlist = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const WishlistButton = ({ documentId }: { documentId: string }) => {
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<"saved" | "removed" | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSaved(getWishlist().includes(documentId));
  }, [documentId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const current = getWishlist();
    const isNowSaved = !current.includes(documentId);
    const updated = isNowSaved
      ? [...current, documentId]
      : current.filter((id) => id !== documentId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(isNowSaved);
    setToast(isNowSaved ? "saved" : "removed");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 1500);
  };

  return (
    <div className="relative">
      {/* Toast label */}
      {toast && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg pointer-events-none animate-fade-in">
          {toast === "saved" ? "Saved" : "Removed"}
        </div>
      )}

      <button
        onClick={toggle}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm border ${
          saved
            ? "bg-red-500 border-red-500 text-white scale-110"
            : "bg-white/90 border-gray-200 text-gray-400 hover:text-red-400"
        }`}
      >
        <FaHeart className="text-sm" />
      </button>
    </div>
  );
};

export default WishlistButton;
