import { Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Header } from "./components/layout/Header";
import { homePageData } from "./data/homeData";
import { AuthPage } from "./pages/AuthPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { HomePage } from "./pages/HomePage";
import { MyServicesPage } from "./pages/MyServicesPage";
import { ServiceDetailsPage } from "./pages/ServiceDetailsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { Footer } from "./components/layout/Footer";

function App() {
  return (
    <div className="page-shell">
      <ScrollToTop />
      <Header contact={homePageData.hero.contact} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/my-services" element={<MyServicesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
