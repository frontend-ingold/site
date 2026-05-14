import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { RevealOnScroll } from "../components/common/RevealOnScroll";
import { SectionHeader } from "../components/common/SectionHeader";
import { useAuth } from "../context/AuthContext";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";

export function MyServicesPage() {
  const { isAuthenticated, token, user } = useAuth();
  const [state, setState] = useState({
    loading: true,
    error: "",
    bookings: [],
  });
  const [cancelState, setCancelState] = useState({
    bookingId: null,
    reason: "",
    loading: false,
    error: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    let isActive = true;

    async function loadBookings() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/bookings/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load bookings.");
        }

        if (!isActive) {
          return;
        }

        setState({
          loading: false,
          error: "",
          bookings: result.bookings,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState({
          loading: false,
          error: error.message || "Failed to load bookings.",
          bookings: [],
        });
      }
    }

    loadBookings();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  function startCancel(booking) {
    setCancelState({
      bookingId: booking.id,
      reason: booking.cancellationReason || "",
      loading: false,
      error: "",
    });
  }

  function resetCancel() {
    setCancelState({
      bookingId: null,
      reason: "",
      loading: false,
      error: "",
    });
  }

  async function submitCancel(bookingId) {
    if (!cancelState.reason.trim()) {
      setCancelState((current) => ({
        ...current,
        error: "Cancellation reason is required.",
      }));
      return;
    }

    setCancelState((current) => ({
      ...current,
      loading: true,
      error: "",
    }));

    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: cancelState.reason,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking.");
      }

      setState((current) => ({
        ...current,
        bookings: current.bookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: result.booking.status,
                cancellationReason: result.booking.cancellationReason,
                cancelledAt: result.booking.cancelledAt,
              }
            : booking
        ),
      }));

      resetCancel();
    } catch (error) {
      setCancelState((current) => ({
        ...current,
        loading: false,
        error: error.message || "Failed to cancel booking.",
      }));
    }
  }

  return (
    <section className="my-services-page">
      <div className="container">
        <RevealOnScroll direction="left">
          <SectionHeader
            title="My Services"
            description={`Track your booked services, ${user.fullName}.`}
          />
        </RevealOnScroll>

        {state.loading ? <p className="page-state">Loading your booked services...</p> : null}
        {state.error ? <p className="page-state error">{state.error}</p> : null}

        {!state.loading && !state.error && state.bookings.length === 0 ? (
          <p className="page-state">You have not booked any services yet.</p>
        ) : null}

        <div className="my-services-grid">
          {state.bookings.map((booking, index) => (
            <RevealOnScroll
              key={booking.id}
              className="my-service-card"
              direction={index % 2 === 0 ? "left" : "right"}
              delay={index * 70}
            >
              <div className="my-service-top">
                <span className="service-chip">Ref {booking.referenceId}</span>
                <span className={`booking-status status-${booking.status}`}>{booking.status}</span>
              </div>
              <h3>{booking.serviceName}</h3>
              <p><strong>Customer:</strong> {booking.customerName}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Address:</strong> {booking.address}</p>
              <p><strong>Preferred Date:</strong> {booking.preferredDate || "Not selected"}</p>
              <p><strong>Issue:</strong> {booking.issueDescription || "No issue details provided"}</p>
              {booking.cancellationReason ? (
                <p><strong>Cancel Reason:</strong> {booking.cancellationReason}</p>
              ) : null}
              <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
              {booking.cancelledAt ? (
                <p><strong>Cancelled On:</strong> {new Date(booking.cancelledAt).toLocaleString()}</p>
              ) : null}
              {booking.status !== "cancelled" ? (
                <div className="cancel-booking-box">
                  {cancelState.bookingId === booking.id ? (
                    <>
                      <textarea
                        rows="3"
                        placeholder="Write cancellation reason"
                        value={cancelState.reason}
                        onChange={(event) =>
                          setCancelState((current) => ({
                            ...current,
                            reason: event.target.value,
                          }))
                        }
                      />
                      {cancelState.error ? <p className="form-message error">{cancelState.error}</p> : null}
                      <div className="cancel-booking-actions">
                        <button
                          type="button"
                          className="button button-primary"
                          disabled={cancelState.loading}
                          onClick={() => submitCancel(booking.id)}
                        >
                          {cancelState.loading ? "Cancelling..." : "Confirm Cancel"}
                        </button>
                        <button type="button" className="button button-secondary" onClick={resetCancel}>
                          Close
                        </button>
                      </div>
                    </>
                  ) : (
                    <button type="button" className="button button-secondary" onClick={() => startCancel(booking)}>
                      Cancel Service
                    </button>
                  )}
                </div>
              ) : null}
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
