import { SectionHeader } from "../../components/common/SectionHeader";

export function PricingSection({ data }) {
  return (
    <section id="pricing" className="section surface-accent">
      <div className="container">
        <SectionHeader title={data.title} description={data.description} />
        <div className="pricing-table panel panel-right">
          {data.items.map((item) => (
            <div key={item.service} className="pricing-row">
              <span>{item.service}</span>
              <strong>{item.price}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
