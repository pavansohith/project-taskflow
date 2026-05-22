"use client";

export default function GlobalError({
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
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0a0f1e",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 0 0.5rem" }}>
          Something went wrong
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>
          An unexpected error occurred.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            background: "#4f46e5",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.375rem",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
