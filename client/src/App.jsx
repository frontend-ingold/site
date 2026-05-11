import { benefits, categories, featuredProducts, promoBanners } from "./data/homepage";
import { Benefits } from "./components/Benefits";
import { CategoryGrid } from "./components/CategoryGrid";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Newsletter } from "./components/Newsletter";
import { PromoBanners } from "./components/PromoBanners";

function App() {
  return (
    <div className="page-shell">
      <Header />
      <main>
        <Hero />
        <CategoryGrid items={categories} />
        <PromoBanners items={promoBanners} />
        <FeaturedProducts items={featuredProducts} />
        <Benefits items={benefits} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
