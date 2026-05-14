export function SectionHeader({ title, description, align = "left" }) {
  return (
    <div className={`section-header ${align === "center" ? "center" : ""}`}>
      <span className="section-kicker">UrbanCare Services</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
