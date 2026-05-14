import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";

const quickOptions = [
  {
    id: "track",
    label: "Track order",
    response: "You can track any purchase from the order tracker. Use your order ID and email to see the latest delivery status.",
    action: () => {
      window.location.hash = "/track-order";
    }
  },
  {
    id: "returns",
    label: "Returns",
    response: "Returns are accepted within 14 days for unused items. Start with your order number and we will guide you through the steps."
  },
  {
    id: "stylist",
    label: "Style help",
    response: "Tell us the occasion, preferred fit, and color palette. We can suggest dresses, tops, or accessories to match."
  },
  {
    id: "shipping",
    label: "Shipping",
    response: "Standard shipping timelines depend on location. If you already placed an order, choose Track order for a more precise update."
  }
];

export function FooterChatWidget() {
  const { isOpen: isCartOpen } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Need help with orders, returns, or styling? Pick an option below."
    }
  ]);

  const contactLinks = useMemo(
    () => [
      {
        id: "email",
        label: "Email",
        href: "mailto:support@vogue-demo.com?subject=Support%20Request"
      },
      {
        id: "call",
        label: "Call",
        href: "tel:+18005551234"
      }
    ],
    []
  );

  function handleOptionSelect(option) {
    setMessages((current) => [
      ...current,
      {
        id: `${option.id}-question-${current.length}`,
        role: "user",
        text: option.label
      },
      {
        id: `${option.id}-answer-${current.length}`,
        role: "assistant",
        text: option.response
      }
    ]);

    if (option.action) {
      option.action();
    }
  }

  return (
    <div className={`footer-chat ${isExpanded ? "footer-chat--open" : ""} ${isCartOpen ? "footer-chat--shifted" : ""}`}>
      {isExpanded ? (
        <section className="footer-chat__panel" aria-label="Support chat">
          <div className="footer-chat__head">
            <div>
              <p>Chat options</p>
              <strong>Client Support</strong>
            </div>
            <button type="button" className="footer-chat__close" onClick={() => setIsExpanded(false)} aria-label="Close chat">
              &times;
            </button>
          </div>

          <div className="footer-chat__body">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`footer-chat__message ${message.role === "user" ? "footer-chat__message--user" : ""}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="footer-chat__options">
            {quickOptions.map((option) => (
              <button type="button" key={option.id} onClick={() => handleOptionSelect(option)}>
                {option.label}
              </button>
            ))}
          </div>

          <div className="footer-chat__links">
            {contactLinks.map((link) => (
              <a key={link.id} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <button
        type="button"
        className="footer-chat__toggle"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded ? "true" : "false"}
        aria-label={isExpanded ? "Close support chat" : "Open support chat"}
      >
        <span className="footer-chat__toggle-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M5 6.5C5 5.11929 6.11929 4 7.5 4H16.5C17.8807 4 19 5.11929 19 6.5V13.5C19 14.8807 17.8807 16 16.5 16H11L7 20V16H7.5C6.11929 16 5 14.8807 5 13.5V6.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M8.5 8.75H15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M8.5 11.75H13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <span>Chat</span>
      </button>
    </div>
  );
}
