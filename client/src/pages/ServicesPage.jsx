import { homePageData } from "../data/homeData";
import { SectionHeader } from "../components/common/SectionHeader";
import { RevealOnScroll } from "../components/common/RevealOnScroll";
import { PrimaryButton } from "../components/common/PrimaryButton";

export function ServicesPage() {
  const { services } = homePageData;

  return (
    <div className="services-page">
      <section className="page-hero">
        <div className="container page-hero-grid">
          <RevealOnScroll className="page-hero-copy" direction="left">
            <span className="hero-eyebrow">Professional Home Assistance</span>
            <h1>Complete Services For Modern Homes</h1>
            <p>
              Explore our full service catalog for repairs, installation, cleaning, maintenance,
              and emergency support delivered by verified professionals.
            </p>
            <div className="hero-actions">
              <PrimaryButton label="Book a Service" variant="primary" />
              <PrimaryButton label="Get Free Quote" variant="secondary" />
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="page-hero-visual" direction="right" delay={120}>
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
              alt="Home service technician assisting customer"
            />
          </RevealOnScroll>
        </div>
      </section>

      <section className="section surface-light">
        <div className="container">
          <RevealOnScroll direction="left">
            <SectionHeader
              title={services.title}
              description="Choose from our most-requested categories and expand later into detailed service pages."
              align="center"
            />
          </RevealOnScroll>

          <div className="services-list-grid">
            {services.items.map((service, index) => (
              <RevealOnScroll
                key={service.name}
                as="article"
                className="service-list-card"
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 90}
              >
                <div className="service-list-image">
                  <img src={service.image} alt={service.name} />
                </div>
                <div className="service-list-content">
                  <span className="service-chip">Expert Service</span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-list-actions">
                    <PrimaryButton label="Book Now" variant="primary" />
                    <a href="tel:+919876543210" className="service-inline-link">
                      Call For Booking
                    </a>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="service-cta-banner">
            <RevealOnScroll direction="left">
              <div>
                <span className="section-kicker">Need quick support?</span>
                <h2>Same day service available in selected cities</h2>
                <p>
                  Fast response for urgent plumbing, electrical, AC, and appliance issues.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={100}>
              <div className="service-cta-actions">
                <PrimaryButton label="Request Callback" variant="primary" />
                <PrimaryButton label="WhatsApp Us" variant="ghost" href="https://wa.me/919876543210" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
}
