import { useLanguage } from "../context/LanguageContext";

export function Newsletter() {
  const { t } = useLanguage();

  return (
    <section className="newsletter-section">
      <div className="container newsletter-card">
        <div className="newsletter-copy">
          <p className="eyebrow">{t("newsletter.eyebrow")}</p>
          <h2>{t("newsletter.title")}</h2>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder={t("newsletter.placeholder")} aria-label={t("newsletter.emailAddress")} />
          <button type="submit">{t("newsletter.subscribe")}</button>
        </form>
      </div>
    </section>
  );
}
