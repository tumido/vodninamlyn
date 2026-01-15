import { Hero } from "./components/sections/Hero";
import { Schedule } from "./components/sections/Schedule";
import { RSVP } from "./components/sections/RSVP";
import { Footer } from "./components/sections/Footer";
import { FAQ } from "./components/sections/FAQ";
import { ThankYou } from "./components/sections/ThankYou";
import Spacer from "./components/sections/Spacer";
import { KeyInfo } from "./components/sections/KeyInfo";
import { AdditionalInfo } from "./components/sections/AdditionalInfo";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <KeyInfo />
      <Spacer />
      <AdditionalInfo />
      <Schedule />
      <FAQ />
      <RSVP />
      <ThankYou />
      <Footer />
    </main>
  );
}
