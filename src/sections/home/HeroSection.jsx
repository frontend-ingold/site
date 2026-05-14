import { PrimaryButton } from "../../components/common/PrimaryButton";

export function HeroSection({ data }) {
  return (
    <section
      id="top"
      className="hero-section"
      style={{ backgroundImage: `linear-gradient(135deg, rgba(9, 30, 24, 0.85), rgba(13, 83, 68, 0.65)), url(${data.backgroundImage})` }}
    >
      <div className="container hero-grid">
        <div className="hero-copy panel panel-left">
          <span className="hero-eyebrow">{data.eyebrow}</span>
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          <div className="hero-actions">
            {data.buttons.map((button) => (
              <PrimaryButton key={button.label} label={button.label} variant={button.variant} />
            ))}
          </div>
          <div className="hero-contact-strip">
            <a href={`tel:${data.contact.phone.replace(/\s+/g, "")}`}>{data.contact.phone}</a>
            <a href={`https://wa.me/${data.contact.whatsapp.replace(/\D/g, "")}`}>WhatsApp</a>
          </div>
          <div className="hero-stats">
            {data.stats.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual panel panel-right">
          <img src={data.sideImage} alt="Professional home service expert" />
          <div className="hero-floating-card">
            <span>Same Day Service</span>
            <strong>Fast booking. Fast response.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
