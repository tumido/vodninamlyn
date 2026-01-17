import Link from "next/link";
import { Footer } from "./components/sections/Footer";
import Icon from "./components/ui/Icon";

export default function NotFound() {
  return (
    <div className="flex flex-col">
      <div className="hero-gradient relative flex min-h-screen flex-1 items-center justify-center">
        <div className="z-10 max-w-2xl px-6 text-center">
          <div className="mx-auto mb-8 h-48 w-48">
            <Icon icon="ufo" className="stroke-palette-beige" />
          </div>
          <div className="mb-4 text-2xl font-semibold text-amber-200/90 normal-case md:text-4xl">
            Stránka nebyla nalezena
          </div>
          <p className="text-palette-beige/70 mb-8 text-lg">
            Omlouváme se, ale stránka, kterou hledáte, neexistuje.
          </p>
          <Link
            href="/"
            className="bg-palette-green hover:bg-palette-dark-green inline-block rounded px-8 py-3 font-medium text-white transition-colors"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
