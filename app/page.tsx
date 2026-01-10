import { Hero } from './components/sections/Hero';
import { WeddingDetails } from './components/sections/WeddingDetails';
import { Schedule } from './components/sections/Schedule';
import { RSVP } from './components/sections/RSVP';
import { Footer } from './components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <WeddingDetails />
      <Schedule />
      <RSVP />
      <Footer />
    </main>
  );
}
