import { Header } from "./shared/components/layout/Header";
import { Hero } from "./shared/components/sections/Hero";
import { FeaturedProducts } from "./shared/components/sections/FeaturedProducts";
import { Categories } from "./shared/components/sections/Categories";
import { Benefits } from "./shared/components/sections/Benefits";
import { Newsletter } from "./shared/components/sections/Newletter";
import { Footer } from "./shared/components/sections/Footer";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <Benefits />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}

export default App;