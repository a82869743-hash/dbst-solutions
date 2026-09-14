import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        md: "2.5rem",
        lg: "4rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Manrope", "system-ui", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.25rem" }],
        sm: ["0.9375rem", { lineHeight: "1.45rem" }],
        base: ["1.03125rem", { lineHeight: "1.65rem" }],
      },
      colors: {
        "bg-base": "var(--bg-base)",
        "bg-surface": "var(--bg-surface)",
        "bg-muted": "var(--bg-muted)",
        "fg-default": "var(--fg-default)",
        "fg-dim": "var(--fg-dim)",
        "fg-dimmer": "var(--fg-dimmer)",
        "border-subtle": "var(--border-subtle)",
        accent: {
          DEFAULT: "var(--accent)",
          tint: "var(--accent-tint)",
          deep: "var(--accent-deep)",
          "on-dark": "var(--ink-accent-on-dark)",
        },
        ink: {
          deep: "var(--ink-deep)",
          fg: "var(--ink-deep-fg)",
          accent: "var(--ink-accent-on-dark)",
        },
        success: "var(--success)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--bg-base)",
        foreground: "var(--fg-default)",
        primary: {
          DEFAULT: "var(--accent)",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "var(--bg-muted)",
          foreground: "var(--fg-default)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "var(--bg-muted)",
          foreground: "var(--fg-dim)",
        },
        card: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--fg-default)",
        },
      },
      boxShadow: {
        flat: "var(--shadow-flat)",
        raised: "var(--shadow-raised)",
        floating: "var(--shadow-floating)",
        tactile: "var(--shadow-tactile)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 35s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
