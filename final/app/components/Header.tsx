import Link from "next/link";

export const Header = () => (
  <header className="bg-neutral-900 text-gray-100 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
    <Link href="/" className="text-xl font-bold tracking-wide hover:text-amber-400 transition-colors">
      FinalWeb
    </Link>
  </header>
);
