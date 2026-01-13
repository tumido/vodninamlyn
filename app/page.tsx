import { Hero } from "./components/sections/Hero";
import { WeddingDetails } from "./components/sections/WeddingDetails";
import { Schedule } from "./components/sections/Schedule";
import { RSVP } from "./components/sections/RSVP";
import { Footer } from "./components/sections/Footer";
import { GeneralInfo } from "./components/sections/GeneralInfo";
import Spacer from "./components/sections/Spacer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      {/* <WeddingDetails /> */}
      <GeneralInfo />
      <Spacer />
      <Schedule />
      <RSVP />
      <Footer />
    </main>
  );
}
