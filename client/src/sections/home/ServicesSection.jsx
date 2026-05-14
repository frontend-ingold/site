import { SectionHeader } from "../../components/common/SectionHeader";
import { RevealOnScroll } from "../../components/common/RevealOnScroll";

export function ServicesSection({ data }) {
  return (
    <section id="services" className="section surface-light">
      <div className="container">
        <RevealOnScroll direction="left">
          <SectionHeader title={data.title} description={data.description} align="center" />
        </RevealOnScroll>
        <div className="services-grid">
          {data.items.map((service, index) => (
            <RevealOnScroll
              key={service.name}
              as="article"
              className="service-card"
              direction={index % 2 === 0 ? "left" : "right"}
              delay={index * 90}
            >
              <img src={service.image} alt={service.name} />
              <div className="service-card-body">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <a href="#top">Learn More</a>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
