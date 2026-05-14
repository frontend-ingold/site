import { useLanguage } from "../context/LanguageContext";
import { pageMenuItems } from "../data/navigationPages";

const footerColumns = {
  shop: [
    "Women's Vintage Polka Dot",
    "Women's 34-Sleeve Skater Dress",
    "Girls Frock Dress",
    "Girls Casual Dress",
    "Baby Girls Frocks Dress",
    "Baby Girl's Bodycon Midi Dress"
  ],
  extras: ["Search", "All collections", "All products", "My Cart"],
  categories: ["Cloths", "Dress", "Hats", "Jeans", "shoes", "Sweater", "westen top", "Women Top"]
};

const socialItems = ["▶", "◉", "◎", "X"];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-layout">
        <div className="footer-brand-block">
          <p>
            {t("footer.description")}
          </p>

          <div className="footer-socials">
            {socialItems.map((item) => (
              <a href="/" key={item} onClick={(event) => event.preventDefault()} aria-label={t("footer.social", { item })}>
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-menu-column">
          <h3>{t("footer.shop")}</h3>
          {footerColumns.shop.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>

        <div className="footer-menu-column">
          <h3>{t("footer.extras")}</h3>
          {footerColumns.extras.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>

        <div className="footer-menu-column">
          <h3>{t("footer.categories")}</h3>
          {footerColumns.categories.map((item) => (
            <a href="/" key={item} onClick={(event) => event.preventDefault()}>
              {item}
            </a>
          ))}
        </div>

        <div className="footer-menu-column">
          <h3>{t("footer.quickLinks")}</h3>
          {pageMenuItems.map((item) => (
            <a href={item.href} key={item.key}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
