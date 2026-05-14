import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RevealOnScroll } from "../components/common/RevealOnScroll";
import { useAuth } from "../context/AuthContext";

const initialRegisterForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
};

const initialLoginForm = {
  email: "",
  password: "",
};

export function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [formData, setFormData] = useState(isRegister ? initialRegisterForm : initialLoginForm);
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: "",
  });

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
    });

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData);
      }

      navigate("/");
    } catch (error) {
      setSubmitState({
        loading: false,
        error: error.message || "Authentication failed.",
      });
      return;
    }

    setSubmitState({
      loading: false,
      error: "",
    });
  }

  return (
    <section className="auth-page">
      <div className="container auth-grid">
        <RevealOnScroll className="auth-copy" direction="left">
          <span className="hero-eyebrow">Account Access</span>
          <h1>{isRegister ? "Create your account" : "Login to your account"}</h1>
          <p>
            {isRegister
              ? "Register to track bookings, manage your details, and get faster service support."
              : "Login to continue booking services, reviewing requests, and managing your account."}
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="auth-card" direction="right" delay={120}>
          <span className="service-chip">{isRegister ? "Register" : "Login"}</span>
          <h2>{isRegister ? "Join UrbanCare" : "Welcome back"}</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister ? (
              <>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </>
            ) : null}
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {submitState.error ? <p className="form-message error">{submitState.error}</p> : null}
            <button type="submit" className="button button-primary" disabled={submitState.loading}>
              {submitState.loading ? "Please wait..." : isRegister ? "Register" : "Login"}
            </button>
            {!isRegister ? (
              <Link className="auth-inline-link" to="/forgot-password">
                Forgot password?
              </Link>
            ) : null}
          </form>
          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "Need a new account?"}{" "}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Login here" : "Register here"}
            </Link>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
