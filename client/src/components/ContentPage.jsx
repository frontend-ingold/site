export function ContentPage({ content }) {
  const cards = content.cards ?? [];
  const sections = content.sections ?? [];

  return (
    <main className="content-page">
      <section className="content-page__hero">
        <div className="container">
          <p className="content-page__eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className="content-page__intro">{content.intro}</p>
        </div>
      </section>

      <section className="content-page__body">
        <div className="container">
          {cards.length ? (
            <div className="content-page__card-grid">
              {cards.map((card) => (
                <article key={card.title} className="content-page__card">
                  <span>{card.meta}</span>
                  <h2>{card.title}</h2>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          ) : null}

          {sections.length ? (
            <div className="content-page__section-list">
              {sections.map((section) => (
                <article key={section.heading} className="content-page__section">
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
