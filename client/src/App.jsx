import { useEffect, useState } from "react";
import {
  benefits,
  categories,
  editorialBanner,
  featuredProducts,
  newArrivalShowcase,
  promoBanners,
  spotlightBanner,
  testimonialsSection
} from "./data/homepage";
import { Benefits } from "./components/Benefits";
import { AuthPage } from "./components/AuthPage";
import { CategoryGrid } from "./components/CategoryGrid";
import { EditorialBanner } from "./components/EditorialBanner";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NewArrivalShowcase } from "./components/NewArrivalShowcase";
import { Newsletter } from "./components/Newsletter";
import { TestimonialsSection } from "./components/TestimonialsSection";

import { SpotlightBanner } from "./components/SpotlightBanner";

const authRoutes = new Set(["login", "register", "forgot-password"]);

function getCurrentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return authRoutes.has(hash) ? hash : "home";
}

function App() {
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getCurrentRoute());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (route !== "home") {
    return <AuthPage route={route} />;
  }

  return (
    <div className="page-shell">
      <Header />
      <main>
        <Hero />
        <CategoryGrid items={categories} />
        <NewArrivalShowcase content={newArrivalShowcase} />
        <SpotlightBanner content={spotlightBanner} />
        <FeaturedProducts items={featuredProducts} />
        <EditorialBanner content={editorialBanner} />
        <TestimonialsSection content={testimonialsSection} />
        <Benefits items={benefits} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
