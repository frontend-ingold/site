export function PromoBanners({ items }) {
  return (
    <section className="section container promo-grid">
      {items.map((item) => (
        <article className={`promo-card accent-${item.accent}`} key={item.title}>
          <p className="eyebrow">{item.eyebrow}</p>
          <h3>{item.title}</h3>
          <span>{item.description}</span>
          <a href="/" onClick={(event) => event.preventDefault()}>
            Discover now
          </a>
        </article>
      ))}
    </section>
  );
}
