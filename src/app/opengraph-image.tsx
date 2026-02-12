import { ImageResponse } from "next/og";

export const alt = "utllo - Free Online Tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Logo + brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #818cf8, #6366f1)",
              borderRadius: "16px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            utllo
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "28px",
            color: "#c7d2fe",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Free online tools for everyone
        </p>

        {/* Tool categories */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
          }}
        >
          {["Generators", "Calculators", "Converters", "Tools", "Random"].map(
            (cat) => (
              <div
                key={cat}
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.1)",
                  color: "#e0e7ff",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {cat}
              </div>
            )
          )}
        </div>

        {/* Domain */}
        <p
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "20px",
            color: "#a5b4fc",
            margin: 0,
          }}
        >
          utllo.com
        </p>
      </div>
    ),
    { ...size }
  );
}
