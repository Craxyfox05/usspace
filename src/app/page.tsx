"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-white">
      {/* Decorative Doodles - subtle and minimalistic */}
      <Image
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80"
        alt="heart doodle"
        width={80}
        height={80}
        className="absolute top-0 left-0 w-16 opacity-5 -z-10 rounded-full"
      />
      <Image
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"
        alt="flower doodle"
        width={60}
        height={60}
        className="absolute top-10 right-0 w-14 opacity-5 -z-10 rounded-full"
      />
      <Image
        src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80"
        alt="teddy bear doodle"
        width={70}
        height={70}
        className="absolute bottom-0 left-10 w-16 opacity-5 -z-10 rounded-full"
      />
      <Image
        src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=200&q=80"
        alt="chocolate doodle"
        width={60}
        height={60}
        className="absolute bottom-5 right-5 w-14 opacity-5 -z-10 rounded-full"
      />

      {/* Main Content */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-3">
          A Special Place For Just the Two of You <span className="inline-block">💕</span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-md">
          Celebrate your journey, share moods, relive memories — no matter the distance.
        </p>
        <div className="mt-1">
          <Link
            href="/signup"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full text-base font-medium transition inline-block"
          >
            Start Creating 🌸
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-3 w-full text-center text-xs text-gray-400">
        © 2025 UsSpace – Made with ❤️
      </footer>
    </div>
  );
}
