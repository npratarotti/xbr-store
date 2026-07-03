import { Header } from "../../shared/components/layout/Header/Header";
import { Hero } from "../../shared/components/sections/Hero";
import { Categories } from "../../shared/components/sections/Categories";
import { FeaturedProducts } from "../../shared/components/sections/FeaturedProducts";
import { Benefits } from "../../shared/components/sections/Benefits";
import { Newsletter } from "../../shared/components/sections/Newletter";
import { Footer } from "../../shared/components/sections/Footer";

export function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Benefits />
      <Newsletter />
      <Footer />
    </>
  );
}