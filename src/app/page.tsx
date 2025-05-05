"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-white">
      {/* Decorative Doodles - new Unsplash images */}
      <Image
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80"
        alt="heart doodle"
        width={100}
        height={100}
        className="absolute top-0 left-0 w-24 opacity-10 -z-10 rounded-full"
      />
      <Image
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"
        alt="flower doodle"
        width={80}
        height={80}
        className="absolute top-10 right-0 w-20 opacity-10 -z-10 rounded-full"
      />
      <Image
        src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80"
        alt="teddy bear doodle"
        width={90}
        height={90}
        className="absolute bottom-0 left-10 w-24 opacity-10 -z-10 rounded-full"
      />
      <Image
        src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=200&q=80"
        alt="chocolate doodle"
        width={80}
        height={80}
        className="absolute bottom-5 right-5 w-20 opacity-10 -z-10 rounded-full"
      />

      {/* Main Content */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-black mb-4">
          A Special Place For Just the Two of You <span className="inline-block">💕</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl">
          Celebrate your journey, share moods, relive memories — no matter the distance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Link
            href="/signup"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition inline-block"
          >
            Start Creating 🌸
          </Link>
          <Link
            href="/login?demo=true"
            className="bg-white border border-red-500 text-red-500 hover:bg-red-50 px-8 py-4 rounded-full text-lg font-semibold transition inline-block"
          >
            Try Demo
          </Link>
        </div>
        
        {/* Partner Connection Section */}
        <div className="mt-16 max-w-xl">
          <h2 className="text-2xl font-bold mb-4">Already have an account?</h2>
          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="mb-4">Did your partner invite you to join? Accept their invitation to connect and start sharing memories.</p>
            <Link
              href="/login?invited=true"
              className="bg-red-100 text-red-700 hover:bg-red-200 px-6 py-3 rounded-full text-base font-medium transition inline-block"
            >
              I have an invitation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-5 w-full text-center text-sm text-gray-500">
        © 2025 UsSpace – Made with ❤️
      </footer>
    </div>
  );
}
