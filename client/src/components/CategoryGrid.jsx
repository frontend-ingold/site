export function CategoryGrid({ items }) {
  return (
    <section className="section container">
      <div className="section-heading">
        <p className="eyebrow">Shop by category</p>
        <h2>Built for multiple fashion segments.</h2>
      </div>

      <div className="category-grid">
        {items.map((item) => (
          <article className={`category-card accent-${item.accent}`} key={item.title}>
            <p>{item.title}</p>
            <span>{item.subtitle}</span>
            <a href="/" onClick={(event) => event.preventDefault()}>
              Browse now
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
