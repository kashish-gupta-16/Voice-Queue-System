import React, { useState, useEffect, useCallback } from "react";
import QueueTable from "../components/QueueTable.js";
import { getAllTokens, updateTokenStatus } from "../services/api";

const SERVICES = ["all", "doctor", "lab", "pharmacy"];
const STATUSES  = ["all", "waiting", "serving", "done"];

const SERVICE_ICONS = { all: "🏥", doctor: "🩺", lab: "🧪", pharmacy: "💊" };

const StatCard = ({ label, value, accent, bg, icon }) => (
  <div style={{
    background: bg, border: `1.5px solid ${accent}44`,
    borderRadius: 20, padding: "20px 24px", flex: 1, minWidth: 130,
    boxShadow: "0 2px 12px rgba(163, 106, 106, 0.06)",
    display: "flex", alignItems: "center", gap: 14,
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      background: "#fff", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: 22, boxShadow: "0 2px 8px rgba(60, 66, 222, 0.27)",
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [tokens, setTokens]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [lastUpdated, setLastUpdated]     = useState(null);

  const fetchTokens = useCallback(async () => {
    try {
      const data = await getAllTokens();
      setTokens(data);
      setError(null);
    } catch (err) {
      setError("Cannot reach backend — check server is running on port 8000");
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, []);

  useEffect(() => { fetchTokens(); }, [fetchTokens]);
  useEffect(() => {
    const interval = setInterval(fetchTokens, 10000);
    return () => clearInterval(interval);
  }, [fetchTokens]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTokenStatus(id, newStatus);
      setTokens(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      alert("Failed to update token status");
    }
  };

  const stats = {
    total:   tokens.length,
    waiting: tokens.filter(t => t.status === "waiting").length,
    serving: tokens.filter(t => t.status === "serving").length,
    done:    tokens.filter(t => t.status === "done").length,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      color: "#1a1a2e",
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1.5px solid #e3f2fd",
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(33,150,243,0.08)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #42a5f5, #1976d2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 12px rgba(33,150,243,0.3)",
          }}>🏥</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e" }}>
              Queue Monitor
            </div>
            <div style={{ fontSize: 11, color: "#90caf9", letterSpacing: 1 }}>
              VOICE QUEUE SYSTEM
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {lastUpdated && (
            <div style={{ fontSize: 12, color: "#90caf9" }}>
              Updated {lastUpdated}
            </div>
          )}
          <button onClick={fetchTokens} style={{
            background: "linear-gradient(135deg, #42a5f5, #1976d2)",
            border: "none", color: "#fff",
            borderRadius: 20, padding: "8px 18px",
            fontSize: 12, cursor: "pointer", fontWeight: 600,
            boxShadow: "0 2px 8px rgba(33,150,243,0.3)",
          }}>↻ Refresh</button>
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>
        {/* Error */}
        {error && (
          <div style={{
            background: "#fff5f5", border: "1.5px solid #ffcdd2",
            color: "#c62828", borderRadius: 12, padding: "14px 18px",
            fontSize: 13, marginBottom: 24,
          }}>⚠️ {error}</div>
        )}

        {/* Stats */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard label="Total Tokens" value={stats.total}   accent="#1976d2" bg="#e3f2fd" icon="🎫" />
          <StatCard label="Waiting"      value={stats.waiting} accent="#ff9800" bg="#fff8f0" icon="⏳" />
          <StatCard label="Serving"      value={stats.serving} accent="#4caf50" bg="#f0fff4" icon="👨‍⚕️" />
          <StatCard label="Completed"    value={stats.done}    accent="#7c4dff" bg="#f3e5ff" icon="✅" />
        </div>

        {/* Filters */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "16px 20px",
          marginBottom: 20, boxShadow: "0 2px 8px rgba(40, 140, 228, 0.27)",
          display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center",
          border: "1.5px solid #e3f2fd",
        }}>
          {/* Service filter */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#90caf9", marginRight: 4 }}>SERVICE</span>
            {SERVICES.map(s => (
              <button key={s} onClick={() => setServiceFilter(s)} style={{
                background: serviceFilter === s
                  ? "linear-gradient(135deg, #42a5f5, #1976d2)"
                  : "#f0f7ff",
                border: serviceFilter === s ? "none" : "1.5px solid #bbdefb",
                color: serviceFilter === s ? "#fff" : "#1976d2",
                borderRadius: 20, padding: "6px 16px",
                fontSize: 12, cursor: "pointer", fontWeight: 600,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                {SERVICE_ICONS[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: "#e3f2fd" }} />

          {/* Status filter */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#90caf9", marginRight: 4 }}>STATUS</span>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                background: statusFilter === s ? "#1976d2" : "#f0f7ff",
                border: "none",
                color: statusFilter === s ? "#fff" : "#1976d2",
                borderRadius: 20, padding: "6px 16px",
                fontSize: 12, cursor: "pointer", fontWeight: 600,
                textTransform: "capitalize",
              }}>{s}</button>
            ))}
          </div>

          <div style={{ marginLeft: "auto", fontSize: 12, color: "#90caf9" }}>
            {tokens.filter(t =>
              (serviceFilter === "all" || t.service === serviceFilter) &&
              (statusFilter === "all" || t.status === statusFilter)
            ).length} tokens
          </div>
        </div>

        {/* Queue Table */}
        <div style={{
          background: "#ffffff", borderRadius: 20,
          padding: 24, minHeight: 200,
          boxShadow: "0 4px 20px rgba(189, 196, 201, 0.49)",
          border: "1.5px solid #e3f2fd",
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 48, color: "#90caf9", fontSize: 14 }}>
              Loading tokens...
            </div>
          ) : (
            <QueueTable
              tokens={tokens}
              onStatusChange={handleStatusChange}
              serviceFilter={serviceFilter}
              statusFilter={statusFilter}
            />
          )}
        </div>

        <div style={{ marginTop: 12, fontSize: 11, color: "#90caf9", textAlign: "center" }}>
          Auto-refreshes every 10 seconds
        </div>
      </div>
    </div>
  );
};

export default Dashboard;