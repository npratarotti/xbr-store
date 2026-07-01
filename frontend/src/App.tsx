import { Header } from "./shared/components/layout/Header";
import { Hero } from "./shared/components/sections/Hero";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;