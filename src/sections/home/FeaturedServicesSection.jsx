import { SectionHeader } from "../../components/common/SectionHeader";
import { RevealOnScroll } from "../../components/common/RevealOnScroll";

export function FeaturedServicesSection({ data }) {
  return (
    <section className="section">
      <div className="container">
        <RevealOnScroll direction="right">
          <SectionHeader title={data.title} description={data.description} />
        </RevealOnScroll>
        <div className="featured-grid">
          {data.items.map((item, index) => (
            <RevealOnScroll
              key={item.name}
              as="article"
              className="featured-card"
              direction={index % 2 === 0 ? "right" : "left"}
              delay={index * 110}
            >
              <img src={item.image} alt={item.name} />
              <div className="featured-overlay">
                <span>Popular</span>
                <h3>{item.name}</h3>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
