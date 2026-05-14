import { useState } from "react";
import { Link } from "react-router-dom";
import { RevealOnScroll } from "../components/common/RevealOnScroll";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";

export function ForgotPasswordPage() {
  const [requestData, setRequestData] = useState({ email: "" });
  const [resetData, setResetData] = useState({ email: "", code: "", newPassword: "" });
  const [state, setState] = useState({
    loading: false,
    error: "",
    success: "",
  });

  function handleRequestChange(event) {
    setRequestData({ email: event.target.value });
    setResetData((current) => ({ ...current, email: event.target.value }));
  }

  function handleResetChange(event) {
    const { name, value } = event.target;
    setResetData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function requestResetCode(event) {
    event.preventDefault();
    setState({ loading: true, error: "", success: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestData.email }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to generate reset code.");
      }

      setState({
        loading: false,
        error: "",
        success: result.message,
      });
    } catch (error) {
      setState({
        loading: false,
        error: error.message || "Failed to generate reset code.",
        success: "",
      });
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    setState({ loading: true, error: "", success: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetData),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password.");
      }

      setState({
        loading: false,
        error: "",
        success: result.message,
      });
      setResetData({ email: requestData.email, code: "", newPassword: "" });
    } catch (error) {
      setState({
        loading: false,
        error: error.message || "Failed to reset password.",
        success: "",
      });
    }
  }

  return (
    <section className="auth-page">
      <div className="container auth-grid">
        <RevealOnScroll className="auth-copy" direction="left">
          <span className="hero-eyebrow">Password Reset</span>
          <h1>Forgot your password?</h1>
          <p>
            Request a reset code, then enter the code with your new password to regain account access.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="auth-card" direction="right" delay={120}>
          <span className="service-chip">Forgot Password</span>
          <h2>Reset your password</h2>
          <form className="auth-form" onSubmit={requestResetCode}>
            <input
              type="email"
              placeholder="Email Address"
              value={requestData.email}
              onChange={handleRequestChange}
              required
            />
            <button type="submit" className="button button-secondary" disabled={state.loading}>
              {state.loading ? "Please wait..." : "Get Reset Code"}
            </button>
          </form>

          <form className="auth-form auth-form-spaced" onSubmit={resetPassword}>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={resetData.email}
              onChange={handleResetChange}
              required
            />
            <input
              name="code"
              type="text"
              placeholder="6-digit Reset Code"
              value={resetData.code}
              onChange={handleResetChange}
              required
            />
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={resetData.newPassword}
              onChange={handleResetChange}
              required
            />
            {state.error ? <p className="form-message error">{state.error}</p> : null}
            {state.success ? <p className="form-message success">{state.success}</p> : null}
            <button type="submit" className="button button-primary" disabled={state.loading}>
              {state.loading ? "Please wait..." : "Reset Password"}
            </button>
          </form>

          <p className="auth-switch">
            Remembered your password? <Link to="/login">Back to login</Link>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
