import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { RevealOnScroll } from "../components/common/RevealOnScroll";
import { SectionHeader } from "../components/common/SectionHeader";
import { useAuth } from "../context/AuthContext";
import { serviceDetailsData } from "../data/homeData";

const stars = "*****";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const initialForm = {
  customerName: "",
  phone: "",
  address: "",
  preferredDate: "",
  issueDescription: "",
};

export function ServiceDetailsPage() {
  const { slug } = useParams();
  const { token } = useAuth();
  const service = serviceDetailsData[slug];
  const [formData, setFormData] = useState(initialForm);
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState({
      loading: true,
      error: "",
      success: "",
    });

    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          serviceSlug: service.slug,
          serviceName: service.title,
          customerName: formData.customerName,
          phone: formData.phone,
          address: formData.address,
          preferredDate: formData.preferredDate,
          issueDescription: formData.issueDescription,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed.");
      }

      setFormData(initialForm);
      setSubmitState({
        loading: false,
        error: "",
        success: `Booking created successfully. Reference ID: ${result.booking.referenceId}`,
      });
    } catch (error) {
      setSubmitState({
        loading: false,
        error: error.message || "Failed to create booking.",
        success: "",
      });
    }
  }

  return (
    <div className="service-details-page">
      <section className="service-details-hero">
        <div className="container service-details-hero-grid">
          <RevealOnScroll className="service-details-copy" direction="left">
            <span className="hero-eyebrow">Top rated doorstep service</span>
            <h1>{service.title}</h1>
            <p>{service.shortDescription}</p>
            <div className="service-rating-row">
              <span>{stars}</span>
              <strong>{service.rating}</strong>
              <small>{service.reviewsCount}</small>
            </div>
            <div className="hero-actions">
              <PrimaryButton label="Book Now" variant="primary" href="#booking-form" />
              <PrimaryButton label="Get Free Quote" variant="secondary" href="#booking-form" />
              <PrimaryButton label="Call Expert" variant="ghost" href="tel:+919876543210" />
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="service-details-image" direction="right" delay={120}>
            <img src={service.image} alt={service.title} />
          </RevealOnScroll>
        </div>
      </section>

      <section className="section">
        <div className="container service-details-layout">
          <div className="service-details-main">
            <RevealOnScroll direction="left">
              <SectionHeader title="Service Overview" description={service.overview} />
            </RevealOnScroll>

            <div className="benefits-list">
              {service.benefits.map((item, index) => (
                <RevealOnScroll
                  key={item}
                  className="benefit-chip"
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 70}
                >
                  {item}
                </RevealOnScroll>
              ))}
            </div>

            <div className="section-stack">
              <RevealOnScroll direction="left">
                <SectionHeader
                  title="What's Included"
                  description="Everything covered in the technician visit for this service."
                />
              </RevealOnScroll>
              <div className="included-grid">
                {service.included.map((item, index) => (
                  <RevealOnScroll
                    key={item}
                    className="included-card"
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 70}
                  >
                    <span className="feature-icon">+</span>
                    <p>{item}</p>
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            <div className="section-stack">
              <RevealOnScroll direction="right">
                <SectionHeader
                  title="Service Pricing / Packages"
                  description="Choose the package that best matches the level of support you need."
                />
              </RevealOnScroll>
              <div className="packages-grid">
                {service.packages.map((item, index) => (
                  <RevealOnScroll
                    key={item.name}
                    className="package-card"
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 90}
                  >
                    <span className="service-chip">{item.name}</span>
                    <h3>{item.name}</h3>
                    <p>{item.features}</p>
                    <strong>{item.price}</strong>
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            <div className="section-stack">
              <RevealOnScroll direction="left">
                <SectionHeader
                  title="Before & After"
                  description="Visual examples that help customers understand service quality and outcome."
                />
              </RevealOnScroll>
              <div className="details-gallery-grid">
                {service.gallery.map((item, index) => (
                  <RevealOnScroll
                    key={item.label}
                    className="details-gallery-card"
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 90}
                  >
                    <span>{item.label}</span>
                    <img src={item.image} alt={item.label} />
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            <div className="section-stack">
              <RevealOnScroll direction="right">
                <SectionHeader
                  title="Why Choose Our Service"
                  description="Built around trust, speed, and reliable repair standards."
                />
              </RevealOnScroll>
              <div className="included-grid">
                {service.whyChoose.map((item, index) => (
                  <RevealOnScroll
                    key={item}
                    className="included-card"
                    direction={index % 2 === 0 ? "right" : "left"}
                    delay={index * 70}
                  >
                    <span className="feature-icon">+</span>
                    <p>{item}</p>
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            <div className="section-stack">
              <RevealOnScroll direction="left">
                <SectionHeader
                  title="How the Service Works"
                  description="A simple booking-to-completion process."
                />
              </RevealOnScroll>
              <div className="process-grid">
                {service.process.map((item, index) => (
                  <RevealOnScroll
                    key={item}
                    className="process-card"
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 60}
                  >
                    <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{item}</h3>
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            <div className="section-stack">
              <RevealOnScroll className="time-banner" direction="right">
                <div>
                  <span className="section-kicker">Estimated Time</span>
                  <h3>Service Duration: {service.estimatedTime.duration}</h3>
                  <p>{service.estimatedTime.support}</p>
                </div>
              </RevealOnScroll>
            </div>

            <div className="section-stack">
              <RevealOnScroll direction="left">
                <SectionHeader
                  title="Customer Reviews"
                  description="Feedback from customers who booked this service."
                />
              </RevealOnScroll>
              <div className="details-testimonials-grid">
                {service.testimonials.map((item, index) => (
                  <RevealOnScroll
                    key={item.name}
                    className="testimonial-card"
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 90}
                  >
                    <div className="testimonial-header">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <h3>{item.name}</h3>
                        <span>{stars.slice(0, item.rating)}</span>
                      </div>
                    </div>
                    <p>{item.review}</p>
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            <div className="section-stack">
              <RevealOnScroll direction="right">
                <SectionHeader
                  title="FAQs"
                  description="Answers to the questions customers ask most often before booking."
                />
              </RevealOnScroll>
              <div className="faq-list">
                {service.faqs.map((item, index) => (
                  <RevealOnScroll
                    key={item.question}
                    className="faq-card"
                    direction={index % 2 === 0 ? "right" : "left"}
                    delay={index * 60}
                  >
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            <div className="section-stack">
              <RevealOnScroll direction="left">
                <SectionHeader
                  title="Service Areas"
                  description={`Available in ${service.areas.join(", ")}.`}
                />
              </RevealOnScroll>
            </div>

            <div className="section-stack">
              <RevealOnScroll className="service-cta-banner" direction="right">
                <div>
                  <span className="section-kicker">Emergency Support</span>
                  <h2>Need urgent repair? Call now for emergency support.</h2>
                  <p>Quick response for sudden service requests and urgent home issues.</p>
                </div>
                <div className="service-cta-actions">
                  <PrimaryButton label="Call Now" variant="primary" href="tel:+919876543210" />
                  <PrimaryButton label="WhatsApp Now" variant="ghost" href="https://wa.me/919876543210" />
                </div>
              </RevealOnScroll>
            </div>

            <div className="section-stack">
              <RevealOnScroll direction="left">
                <SectionHeader
                  title="Related Services"
                  description="Customers exploring this service often compare these options too."
                />
              </RevealOnScroll>
              <div className="related-services-grid">
                {service.relatedServices.map((item, index) => (
                  <RevealOnScroll
                    key={item.name}
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 70}
                  >
                    <Link className="related-service-card" to={item.href}>
                      <span className="service-chip">Related</span>
                      <h3>{item.name}</h3>
                    </Link>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>

          <RevealOnScroll className="booking-sidebar" direction="right" delay={120}>
            <div className="booking-card" id="booking-form">
              <span className="service-chip">Book This Service</span>
              <h3>{service.title}</h3>
              <form className="booking-form" onSubmit={handleSubmit}>
                <input
                  name="customerName"
                  type="text"
                  placeholder="Your Name"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  name="address"
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                <input
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleChange}
                />
                <textarea
                  name="issueDescription"
                  rows="4"
                  placeholder="Describe your issue"
                  value={formData.issueDescription}
                  onChange={handleChange}
                />
                {submitState.error ? <p className="form-message error">{submitState.error}</p> : null}
                {submitState.success ? <p className="form-message success">{submitState.success}</p> : null}
                <button type="submit" className="button button-primary" disabled={submitState.loading}>
                  {submitState.loading ? "Booking..." : "Book Service"}
                </button>
                <a className="button button-secondary" href="https://wa.me/919876543210">
                  WhatsApp Now
                </a>
              </form>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <div className="mobile-sticky-cta">
        <a href="tel:+919876543210" className="button button-secondary">
          Call Expert
        </a>
        <a href="#booking-form" className="button button-primary">
          Book Service
        </a>
      </div>
    </div>
  );
}
