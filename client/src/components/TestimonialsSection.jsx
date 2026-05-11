export function TestimonialsSection({ content }) {
  return (
    <section className="section testimonials-section">
      <div className="testimonials-section__media">
        <img src={content.sideImage} alt="Denim jacket product" />
      </div>

      <div className="container testimonials-section__inner">
        <h2>{content.title}</h2>

        <div className="testimonials-grid">
          {content.items.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <h3>{item.name}</h3>
              <p className="testimonial-card__role">{item.role}</p>
              <div className="testimonial-card__media">
                <img src={item.image} alt={item.name} />
              </div>
              <p className="testimonial-card__rating">
                <span>★★★★★</span>
                <strong>{item.rating}</strong>
                <em>/ {item.maxRating}</em>
              </p>
              <p className="testimonial-card__review">{item.review}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
