import { SectionHeader } from "../../components/common/SectionHeader";
import { RevealOnScroll } from "../../components/common/RevealOnScroll";

export function AboutSection({ data }) {
  return (
    <section id="about" className="section surface-light">
      <div className="container two-column-grid">
        <RevealOnScroll className="copy-panel" direction="left">
          <SectionHeader title={data.title} description={data.description} />
          <p className="about-mission">{data.mission}</p>
          <div className="stats-grid">
            {data.stats.map((item, index) => (
              <RevealOnScroll
                key={item.label}
                className="stat-card"
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 90}
              >
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </RevealOnScroll>
            ))}
          </div>
        </RevealOnScroll>
        <RevealOnScroll className="image-panel" direction="right" delay={140}>
          <img src={data.image} alt="About UrbanCare home services company" />
        </RevealOnScroll>
      </div>
    </section>
  );
}
