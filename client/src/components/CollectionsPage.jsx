import { useMemo } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { useLanguage } from "../context/LanguageContext";

function getDisplayImage(url) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("pexels.com")) {
      parsedUrl.searchParams.set("auto", "compress");
      parsedUrl.searchParams.set("cs", "tinysrgb");
      parsedUrl.searchParams.set("w", "1600");
      parsedUrl.searchParams.set("fit", "crop");
      return parsedUrl.toString();
    }

    return url;
  } catch {
    return url;
  }
}

export function CollectionsPage({ data, isLoading = false }) {
  const { t } = useLanguage();
  const collectionCards = useMemo(() => {
    return data.shopCards ?? [];
  }, [data.shopCards]);

  if (isLoading || collectionCards.length === 0) {
    return (
      <main className="collections-page">
        <section className="collections-page__hero">
          <div className="container">
            <LoadingScreen label={t("collections.loadingCollections")} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="collections-page">
      <section className="collections-page__hero">
        <div className="container">
          <h2>{t("collections.title")}</h2>
        </div>
      </section>

      <section className="collections-page__grid-section">
        <div className="container collections-page__grid">
          {collectionCards.map((item) => (
            <article
              className="collections-card"
              key={item.id}
              onClick={() => {
                window.location.hash = `/collections/${item.slug}`;
              }}
            >
              <div className="collections-card__media">
                <img src={getDisplayImage(item.image)} alt={item.title} />
              </div>

              <div className="collections-card__body">
                <h2>{item.title}</h2>
                <button type="button" className="collections-card__count">
                  {t("collections.itemsCount", { count: item.itemCount })}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
