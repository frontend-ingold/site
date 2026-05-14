import { Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { homePageData } from "./data/homeData";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { Footer } from "./components/layout/Footer";

function App() {
  return (
    <div className="page-shell">
      <Header contact={homePageData.hero.contact} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
