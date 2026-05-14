import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export function AuthPage({ route }) {
  const { register, login, forgotPassword } = useAuth();
  const { t } = useLanguage();
  const authContent = {
    login: {
      eyebrow: t("auth.welcomeBack"),
      title: t("auth.loginTitle"),
      description: t("auth.loginDescription"),
      submitLabel: t("auth.loginSubmit"),
      secondaryPrompt: t("auth.newHere"),
      secondaryLabel: t("auth.createAccount"),
      secondaryHref: "#/register"
    },
    register: {
      eyebrow: t("auth.createAccountEyebrow"),
      title: t("auth.createAccountTitle"),
      description: t("auth.createAccountDescription"),
      submitLabel: t("auth.createAccountSubmit"),
      secondaryPrompt: t("auth.alreadyHaveAccount"),
      secondaryLabel: t("auth.loginSubmit"),
      secondaryHref: "#/login"
    },
    "forgot-password": {
      eyebrow: t("auth.passwordReset"),
      title: t("auth.recoverAccount"),
      description: t("auth.recoverDescription"),
      submitLabel: t("auth.sendReset"),
      secondaryPrompt: t("auth.rememberedIt"),
      secondaryLabel: t("auth.backToLogin"),
      secondaryHref: "#/login"
    }
  };
  const highlights = [t("auth.highlight1"), t("auth.highlight2"), t("auth.highlight3")];
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
            <p className="auth-panel__eyebrow">{t("auth.privateAccess")}</p>
            <h2>{t("auth.styleSaved")}</h2>
            <p>
              {t("auth.authIntro")}
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
                  <span>{t("auth.firstName")}</span>
                  <input type="text" placeholder={t("auth.placeholderFirstName")} value={formState.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
                </label>

                <label className="auth-field">
                  <span>{t("auth.lastName")}</span>
                  <input type="text" placeholder={t("auth.placeholderLastName")} value={formState.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
                </label>
              </div>
            ) : null}

            <label className="auth-field">
              <span>{t("auth.emailAddress")}</span>
              <input type="email" placeholder={t("auth.placeholderEmail")} value={formState.email} onChange={(event) => updateField("email", event.target.value)} />
            </label>

            {isForgotPassword ? null : (
              <label className="auth-field">
                <span>{t("auth.password")}</span>
                <input type="password" placeholder={t("auth.placeholderPassword")} value={formState.password} onChange={(event) => updateField("password", event.target.value)} />
              </label>
            )}

            {isRegister ? (
              <label className="auth-field">
                <span>{t("auth.confirmPassword")}</span>
                <input
                  type="password"
                  placeholder={t("auth.placeholderConfirmPassword")}
                  value={formState.confirmPassword}
                  onChange={(event) => updateField("confirmPassword", event.target.value)}
                />
              </label>
            ) : null}

            {isForgotPassword ? (
              <p className="auth-helper">
                {t("auth.forgotHelper")}
              </p>
            ) : (
              <div className="auth-form__meta">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={formState.keepSignedIn}
                    onChange={(event) => updateField("keepSignedIn", event.target.checked)}
                  />
                  <span>{t("auth.keepSignedIn")}</span>
                </label>

                {!isRegister ? (
                  <a href="#/forgot-password" className="auth-inline-link">
                    {t("auth.forgotPassword")}
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
                <span>{t("auth.agreeTerms")}</span>
              </label>
            ) : null}

            {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}
            {successMessage ? <p className="auth-feedback auth-feedback--success">{successMessage}</p> : null}

            <button type="submit" className="auth-submit">
              {isSubmitting ? t("auth.pleaseWait") : content.submitLabel}
              <span>&raquo;</span>
            </button>

            <div className="auth-divider">
              <span>{t("auth.continueWith")}</span>
            </div>

            <div className="auth-socials">
              <button type="button">{t("auth.google")}</button>
              <button type="button">{t("auth.apple")}</button>
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
