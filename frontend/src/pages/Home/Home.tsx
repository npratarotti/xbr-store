import { Hero } from "../../shared/components/sections/Hero";
import { Categories } from "../../shared/components/sections/Categories";
import { FeaturedProducts } from "../../shared/components/sections/FeaturedProducts";
import { Benefits } from "../../shared/components/sections/Benefits";
import { Newsletter } from "../../shared/components/sections/Newletter/Newsletter";
import { Footer } from "../../shared/components/sections/Footer";
import { SEO } from "../../shared/components/SEO/SEO";

export function Home() {
  return (
    <>
      <SEO
        title="Tecnologia e Acessórios Premium"
        description="XBR Store — acessórios e produtos de tecnologia premium. Películas, carregadores turbo, fones TWS e mais. Entrega rápida e segura."
        url="/"
      />

      <Hero />
      <Categories />
      <FeaturedProducts />
      <Benefits />
      <Newsletter />
      <Footer />
    </>
  );
}