export function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label={label}>
      <div className="loading-screen__spinner">
        <div className="loading-screen__ring" />
        <div className="loading-screen__icon" aria-hidden="true">
          &#8962;
        </div>
      </div>
    </div>
  );
}
