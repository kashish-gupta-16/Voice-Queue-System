import React from "react";

const STATUS_STYLES = {
  waiting:  { bg: "#fff8e1", border: "#ffe082", text: "#e65100", dot: "#ff9800" },
  serving:  { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32", dot: "#4caf50" },
  done:     { bg: "#f3e5f5", border: "#ce93d8", text: "#6a1b9a", dot: "#9c27b0" },
};

const SERVICE_ICONS  = { doctor: "🩺", lab: "🧪", pharmacy: "💊", bank: "🏦", governmentoffice: "🏛" };
const SERVICE_COLORS = {
  doctor:   { bg: "#fce4ec", border: "#f48fb1", text: "#c2185b" },
  lab:      { bg: "#e3f2fd", border: "#90caf9", text: "#1565c0" },
  pharmacy: { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32" },
  bank: {bg: "#fce4ec", border: "#f48fb1", text: "#c2185b"},
  governmentoffice: { bg: "#e3f2fd", border: "#90caf9", text: "#1565c0" },
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 1) return "just now";
  if (diff === 1) return "1 min ago";
  return `${diff} mins ago`;
}

const TokenCard = ({ token, onStatusChange }) => {
  const ss = STATUS_STYLES[token.status] || STATUS_STYLES.waiting;
  const sc = SERVICE_COLORS[token.service] || SERVICE_COLORS.lab;

  return (
    <div style={{
      background: "#ffffff",
      border: "1.5px solid #e8f0fe",
      borderRadius: 16,
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap",
      boxShadow: "0 2px 8px rgba(33,150,243,0.06)",
      transition: "all 0.2s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(33,150,243,0.12)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(33,150,243,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Left: Service icon + Token info */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Service icon */}
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: sc.bg, border: `1.5px solid ${sc.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
        }}>
          {SERVICE_ICONS[token.service]}
        </div>

        {/* Token number + details */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", letterSpacing: 0.5 }}>
              {token.tokenNumber}
            </span>
            <span style={{
              background: sc.bg, border: `1px solid ${sc.border}`,
              color: sc.text, borderRadius: 20, padding: "2px 10px",
              fontSize: 10, fontWeight: 700, textTransform: "capitalize",
            }}>{token.service}</span>
          </div>
          <div style={{ fontSize: 12, color: "#4b4a4a", marginTop: 3, display: "flex", gap: 10 }}>
            <span>📞 {token.phone}</span>
            {/* <span>🕐 {timeAgo(token.createdAt)}</span> */}
            <span>🌐 {token.language === "hindi" ? "Hindi" : "English"}</span>
          </div>
        </div>
      </div>

      {/* Middle: Wait time */}
      <div style={{
        background: "#f8fbff", border: "1.5px solid #e3f2fd",
        borderRadius: 10, padding: "8px 16px", textAlign: "center",
        minWidth: 100,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1976d2" }}>
          {token.status === "done" ? "✓ Done" : `~${token.estimatedWaitMinutes} min`}
        </div>
        <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>wait time</div>
      </div>

      {/* Right: Status badge + Action */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Status badge with dot */}
        <div style={{
          background: ss.bg, border: `1.5px solid ${ss.border}`,
          color: ss.text, borderRadius: 20, padding: "5px 14px",
          fontSize: 11, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: ss.dot,
            boxShadow: token.status === "serving" ? `0 0 6px ${ss.dot}` : "none",
          }} />
          {token.status}
        </div>

        {/* Action buttons */}
        {token.status === "waiting" && (
          <button onClick={() => onStatusChange(token._id, "serving")} style={{
            background: "linear-gradient(135deg, #42a5f5, #1976d2)",
            border: "none", color: "#fff",
            borderRadius: 20, padding: "7px 18px",
            fontSize: 12, cursor: "pointer", fontWeight: 700,
            boxShadow: "0 2px 8px rgba(33,150,243,0.3)",
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Serve →</button>
        )}
        {token.status === "serving" && (
          <button onClick={() => onStatusChange(token._id, "done")} style={{
            background: "linear-gradient(135deg, #66bb6a, #388e3c)",
            border: "none", color: "#fff",
            borderRadius: 20, padding: "7px 18px",
            fontSize: 12, cursor: "pointer", fontWeight: 700,
            boxShadow: "0 2px 8px rgba(76,175,80,0.3)",
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >✓ Done</button>
        )}
        {token.status === "done" && (
          <div style={{
            background: "#f3e5f5", border: "1.5px solid #ce93d8",
            color: "#7b1fa2", borderRadius: 20, padding: "7px 18px",
            fontSize: 12, fontWeight: 700,
          }}>Completed ✓</div>
        )}
      </div>
    </div>
  );
};

export default TokenCard;