import { useLanguage } from "../context/LanguageContext";

export function LoadingScreen({ label = "Loading..." }) {
  const { t } = useLanguage();
  const resolvedLabel = label === "Loading..." ? t("common.loading") : label;

  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label={resolvedLabel}>
      <div className="loading-screen__spinner">
        <div className="loading-screen__ring" />
        <div className="loading-screen__icon" aria-hidden="true">
          &#8962;
        </div>
      </div>
    </div>
  );
}
