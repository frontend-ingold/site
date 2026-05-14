import { SectionHeader } from "../../components/common/SectionHeader";

export function GallerySection({ data }) {
  return (
    <section className="section surface-light">
      <div className="container">
        <SectionHeader title={data.title} description={data.description} align="center" />
        <div className="gallery-grid">
          {data.items.map((item, index) => (
            <article
              key={item.title}
              className={`gallery-card panel ${index % 2 === 0 ? "panel-left" : "panel-right"}`}
            >
              <div className="gallery-images">
                <div>
                  <span>Before</span>
                  <img src={item.before} alt={`${item.title} before`} />
                </div>
                <div>
                  <span>After</span>
                  <img src={item.after} alt={`${item.title} after`} />
                </div>
              </div>
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
