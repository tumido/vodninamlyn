import Link from "next/link";
import { Footer } from "./components/sections/Footer";

export default function NotFound() {
  return (
    <div className=" flex flex-col">
      <div className="hero-gradient min-h-screen flex-1 flex items-center justify-center relative">
        <div className="z-10 text-center px-6 max-w-2xl">
          <div className="text-6xl md:text-8xl font-bold text-palette-beige mb-6 normal-case">
            404
          </div>
          <div className="text-2xl md:text-4xl font-semibold text-amber-200/90 mb-4 normal-case">
            Stránka nebyla nalezena
          </div>
          <p className="text-lg text-palette-beige/70 mb-8">
            Omlouváme se, ale stránka, kterou hledáte, neexistuje.
          </p>
          <Link
            href="/"
            className="inline-block bg-palette-green hover:bg-palette-dark-green text-white font-medium py-3 px-8 rounded transition-colors"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
