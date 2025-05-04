import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-auto border-t">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold cursive">UsSpace</span>
          <span className="text-red-500">💕</span>
        </div>

        <div className="text-sm text-gray-500">
          © {currentYear} UsSpace – Made with ❤️ for couples
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/about" className="text-gray-600 hover:text-black">
            About
          </Link>
          <Link href="/terms" className="text-gray-600 hover:text-black">
            Terms
          </Link>
          <Link href="/privacy" className="text-gray-600 hover:text-black">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
