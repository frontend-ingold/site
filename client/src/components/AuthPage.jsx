import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
  const { register, login, forgotPassword } = useAuth();
  const content = authContent[route] ?? authContent.login;
  const isRegister = route === "register";
  const isForgotPassword = route === "forgot-password";
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    keepSignedIn: false,
    agreeTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function updateField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (!formState.agreeTerms) {
          throw new Error("Please accept the privacy policy and terms.");
        }

        await register({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          password: formState.password,
          confirmPassword: formState.confirmPassword
        });

        window.location.hash = "/";
        return;
      }

      if (isForgotPassword) {
        const message = await forgotPassword({
          email: formState.email
        });
        setSuccessMessage(message);
        return;
      }

      await login({
        email: formState.email,
        password: formState.password
      });

      window.location.hash = "/";
    } catch (error) {
      setErrorMessage(error.message || "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

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

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister ? (
              <div className="auth-form__split">
                <label className="auth-field">
                  <span>First name</span>
                  <input type="text" placeholder="Ava" value={formState.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
                </label>

                <label className="auth-field">
                  <span>Last name</span>
                  <input type="text" placeholder="Johnson" value={formState.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
                </label>
              </div>
            ) : null}

            <label className="auth-field">
              <span>Email address</span>
              <input type="email" placeholder="name@email.com" value={formState.email} onChange={(event) => updateField("email", event.target.value)} />
            </label>

            {isForgotPassword ? null : (
              <label className="auth-field">
                <span>Password</span>
                <input type="password" placeholder="Enter your password" value={formState.password} onChange={(event) => updateField("password", event.target.value)} />
              </label>
            )}

            {isRegister ? (
              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={formState.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                />
              </label>
            ) : null}

            {isForgotPassword ? (
              <p className="auth-helper">
                We will send a reset link to your inbox. Use a valid email address tied to your account.
              </p>
            ) : (
              <div className="auth-form__meta">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={formState.keepSignedIn}
                    onChange={(event) => updateField("keepSignedIn", event.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>

                {!isRegister ? (
                  <a href="#/forgot-password" className="auth-inline-link">
                    Forgot password?
                  </a>
                ) : null}
              </div>
            )}

            {isRegister ? (
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={formState.agreeTerms}
                  onChange={(event) => updateField("agreeTerms", event.target.checked)}
                />
                <span>I agree to the privacy policy and terms.</span>
              </label>
            ) : null}

            {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}
            {successMessage ? <p className="auth-feedback auth-feedback--success">{successMessage}</p> : null}

            <button type="submit" className="auth-submit">
              {isSubmitting ? "Please wait..." : content.submitLabel}
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
