export function Newsletter() {
  return (
    <section className="section container">
      <div className="newsletter-card">
        <div>
          <p className="eyebrow">Newsletter</p>
          <h2>Join for launch edits, offers, and trend notes.</h2>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" aria-label="Email address" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
