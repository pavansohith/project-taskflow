"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          background: "#0f172a",
          color: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            TaskFlow
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
            Something went wrong. Please refresh or try again.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <pre
              style={{
                fontSize: "0.75rem",
                textAlign: "left",
                background: "#1e293b",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                overflow: "auto",
                marginBottom: "1rem",
                color: "#fda4af",
              }}
            >
              {error.message}
            </pre>
          )}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
