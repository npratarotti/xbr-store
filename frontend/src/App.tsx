import { Header } from "./shared/components/layout/Header";
import { Hero } from "./shared/components/sections/Hero";
import { FeaturedProducts } from "./shared/components/sections/FeaturedProducts";
import { Categories } from "./shared/components/sections/Categories";
import { Benefits } from "./shared/components/sections/Benefits";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <Benefits />
      </main>
    </div>
  );
}

export default App;