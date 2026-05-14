import { SectionHeader } from "../../components/common/SectionHeader";
import { RevealOnScroll } from "../../components/common/RevealOnScroll";

export function WhyChooseSection({ data }) {
  return (
    <section className="section">
      <div className="container two-column-grid">
        <RevealOnScroll className="image-panel" direction="left">
          <img src={data.image} alt="Home service team working professionally" />
        </RevealOnScroll>
        <RevealOnScroll className="copy-panel" direction="right" delay={120}>
          <SectionHeader title={data.title} description={data.description} />
          <div className="feature-list">
            {data.items.map((item, index) => (
              <RevealOnScroll
                key={item}
                className="feature-item"
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 70}
              >
                <span className="feature-icon">✓</span>
                <p>{item}</p>
              </RevealOnScroll>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
