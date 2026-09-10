"use client";

import { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <p className="text-green-400 font-medium text-sm">
        You&apos;re subscribed! We&apos;ll be in touch with the best deals.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        className="flex-1 px-4 py-3 rounded-lg text-sm border border-white/10 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
};

export default NewsletterForm;
