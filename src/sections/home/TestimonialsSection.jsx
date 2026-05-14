import { SectionHeader } from "../../components/common/SectionHeader";

const stars = "★★★★★";

export function TestimonialsSection({ data }) {
  return (
    <section id="reviews" className="section">
      <div className="container">
        <SectionHeader title={data.title} description={data.description} align="center" />
        <div className="testimonials-grid">
          {data.items.map((item, index) => (
            <article
              key={item.name}
              className={`testimonial-card panel ${index % 2 === 0 ? "panel-left" : "panel-right"}`}
            >
              <div className="testimonial-header">
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <span>{stars.slice(0, item.rating)}</span>
                </div>
              </div>
              <p>{item.review}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
