import { useEffect, useState } from "react";
import {
  benefits,
  spotlightBanner,
  testimonialsSection
} from "./data/homepage";
import { Benefits } from "./components/Benefits";
import { AuthPage } from "./components/AuthPage";
import { CartDrawer } from "./components/CartDrawer";
import { CartPage } from "./components/CartPage";
import { CategoryGrid } from "./components/CategoryGrid";
import { CheckoutPage } from "./components/CheckoutPage";
import { CollectionProductListPage } from "./components/CollectionProductListPage";
import { CollectionProductDetailPage } from "./components/CollectionProductDetailPage";
import { CollectionsPage } from "./components/CollectionsPage";
import { EditorialBanner } from "./components/EditorialBanner";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LoadingScreen } from "./components/LoadingScreen";
import { NewArrivalShowcase } from "./components/NewArrivalShowcase";
import { Newsletter } from "./components/Newsletter";
import { OrderSuccessPage } from "./components/OrderSuccessPage";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { TrackOrderPage } from "./components/TrackOrderPage";

import { SpotlightBanner } from "./components/SpotlightBanner";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const authRoutes = new Set(["login", "register", "forgot-password"]);
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5000" : "https://clothsapi.vercel.app");

const defaultHomepageSections = {
  newArrivalShowcase: {
    feature: {
      title: "",
      description: "",
      buttonLabel: "SHOP NOW",
      image: ""
    },
    tabs: [],
    title: "Fashion That Reflects Who You Are",
    description: "",
    sideImage: "",
    products: []
  },
  featuredProducts: [],
  editorialBanner: {
    title: "The World is Your Fashion Oyster",
    description: "",
    backgroundImage: "",
    products: []
  }
};

function getCurrentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (authRoutes.has(hash)) {
    return hash;
  }

  if (hash === "collections") {
    return "collections";
  }

  if (hash === "cart") {
    return "cart";
  }

  if (hash === "checkout") {
    return "checkout";
  }

  if (/^order-success\/[^/]+$/.test(hash)) {
    return "order-success";
  }

  if (hash === "track-order" || /^track-order\/[^/]+$/.test(hash)) {
    return "track-order";
  }

  if (/^collections\/[^/]+\/products\/[^/]+$/.test(hash)) {
    return "product-detail";
  }

  if (hash.startsWith("collections/")) {
    return "collection-detail";
  }

  return "home";
}

function getCurrentHashPath() {
  return window.location.hash.replace(/^#\/?/, "");
}

function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const [hashPath, setHashPath] = useState(getCurrentHashPath);
  const [categoryShowcase, setCategoryShowcase] = useState({
    title: "Categories",
    ctaLabel: "SHOP NOW",
    moreLabel: "Check More",
    categories: [],
    products: []
  });
  const [categoryMenu, setCategoryMenu] = useState({
    groups: [],
    shopCards: []
  });
  const [isHomepageSectionsLoading, setIsHomepageSectionsLoading] = useState(true);
  const [isCategoryShowcaseLoading, setIsCategoryShowcaseLoading] = useState(true);
  const [isCategoryMenuLoading, setIsCategoryMenuLoading] = useState(true);
  const [homepageSections, setHomepageSections] = useState(defaultHomepageSections);
  const [collectionDetail, setCollectionDetail] = useState({
    collection: null,
    products: []
  });
  const [isCollectionDetailLoading, setIsCollectionDetailLoading] = useState(false);
  const [productDetail, setProductDetail] = useState({
    collection: null,
    product: null,
    reviews: [],
    reviewSummary: {
      averageRating: 0,
      reviewCount: 0
    },
    relatedProducts: [],
    recentProducts: []
  });

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getCurrentRoute());
      setHashPath(getCurrentHashPath());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadHomepageSections() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/homepage-sections`);
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setHomepageSections({
            newArrivalShowcase: data.newArrivalShowcase ?? defaultHomepageSections.newArrivalShowcase,
            featuredProducts: data.featuredProducts ?? [],
            editorialBanner: data.editorialBanner ?? defaultHomepageSections.editorialBanner
          });
        }
      } catch (error) {
        console.error("Failed to load homepage sections", error);
      } finally {
        if (isMounted) {
          setIsHomepageSectionsLoading(false);
        }
      }
    }

    loadHomepageSections();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryShowcase() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/category-showcase`);
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setCategoryShowcase(data);
        }
      } catch (error) {
        console.error("Failed to load category showcase", error);
      } finally {
        if (isMounted) {
          setIsCategoryShowcaseLoading(false);
        }
      }
    }

    loadCategoryShowcase();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryMenu() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/category-menu`);
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setCategoryMenu({
            groups: data.groups ?? [],
            shopCards: data.shopCards ?? []
          });
        }
      } catch (error) {
        console.error("Failed to load category menu", error);
      } finally {
        if (isMounted) {
          setIsCategoryMenuLoading(false);
        }
      }
    }

    loadCategoryMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!hashPath.startsWith("collections/") || /^collections\/[^/]+\/products\/[^/]+$/.test(hashPath)) {
      if (isMounted) {
        setCollectionDetail({
          collection: null,
          products: []
        });
        setIsCollectionDetailLoading(false);
      }

      return () => {
        isMounted = false;
      };
    }

    const slug = hashPath.replace(/^collections\//, "");
    setIsCollectionDetailLoading(true);

    async function loadCollectionDetail() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/collections/${slug}`);
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setCollectionDetail({
            collection: data.collection ?? null,
            products: data.products ?? []
          });
        }
      } catch (error) {
        console.error("Failed to load collection detail", error);
      } finally {
        if (isMounted) {
          setIsCollectionDetailLoading(false);
        }
      }
    }

    loadCollectionDetail();

    return () => {
      isMounted = false;
    };
  }, [hashPath]);

  useEffect(() => {
    let isMounted = true;
    const productMatch = hashPath.match(/^collections\/([^/]+)\/products\/([^/]+)$/);

    if (!productMatch) {
      if (isMounted) {
        setProductDetail({
          collection: null,
          product: null,
          reviews: [],
          reviewSummary: {
            averageRating: 0,
            reviewCount: 0
          },
          relatedProducts: [],
          recentProducts: []
        });
      }

      return () => {
        isMounted = false;
      };
    }

    const [, slug, productId] = productMatch;

    async function loadProductDetail() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/collections/${slug}/products/${productId}`);
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setProductDetail({
            collection: data.collection ?? null,
            product: data.product ?? null,
            reviews: data.reviews ?? [],
            reviewSummary: data.reviewSummary ?? {
              averageRating: 0,
              reviewCount: 0
            },
            relatedProducts: data.relatedProducts ?? [],
            recentProducts: data.recentProducts ?? []
          });
        }
      } catch (error) {
        console.error("Failed to load product detail", error);
      }
    }

    loadProductDetail();

    return () => {
      isMounted = false;
    };
  }, [hashPath]);

  const isHomeLoading = isHomepageSectionsLoading || isCategoryShowcaseLoading || isCategoryMenuLoading;
  const isProductDetailLoading = route === "product-detail" && productDetail.product === null;
  const isCollectionsLoading = route === "collections" && isCategoryMenuLoading;
  const isRouteLoading =
    (route === "home" && isHomeLoading) ||
    (route === "collections" && isCollectionsLoading) ||
    (route === "collection-detail" && isCollectionDetailLoading) ||
    (route === "product-detail" && isProductDetailLoading);
  const shouldShowHeader = !isRouteLoading && route !== "home" && !authRoutes.has(route);
  const shouldShowFooter = !isRouteLoading && !authRoutes.has(route);

  let pageContent = null;

  if (route === "home") {
    pageContent = isHomeLoading ? (
      <main>
        <LoadingScreen label="Loading home page" />
      </main>
    ) : (
      <>
        <Header />
        <main>
          <Hero />
          <CategoryGrid items={categoryShowcase} />
          <NewArrivalShowcase content={homepageSections.newArrivalShowcase} />
          <SpotlightBanner content={spotlightBanner} />
          <FeaturedProducts items={homepageSections.featuredProducts} />
          <EditorialBanner content={homepageSections.editorialBanner} />
          <TestimonialsSection content={testimonialsSection} />
          <Benefits items={benefits} />
          <Newsletter />
        </main>
      </>
    );
  } else if (route === "collections") {
    pageContent = isCollectionsLoading ? (
      <CollectionsPage data={categoryMenu} isLoading />
    ) : (
      <CollectionsPage data={categoryMenu} isLoading={false} />
    );
  } else if (route === "collection-detail") {
    pageContent = isCollectionDetailLoading ? (
      <CollectionProductListPage data={collectionDetail} isLoading />
    ) : (
      <CollectionProductListPage data={collectionDetail} isLoading={false} />
    );
  } else if (route === "product-detail") {
    pageContent = isProductDetailLoading ? (
      <CollectionProductDetailPage data={productDetail} homepageContent={homepageSections} isLoading />
    ) : (
      <CollectionProductDetailPage data={productDetail} homepageContent={homepageSections} isLoading={false} />
    );
  } else if (route === "cart") {
    pageContent = <CartPage />;
  } else if (route === "checkout") {
    pageContent = <CheckoutPage apiBaseUrl={apiBaseUrl} />;
  } else if (route === "order-success") {
    pageContent = <OrderSuccessPage apiBaseUrl={apiBaseUrl} hashPath={hashPath} />;
  } else if (route === "track-order") {
    pageContent = <TrackOrderPage apiBaseUrl={apiBaseUrl} hashPath={hashPath} />;
  } else {
    pageContent = <AuthPage route={route} />;
  }

  return (
    <AuthProvider apiBaseUrl={apiBaseUrl}>
      <CartProvider>
        <div className={`page-shell ${isRouteLoading ? "page-shell--loading" : ""}`}>
          {shouldShowHeader ? <Header alwaysSolid={route !== "home"} /> : null}
          {pageContent}
          {shouldShowFooter ? <Footer /> : null}
          {!authRoutes.has(route) ? <CartDrawer /> : null}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
