export function Benefits({ items }) {
  return (
    <section className="section container benefits-grid">
      {items.map((item) => (
        <article className="benefit-card" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </section>
  );
}
