import React, { useState, useEffect } from "react";
import dbEmblemIcon from "@/assets/db-emblem-icon.png";
import "./dbst-logo.css";

interface LogoMarkProps {
  size?: "default" | "small" | "large";
  variant?: "full" | "icon";
  /** Use "dark" when placed on a dark background (e.g. footer) */
  onBackground?: "light" | "dark";
  className?: string;
  autoPlay?: boolean;
}

interface LogoState {
  id: string;
  label: string;
  isDbEmblem?: boolean;
  icon?: React.ReactNode;
}

const LOGO_STATES: LogoState[] = [
  {
    id: "db_emblem",
    label: "SMART, SECURE, SCALABLE & SUSTAINABLE",
    isDbEmblem: true,
  },
  {
    id: "analytics",
    label: "DATA ANALYTICS",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-4" />
      </svg>
    ),
  },
  {
    id: "architecture",
    label: "ENTERPRISE ARCHITECTURE",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "digital",
    label: "DIGITAL TRANSFORMATION",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "custom_software",
    label: "CUSTOM SOFTWARE",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "ai_engineering",
    label: "AI ENGINEERING",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="3" />
        <circle cx="8.5" cy="16" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="16" r="1.5" fill="currentColor" />
        <path d="M12 2v5" />
        <circle cx="12" cy="2" r="1.2" fill="currentColor" />
        <line x1="1" y1="16" x2="3" y2="16" />
        <line x1="21" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
];

const LogoMark = ({
  size = "default",
  variant = "full",
  onBackground = "light",
  className = "",
  autoPlay = false,
}: LogoMarkProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const isDark = onBackground === "dark";

  const nextState = () => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % LOGO_STATES.length);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      nextState();
    }, 3500);
    return () => clearInterval(timer);
  }, [autoPlay, currentIndex]);

  const sizeClass = size === "small" ? "size-small" : size === "large" ? "size-large" : "";

  return (
    <div
      className={`dbst-logo-container ${sizeClass} ${className}`}
      onMouseEnter={nextState}
      onClick={nextState}
      role="button"
      tabIndex={0}
      aria-label="D-BST Solutions Official Logo"
    >
      {/* 3D Box Wrapper */}
      <div className="dbst-logo-box-wrapper">
        <div className="dbst-logo-box">
          <div className="dbst-icon-stage">
            {LOGO_STATES.map((state, index) => {
              const isActive = index === currentIndex;
              const isExiting = index === prevIndex;
              const classes = [
                "dbst-icon-item",
                isActive ? "active" : "",
                isExiting ? "exiting" : "",
              ].filter(Boolean).join(" ");

              return (
                <div key={state.id} className={classes}>
                  {state.isDbEmblem ? (
                    <img
                      src={dbEmblemIcon}
                      alt="D-BST Emblem"
                      style={{ width: "90%", height: "90%", objectFit: "contain" }}
                    />
                  ) : (
                    state.icon
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Guaranteed Thumbs-Up Wrist Badge */}
        <div className="dbst-logo-thumbsup" title="Quality Guaranteed">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2.06z" />
          </svg>
        </div>
      </div>

      {/* Typography Group */}
      {variant === "full" && (
        <div className="dbst-logo-text-group">
          <div className="dbst-brand-title">
            <span className="dbst-title-db">D-BST</span>
            <span className={`dbst-title-solutions ${isDark ? "dbst-title-solutions-dark" : ""}`}>
              Solutions
            </span>
          </div>

          <div className="dbst-subtitle-container">
            {LOGO_STATES.map((state, index) => {
              const isActive = index === currentIndex;
              const isExiting = index === prevIndex;
              const classes = [
                "dbst-subtitle-item",
                isActive ? "active" : "",
                isExiting ? "exiting" : "",
                isDark ? "dbst-subtitle-item-dark" : "",
              ].filter(Boolean).join(" ");

              return (
                <div key={state.id} className={classes}>
                  {state.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoMark;
