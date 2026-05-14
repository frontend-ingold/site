import { SectionHeader } from "../../components/common/SectionHeader";

export function HowItWorksSection({ data }) {
  return (
    <section className="section surface-accent">
      <div className="container">
        <SectionHeader title={data.title} description={data.description} align="center" />
        <div className="steps-grid">
          {data.steps.map((step, index) => (
            <article
              key={step.number}
              className={`step-card panel ${index % 2 === 0 ? "panel-left" : "panel-right"}`}
            >
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
