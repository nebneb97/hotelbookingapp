import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";

const StarRating = ({ stars, max = 5 }: { stars: number; max?: number }) => {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: max }).map((_, i) => {
        if (i < Math.floor(stars)) return <FaStar key={i} />;
        if (i < stars) return <FaStarHalf key={i} />;
        return <FaRegStar key={i} className="text-gray-300" />;
      })}
    </div>
  );
};

export default StarRating;
