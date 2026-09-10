"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FaStar } from "react-icons/fa";

const STAR_OPTIONS = [5, 4, 3, 2, 1];

const SORT_OPTIONS = [
  { label: "Stars: High to Low", value: "stars_desc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const HotelFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedStars = searchParams.get("stars")?.split(",").map(Number) ?? [];
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort = searchParams.get("sort") ?? "stars_desc";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/hotels?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleStar = (star: number) => {
    const current = searchParams.get("stars")?.split(",").map(Number) ?? [];
    const updated = current.includes(star)
      ? current.filter((s) => s !== star)
      : [...current, star];
    updateParam("stars", updated.join(","));
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["stars", "minPrice", "maxPrice", "sort"].forEach((k) => params.delete(k));
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Filters</h3>
          <button onClick={clearAll} className="text-xs text-orange-600 hover:underline">
            Clear all
          </button>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Sort by</p>
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            {SORT_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Star rating */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Star Rating</p>
          <div className="space-y-2.5">
            {STAR_OPTIONS.map((star) => (
              <label key={star} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedStars.includes(star)}
                  onChange={() => toggleStar(star)}
                  className="accent-orange-600 w-4 h-4"
                />
                <div className="flex gap-0.5">
                  {Array.from({ length: star }).map((_, i) => (
                    <FaStar key={i} className="text-orange-400 text-xs" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  {star} star{star > 1 ? "s" : ""}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Price per Night (RM)
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              min={0}
              onChange={(e) => updateParam("minPrice", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              min={0}
              onChange={(e) => updateParam("maxPrice", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HotelFilters;
