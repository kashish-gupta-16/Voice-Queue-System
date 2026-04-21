import React from "react";
import TokenCard from "./TokenCard";

const SERVICE_LABELS = { doctor: "Doctor", lab: "Lab", pharmacy: "Pharmacy" , bank: "Bank" , governmentoffice: "Government Office" };
const SERVICE_ICONS  = { doctor: "🩺",    lab: "🧪",  pharmacy: "💊", bank: "🏦", governmentoffice: "🏛" };
const SERVICES = ["doctor", "lab", "pharmacy" , "bank" , "government office"];

const SERVICE_COLORS = {
  doctor:   { bg: "#fff0f6", border: "#ffb3c6", accent: "#e91e8c" },
  lab:      { bg: "#f0f7ff", border: "#b3d4ff", accent: "#1976d2" },
  pharmacy: { bg: "#f0fff4", border: "#b3f0c6", accent: "#2e7d32" },
  bank: { bg: "#fff0f6", border: "#ffb3c6", accent: "#e91e8c" },
  governmentoffice: { bg: "#fff0f6", border: "#ffb3c6", accent: "#e91e8c" },
};

const QueueTable = ({ tokens, onStatusChange, serviceFilter, statusFilter }) => {
  const filtered = tokens.filter(t => {
    const svcMatch = serviceFilter === "all" || t.service === serviceFilter;
    const stMatch  = statusFilter  === "all" || t.status  === statusFilter;
    return svcMatch && stMatch;
  });

  if (filtered.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: 56,
        color: "#ccc", fontSize: 14,
      }}>
        😊 No tokens found
      </div>
    );
  }

  if (serviceFilter === "all") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {SERVICES.map(svc => {
          const svcTokens = filtered.filter(t => t.service === svc);
          if (svcTokens.length === 0) return null;
          const sc = SERVICE_COLORS[svc];
          return (
            <div key={svc}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: sc.bg, border: `1.5px solid ${sc.border}`,
                borderRadius: 20, padding: "6px 16px", marginBottom: 12,
              }}>
                <span>{SERVICE_ICONS[svc]}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: sc.accent }}>
                  {SERVICE_LABELS[svc]}
                </span>
                <span style={{
                  background: sc.border, color: sc.accent,
                  borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 700,
                }}>{svcTokens.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {svcTokens.map(t => (
                  <TokenCard key={t._id} token={t} onStatusChange={onStatusChange} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {filtered.map(t => (
        <TokenCard key={t._id} token={t} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
};

export default QueueTable;