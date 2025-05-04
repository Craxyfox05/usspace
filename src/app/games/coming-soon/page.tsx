import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center border border-gray-100">
        <div className="text-3xl mb-4">✨ More Games Coming Soon!</div>
        <div className="text-gray-500 mb-6 text-center">We're working on more fun couple games for you!<br/>Check back later for new additions like "This or That", "Love Bingo", "Emoji Story Game", and "Would You Rather".</div>
        <Link href="/games" className="text-sm text-red-400 hover:underline">← Back to Games</Link>
      </div>
    </div>
  );
} 