"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    setSaved(getWishlist().includes(documentId));
  }, [documentId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = getWishlist();
    const updated = current.includes(documentId)
      ? current.filter((id) => id !== documentId)
      : [...current, documentId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(updated.includes(documentId));
  };

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm border ${
        saved
          ? "bg-red-500 border-red-500 text-white"
          : "bg-white/90 border-gray-200 text-gray-400 hover:text-red-400"
      }`}
    >
      <FaHeart className="text-sm" />
    </button>
  );
};

export default WishlistButton;
