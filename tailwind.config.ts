import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      fontSize: {
        h1: ["var(--h1)", { lineHeight: "var(--h1-lh)", letterSpacing: "var(--h1-ls)", fontWeight: "var(--h1-w)" }],
        h2: ["var(--h2)", { lineHeight: "var(--h2-lh)", letterSpacing: "var(--h2-ls)", fontWeight: "var(--h2-w)" }],
        h3: ["var(--h3)", { lineHeight: "var(--h3-lh)", letterSpacing: "var(--h3-ls)", fontWeight: "var(--h3-w)" }],
        h4: ["var(--h4)", { lineHeight: "var(--h4-lh)", letterSpacing: "var(--h4-ls)", fontWeight: "var(--h4-w)" }],
        h5: ["var(--h5)", { lineHeight: "var(--h5-lh)", letterSpacing: "var(--h5-ls)", fontWeight: "var(--h5-w)" }],
        h6: ["var(--h6)", { lineHeight: "var(--h6-lh)", letterSpacing: "var(--h6-ls)", fontWeight: "var(--h6-w)" }],
        lead: ["var(--lead)", { lineHeight: "var(--lead-lh)", fontWeight: "var(--lead-w)" }],
        body: ["var(--body)", { lineHeight: "var(--body-lh)", fontWeight: "var(--body-w)" }],
        small: ["var(--small)", { lineHeight: "var(--small-lh)", fontWeight: "var(--small-w)" }],
        caption: ["var(--caption)", { lineHeight: "var(--caption-lh)", fontWeight: "var(--caption-w)" }],
        label: ["var(--label)", { lineHeight: "var(--label-lh)", letterSpacing: "var(--label-ls)", fontWeight: "var(--label-w)" }],
      },
      letterSpacing: {
        "tighter-heading": "-0.02em",
        "tight-heading": "-0.01em",
        "tight-label": "-0.005em",
      },
      lineHeight: {
        "heading-tight": "1.10",
        "heading-normal": "1.20",
        "heading-relaxed": "1.30",
        "body-relaxed": "1.65",
        "body-lead": "1.70",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
