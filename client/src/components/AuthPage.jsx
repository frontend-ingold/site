const authContent = {
  login: {
    eyebrow: "Welcome back",
    title: "Sign in to your fashion account",
    description:
      "Access saved edits, checkout faster, and keep track of your latest orders in one polished space.",
    submitLabel: "Log In",
    secondaryPrompt: "New here?",
    secondaryLabel: "Create account",
    secondaryHref: "#/register"
  },
  register: {
    eyebrow: "Create account",
    title: "Join the Vogue edit",
    description:
      "Build your profile to save favorites, unlock early offers, and move through checkout with less friction.",
    submitLabel: "Create Account",
    secondaryPrompt: "Already have an account?",
    secondaryLabel: "Log in",
    secondaryHref: "#/login"
  },
  "forgot-password": {
    eyebrow: "Password reset",
    title: "Recover your account",
    description:
      "Enter the email linked to your account and we will send a secure reset link so you can get back in quickly.",
    submitLabel: "Send Reset Link",
    secondaryPrompt: "Remembered it?",
    secondaryLabel: "Back to login",
    secondaryHref: "#/login"
  }
};

const highlights = [
  "Curated style picks saved to your account",
  "Fast checkout for your next order",
  "Launch offers and seasonal member drops"
];

export function AuthPage({ route }) {
  const content = authContent[route] ?? authContent.login;
  const isRegister = route === "register";
  const isForgotPassword = route === "forgot-password";

  return (
    <main className="auth-shell">
      <section className="auth-layout">
        <aside className="auth-panel">
          <a href="#/" className="auth-home-link">
            VOGUE
          </a>

          <div className="auth-panel__copy">
            <p className="auth-panel__eyebrow">Private Fashion Access</p>
            <h2>Style, saved beautifully.</h2>
            <p>
              A refined account space for shopping, wishlists, order tracking, and exclusive fashion
              updates.
            </p>
          </div>

          <div className="auth-panel__stack" aria-hidden="true">
            <div className="auth-panel__card auth-panel__card--large" />
            <div className="auth-panel__card auth-panel__card--medium" />
            <div className="auth-panel__card auth-panel__card--small" />
          </div>

          <ul className="auth-highlights">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>

        <section className="auth-card">
          <div className="auth-card__intro">
            <p className="auth-card__eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p>{content.description}</p>
          </div>

          <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
            {isRegister ? (
              <div className="auth-form__split">
                <label className="auth-field">
                  <span>First name</span>
                  <input type="text" placeholder="Ava" />
                </label>

                <label className="auth-field">
                  <span>Last name</span>
                  <input type="text" placeholder="Johnson" />
                </label>
              </div>
            ) : null}

            <label className="auth-field">
              <span>Email address</span>
              <input type="email" placeholder="name@email.com" />
            </label>

            {isForgotPassword ? null : (
              <label className="auth-field">
                <span>Password</span>
                <input type="password" placeholder="Enter your password" />
              </label>
            )}

            {isRegister ? (
              <label className="auth-field">
                <span>Confirm password</span>
                <input type="password" placeholder="Re-enter your password" />
              </label>
            ) : null}

            {isForgotPassword ? (
              <p className="auth-helper">
                We will send a reset link to your inbox. Use a valid email address tied to your account.
              </p>
            ) : (
              <div className="auth-form__meta">
                <label className="auth-checkbox">
                  <input type="checkbox" />
                  <span>Keep me signed in</span>
                </label>

                <a href="#/forgot-password" className="auth-inline-link">
                  Forgot password?
                </a>
              </div>
            )}

            {isRegister ? (
              <label className="auth-checkbox">
                <input type="checkbox" />
                <span>I agree to the privacy policy and terms.</span>
              </label>
            ) : null}

            <button type="submit" className="auth-submit">
              {content.submitLabel}
              <span>&raquo;</span>
            </button>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="auth-socials">
              <button type="button">Google</button>
              <button type="button">Apple</button>
            </div>
          </form>

          <p className="auth-footer-link">
            {content.secondaryPrompt} <a href={content.secondaryHref}>{content.secondaryLabel}</a>
          </p>
        </section>
      </section>
    </main>
  );
}
