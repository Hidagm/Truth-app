import React, { useState, useEffect, useCallback } from "react";

const SB_URL = "https://oeeenddnuezxuxpaywgv.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZWVuZGRudWV6eHV4cGF5d2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTIyMjYsImV4cCI6MjA5NDY4ODIyNn0.gsNgusf7FIUoyKW2csCPzNT0H86FVrpJnfNooC-oYxI";
const ADMIN_PW = "truth_admin_2024";
const F = "'DM Sans',system-ui,sans-serif";

const C = {
  bg: "#060a0d", card: "#0b1015", border: "#ffffff0a", borderHi: "#ffffff14",
  text: "#e2e8f0", muted: "#475569", mutedHi: "#64748b",
  from: "#34d399", to: "#818cf8", mid: "#6ee7b7",
  danger: "#f87171", dangerBg: "#f8717112",
  warn: "#fbbf24", warnBg: "#fbbf2412",
  success: "#34d399", successBg: "#34d39912",
  gold: "#f59e0b", goldBg: "#f59e0b12",
  purple: "#818cf8", purpleBg: "#818cf812",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#060a0d;font-family:'DM Sans',system-ui,sans-serif;color:#e2e8f0;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:#ffffff12;border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes ping{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2);opacity:0}}
.fade{animation:fadeUp .25s ease;}
.spin{animation:spin 1s linear infinite;}
`;

// ── DB helpers ──
function db(table, opts) {
  var url = SB_URL + "/rest/v1/" + table;
  var params = [];
  if (opts.select) params.push("select=" + opts.select);
  if (opts.eq) Object.keys(opts.eq).forEach(function(k) { params.push(k + "=eq." + opts.eq[k]); });
  if (opts.order) params.push("order=" + opts.order);
  if (opts.limit) params.push("limit=" + opts.limit);
  if (params.length) url += "?" + params.join("&");
  return fetch(url, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", "apikey": SB_KEY, "Authorization": "Bearer " + SB_KEY, "Prefer": opts.prefer || "return=representation" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(function(r) { return r.status === 204 ? {} : r.json(); });
}
function dbGet(table, opts) { return db(table, Object.assign({ method: "GET" }, opts || {})); }
function dbPost(table, body) { return db(table, { method: "POST", body: body, prefer: "return=representation" }); }
function dbPatch(table, id, body) { return db(table, { method: "PATCH", eq: { id: id }, body: body, prefer: "return=representation" }); }
function dbDelete(table, id) { return db(table, { method: "DELETE", eq: { id: id }, prefer: "return=minimal" }); }

// ── Shared UI ──
function Btn(props) {
  var color = props.color || C.from;
  var danger = props.danger;
  var ghost = props.ghost;
  return (
    <button onClick={props.onClick} disabled={props.disabled} style={Object.assign({
      padding: props.small ? "5px 12px" : "9px 18px",
      borderRadius: "8px",
      border: "1px solid " + (danger ? C.danger + "44" : ghost ? C.border : "transparent"),
      background: danger ? C.dangerBg : ghost ? "transparent" : color + "18",
      color: danger ? C.danger : ghost ? C.mutedHi : color,
      fontSize: props.small ? "11px" : "13px",
      fontWeight: "600",
      cursor: props.disabled ? "not-allowed" : "pointer",
      fontFamily: F,
      opacity: props.disabled ? .5 : 1,
      display: "flex", alignItems: "center", gap: "5px",
      flexShrink: 0,
      whiteSpace: "nowrap",
    }, props.style || {})}>{props.children}</button>
  );
}
function Badge(props) {
  var colors = {
    pending: [C.warn, C.warnBg],
    open: [C.warn, C.warnBg],
    reviewing: [C.purple, C.purpleBg],
    investigating: [C.purple, C.purpleBg],
    approved: [C.success, C.successBg],
    resolved: [C.success, C.successBg],
    dismissed: [C.muted, "#ffffff08"],
    rejected: [C.danger, C.dangerBg],
    active: [C.success, C.successBg],
    suspended: [C.warn, C.warnBg],
    banned: [C.danger, C.dangerBg],
    low: [C.success, C.successBg],
    medium: [C.warn, C.warnBg],
    high: [C.danger, C.dangerBg],
    critical: [C.danger, C.dangerBg],
  };
  var pair = colors[props.status] || [C.muted, "#ffffff08"];
  return (
    <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "10px", fontFamily: F, fontWeight: "600", background: pair[1], color: pair[0], border: "1px solid " + pair[0] + "33", textTransform: "capitalize", whiteSpace: "nowrap" }}>{props.status}</span>
  );
}
function Card(props) {
  return <div style={Object.assign({ background: C.card, borderRadius: "12px", border: "1px solid " + C.border, padding: "16px" }, props.style || {})}>{props.children}</div>;
}
function Input(props) {
  return <input value={props.value} onChange={function(e) { props.onChange(e.target.value); }} placeholder={props.placeholder} type={props.type || "text"} style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "#0d1520", border: "1px solid " + C.border, color: C.text, fontSize: "13px", fontFamily: F, outline: "none", boxSizing: "border-box" }}/>;
}
function Textarea(props) {
  return <textarea value={props.value} onChange={function(e) { props.onChange(e.target.value); }} placeholder={props.placeholder} rows={props.rows || 3} style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "#0d1520", border: "1px solid " + C.border, color: C.text, fontSize: "13px", fontFamily: F, outline: "none", resize: "vertical", boxSizing: "border-box" }}/>;
}
function Select(props) {
  return <select value={props.value} onChange={function(e) { props.onChange(e.target.value); }} style={{ padding: "8px 10px", borderRadius: "8px", background: "#0d1520", border: "1px solid " + C.border, color: C.text, fontSize: "12px", fontFamily: F, cursor: "pointer", outline: "none" }}>{props.children}</select>;
}
function Label(props) {
  return <p style={{ color: C.muted, fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", fontFamily: F, marginBottom: "7px" }}>{props.children}</p>;
}
function Spinner() {
  return <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid " + C.border, borderTop: "2px solid " + C.from, animation: "spin 1s linear infinite" }}/>;
}
function Empty(props) {
  return <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted, fontSize: "13px", fontFamily: F }}><div style={{ fontSize: "32px", marginBottom: "10px" }}>{props.icon || "📭"}</div>{props.text || "Nothing here yet"}</div>;
}
function Modal(props) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={function(e) { if (e.target === e.currentTarget) props.onClose(); }}>
      <div style={{ background: C.card, borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "520px", border: "1px solid " + C.borderHi, animation: "fadeUp .2s ease", maxHeight: "90vh", overflowY: "auto" }}>{props.children}</div>
    </div>
  );
}
function ModalHeader(props) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}><h3 style={{ color: C.text, fontWeight: "700", fontFamily: F, fontSize: "15px" }}>{props.title}</h3><button onClick={props.onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>✕</button></div>;
}
function StatCard(props) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: props.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{props.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: C.muted, fontSize: "11px", fontFamily: F, marginBottom: "3px" }}>{props.label}</p>
        <p style={{ color: props.color || C.text, fontSize: "22px", fontWeight: "700", fontFamily: F }}>{props.value}</p>
      </div>
      {props.delta && <span style={{ fontSize: "11px", fontFamily: F, color: props.delta.startsWith("+") ? C.success : C.danger }}>{props.delta}</span>}
    </Card>
  );
}

// ── LOGIN ──
function Login(props) {
  var [pw, setPw] = useState("");
  var [err, setErr] = useState(false);
  function tryLogin() {
    if (pw === ADMIN_PW) props.onLogin();
    else { setErr(true); setTimeout(function() { setErr(false); }, 2000); }
  }
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛡️</div>
          <h1 style={{ color: C.text, fontSize: "22px", fontWeight: "700", fontFamily: F, marginBottom: "4px" }}>Truth Admin</h1>
          <p style={{ color: C.muted, fontSize: "13px", fontFamily: F }}>Secure admin access</p>
        </div>
        <Card>
          <Label>Admin Password</Label>
          <input value={pw} onChange={function(e) { setPw(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") tryLogin(); }} type="password" placeholder="Enter password" style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", background: "#0d1520", border: "1px solid " + (err ? C.danger : C.border), color: C.text, fontSize: "14px", fontFamily: F, outline: "none", boxSizing: "border-box", marginBottom: "14px" }}/>
          {err && <p style={{ color: C.danger, fontSize: "12px", fontFamily: F, marginBottom: "12px" }}>Incorrect password</p>}
          <button onClick={tryLogin} style={{ width: "100%", padding: "11px", borderRadius: "10px", background: "linear-gradient(135deg," + C.from + "," + C.to + ")", border: "none", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: F }}>Sign in</button>
        </Card>
      </div>
    </div>
  );
}

// ── VERIFICATIONS TAB ──
function Verifications() {
  var [items, setItems] = useState([]);
  var [loading, setLoading] = useState(true);
  var [filter, setFilter] = useState("pending");
  var [selected, setSelected] = useState(null);
  var [rejectReason, setRejectReason] = useState("");
  var [saving, setSaving] = useState(false);

  var load = useCallback(function() {
    setLoading(true);
    dbGet("verifications", { order: "submitted_at.desc", limit: 100 })
      .then(function(data) { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(function() { setLoading(false); });
  }, []);

  useEffect(function() { load(); }, [load]);

  function approve(id) {
    setSaving(true);
    dbPatch("verifications", id, { status: "approved", reviewed_at: new Date().toISOString() })
      .then(function() { load(); setSelected(null); setSaving(false); })
      .catch(function() { setSaving(false); });
  }
  function reject(id) {
    setSaving(true);
    dbPatch("verifications", id, { status: "rejected", reviewed_at: new Date().toISOString(), reject_reason: rejectReason || "ID or face not clearly visible" })
      .then(function() { load(); setSelected(null); setRejectReason(""); setSaving(false); })
      .catch(function() { setSaving(false); });
  }

  var filtered = items.filter(function(i) { return filter === "all" || i.status === filter; });
  var pendingCount = items.filter(function(i) { return i.status === "pending"; }).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ color: C.text, fontSize: "18px", fontWeight: "700", fontFamily: F }}>ID Verifications</h2>
          <p style={{ color: C.muted, fontSize: "12px", fontFamily: F, marginTop: "3px" }}>Review selfie + ID submissions before users can access the app</p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["pending", "approved", "rejected", "all"].map(function(f) {
            return <button key={f} onClick={function() { setFilter(f); }} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid " + (filter === f ? C.from : C.border), background: filter === f ? C.from + "18" : "transparent", color: filter === f ? C.from : C.muted, fontSize: "11px", fontFamily: F, cursor: "pointer", fontWeight: filter === f ? "600" : "400", position: "relative", textTransform: "capitalize" }}>
              {f}{f === "pending" && pendingCount > 0 && <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "16px", height: "16px", borderRadius: "50%", background: C.warn, color: "#000", fontSize: "9px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>{pendingCount}</span>}
            </button>;
          })}
          <Btn ghost onClick={load} small>↻ Refresh</Btn>
        </div>
      </div>

      {loading && <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Spinner/></div>}
      {!loading && filtered.length === 0 && <Empty icon="🪪" text={filter === "pending" ? "No pending verifications — all caught up!" : "No " + filter + " verifications"}/>}
      {!loading && <div style={{ display: "grid", gap: "10px" }}>
        {filtered.map(function(item) {
          return (
            <Card key={item.id} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              {/* Selfie thumbnail */}
              <div style={{ width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", background: "#0d1520", border: "1px solid " + C.border, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.selfie_data
                  ? <img src={item.selfie_data} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="selfie"/>
                  : <span style={{ fontSize: "24px" }}>🪪</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                  <span style={{ color: C.text, fontSize: "13px", fontFamily: F, fontWeight: "600" }}>{item.user_email || "Unknown"}</span>
                  <Badge status={item.status}/>
                </div>
                <p style={{ color: C.muted, fontSize: "11px", fontFamily: F, marginBottom: "8px" }}>Submitted: {item.submitted_at ? new Date(item.submitted_at).toLocaleString() : "—"}</p>
                {item.reject_reason && <p style={{ color: C.danger, fontSize: "11px", fontFamily: F, marginBottom: "8px" }}>Rejected: {item.reject_reason}</p>}
                {item.reviewed_at && <p style={{ color: C.muted, fontSize: "11px", fontFamily: F, marginBottom: "8px" }}>Reviewed: {new Date(item.reviewed_at).toLocaleString()}</p>}
                {item.status === "pending" && (
                  <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                    <Btn onClick={function() { setSelected(item); }} small>🔍 View full photo</Btn>
                    <Btn onClick={function() { approve(item.id); }} small color={C.success} style={{ opacity: saving ? .5 : 1 }}>✓ Approve</Btn>
                    <Btn onClick={function() { setSelected(item); setRejectReason(""); }} danger small>✕ Reject</Btn>
                  </div>
                )}
                {item.status !== "pending" && <div style={{ display: "flex", gap: "7px" }}><Btn onClick={function() { setSelected(item); }} small ghost>🔍 View</Btn></div>}
              </div>
            </Card>
          );
        })}
      </div>}

      {selected && (
        <Modal onClose={function() { setSelected(null); setRejectReason(""); }}>
          <ModalHeader title="Verification Review" onClose={function() { setSelected(null); setRejectReason(""); }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid " + C.border, background: "#0d1520" }}>
              {selected.selfie_data
                ? <img src={selected.selfie_data} style={{ width: "100%", display: "block", maxHeight: "400px", objectFit: "contain" }} alt="selfie-id"/>
                : <div style={{ padding: "60px", textAlign: "center" }}><span style={{ fontSize: "48px" }}>🪪</span><p style={{ color: C.muted, fontSize: "12px", fontFamily: F, marginTop: "10px" }}>No image submitted</p></div>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><Label>Email</Label><p style={{ color: C.text, fontSize: "13px", fontFamily: F }}>{selected.user_email || "—"}</p></div>
              <div><Label>Status</Label><Badge status={selected.status}/></div>
              <div><Label>Submitted</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{selected.submitted_at ? new Date(selected.submitted_at).toLocaleString() : "—"}</p></div>
              {selected.reviewed_at && <div><Label>Reviewed</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{new Date(selected.reviewed_at).toLocaleString()}</p></div>}
            </div>
            <div style={{ padding: "12px", borderRadius: "10px", background: "#0d1520", border: "1px solid " + C.border }}>
              <p style={{ color: C.muted, fontSize: "11px", fontFamily: F, lineHeight: 1.6 }}>✅ Check that: <span style={{ color: C.mutedHi }}>face is clearly visible · ID document is readable · both face and ID are in the same photo · ID appears genuine</span></p>
            </div>
            {selected.status === "pending" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={function() { approve(selected.id); }} disabled={saving} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: C.success + "18", border: "1px solid " + C.success + "44", color: C.success, fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: F }}>✓ Approve</button>
                </div>
                <Label>Rejection reason (optional)</Label>
                <Textarea value={rejectReason} onChange={setRejectReason} placeholder="e.g. Face not clearly visible · ID not readable · Both not in same photo" rows={2}/>
                <button onClick={function() { reject(selected.id); }} disabled={saving} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: C.dangerBg, border: "1px solid " + C.danger + "44", color: C.danger, fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: F }}>✕ Reject</button>
              </div>
            )}
            {selected.status !== "pending" && selected.reject_reason && (
              <div style={{ padding: "12px", borderRadius: "10px", background: C.dangerBg, border: "1px solid " + C.danger + "22" }}>
                <p style={{ color: C.danger, fontSize: "12px", fontFamily: F }}>Rejection reason: {selected.reject_reason}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── REPORTS TAB ──
function Reports() {
  var [items, setItems] = useState([]);
  var [loading, setLoading] = useState(true);
  var [filter, setFilter] = useState("open");
  var [showNew, setShowNew] = useState(false);
  var [selected, setSelected] = useState(null);
  var [newReport, setNewReport] = useState({ reporter_email: "", reported_email: "", reason: "", details: "" });
  var [adminNote, setAdminNote] = useState("");
  var [saving, setSaving] = useState(false);

  var load = useCallback(function() {
    setLoading(true);
    dbGet("reports", { order: "created_at.desc" })
      .then(function(data) { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(function() { setLoading(false); });
  }, []);
  useEffect(function() { load(); }, [load]);

  function submitReport() {
    setSaving(true);
    dbPost("reports", newReport)
      .then(function() { load(); setShowNew(false); setNewReport({ reporter_email: "", reported_email: "", reason: "", details: "" }); setSaving(false); })
      .catch(function() { setSaving(false); });
  }
  function updateStatus(id, status) {
    var update = { status: status };
    if (status === "resolved") update.resolved_at = new Date().toISOString();
    if (adminNote) update.admin_note = adminNote;
    setSaving(true);
    dbPatch("reports", id, update)
      .then(function() { load(); setSelected(null); setAdminNote(""); setSaving(false); })
      .catch(function() { setSaving(false); });
  }

  var filtered = items.filter(function(i) { return filter === "all" || i.status === filter; });
  var openCount = items.filter(function(i) { return i.status === "open"; }).length;

  var REASONS = ["Harassment", "Explicit content", "Fake profile / spam", "Underage user", "Pressure / manipulation", "Hate speech", "Other"];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ color: C.text, fontSize: "18px", fontWeight: "700", fontFamily: F }}>Reports</h2>
          <p style={{ color: C.muted, fontSize: "12px", fontFamily: F, marginTop: "3px" }}>{openCount} open · {items.length} total</p>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["open", "reviewing", "resolved", "all"].map(function(f) {
            return <button key={f} onClick={function() { setFilter(f); }} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid " + (filter === f ? C.from : C.border), background: filter === f ? C.from + "18" : "transparent", color: filter === f ? C.from : C.muted, fontSize: "11px", fontFamily: F, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>;
          })}
          <Btn onClick={function() { setShowNew(true); }} small>+ New report</Btn>
          <Btn ghost onClick={load} small>↻</Btn>
        </div>
      </div>

      {loading && <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Spinner/></div>}
      {!loading && filtered.length === 0 && <Empty icon="🛡️" text="No reports"/>}
      {!loading && <div style={{ display: "grid", gap: "8px" }}>
        {filtered.map(function(r) {
          return (
            <Card key={r.id} style={{ cursor: "pointer" }} onClick={function() { setSelected(r); setAdminNote(r.admin_note || ""); }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                    <span style={{ color: C.text, fontSize: "13px", fontFamily: F, fontWeight: "600" }}>{r.reason || "No reason given"}</span>
                    <Badge status={r.status}/>
                  </div>
                  <p style={{ color: C.muted, fontSize: "11px", fontFamily: F, marginBottom: "3px" }}>Reporter: {r.reporter_email || "—"} → Against: {r.reported_email || "—"}</p>
                  {r.details && <p style={{ color: C.mutedHi, fontSize: "11px", fontFamily: F, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.details}</p>}
                  <p style={{ color: C.muted, fontSize: "10px", fontFamily: F }}>{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</p>
                </div>
                <span style={{ color: C.muted, fontSize: "18px" }}>›</span>
              </div>
            </Card>
          );
        })}
      </div>}

      {showNew && (
        <Modal onClose={function() { setShowNew(false); }}>
          <ModalHeader title="Log a report" onClose={function() { setShowNew(false); }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div><Label>Reporter email</Label><Input value={newReport.reporter_email} onChange={function(v) { setNewReport(function(p) { return Object.assign({}, p, { reporter_email: v }); }); }} placeholder="who reported"/></div>
            <div><Label>Reported user email</Label><Input value={newReport.reported_email} onChange={function(v) { setNewReport(function(p) { return Object.assign({}, p, { reported_email: v }); }); }} placeholder="who was reported"/></div>
            <div><Label>Reason</Label>
              <select value={newReport.reason} onChange={function(e) { setNewReport(function(p) { return Object.assign({}, p, { reason: e.target.value }); }); }} style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "#0d1520", border: "1px solid " + C.border, color: C.text, fontSize: "13px", fontFamily: F, outline: "none" }}>
                <option value="">Select reason…</option>
                {REASONS.map(function(r) { return <option key={r} value={r}>{r}</option>; })}
              </select>
            </div>
            <div><Label>Details</Label><Textarea value={newReport.details} onChange={function(v) { setNewReport(function(p) { return Object.assign({}, p, { details: v }); }); }} placeholder="Additional context…"/></div>
            <button onClick={submitReport} disabled={saving || !newReport.reason} style={{ padding: "11px", borderRadius: "10px", background: "linear-gradient(135deg," + C.from + "," + C.to + ")", border: "none", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: F, opacity: saving ? .6 : 1 }}>Submit report</button>
          </div>
        </Modal>
      )}

      {selected && (
        <Modal onClose={function() { setSelected(null); setAdminNote(""); }}>
          <ModalHeader title={"Report: " + (selected.reason || "—")} onClose={function() { setSelected(null); setAdminNote(""); }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><Label>Status</Label><Badge status={selected.status}/></div>
              <div><Label>Filed</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"}</p></div>
              <div><Label>Reporter</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{selected.reporter_email || "—"}</p></div>
              <div><Label>Reported</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{selected.reported_email || "—"}</p></div>
            </div>
            {selected.details && <div style={{ padding: "12px", borderRadius: "10px", background: "#0d1520", border: "1px solid " + C.border }}><Label>Details</Label><p style={{ color: C.text, fontSize: "13px", fontFamily: F, lineHeight: 1.6 }}>{selected.details}</p></div>}
            <div><Label>Admin note</Label><Textarea value={adminNote} onChange={setAdminNote} placeholder="Internal notes about this report…" rows={2}/></div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selected.status === "open" && <Btn onClick={function() { updateStatus(selected.id, "reviewing"); }} disabled={saving} color={C.purple}>→ Reviewing</Btn>}
              {selected.status !== "resolved" && <Btn onClick={function() { updateStatus(selected.id, "resolved"); }} disabled={saving} color={C.success}>✓ Resolve</Btn>}
              {selected.status !== "dismissed" && <Btn onClick={function() { updateStatus(selected.id, "dismissed"); }} disabled={saving} ghost>Dismiss</Btn>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── BUGS TAB ──
function Bugs() {
  var [items, setItems] = useState([]);
  var [loading, setLoading] = useState(true);
  var [filter, setFilter] = useState("open");
  var [showNew, setShowNew] = useState(false);
  var [selected, setSelected] = useState(null);
  var [newBug, setNewBug] = useState({ title: "", description: "", severity: "medium", reported_by: "" });
  var [saving, setSaving] = useState(false);

  var load = useCallback(function() {
    setLoading(true);
    dbGet("bugs", { order: "created_at.desc" })
      .then(function(data) { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(function() { setLoading(false); });
  }, []);
  useEffect(function() { load(); }, [load]);

  function submitBug() {
    setSaving(true);
    dbPost("bugs", newBug)
      .then(function() { load(); setShowNew(false); setNewBug({ title: "", description: "", severity: "medium", reported_by: "" }); setSaving(false); })
      .catch(function() { setSaving(false); });
  }
  function updateStatus(id, status) {
    var update = { status: status };
    if (status === "resolved") update.resolved_at = new Date().toISOString();
    setSaving(true);
    dbPatch("bugs", id, update)
      .then(function() { load(); setSelected(null); setSaving(false); })
      .catch(function() { setSaving(false); });
  }

  var filtered = items.filter(function(i) { return filter === "all" || i.status === filter; });
  var openCount = items.filter(function(i) { return i.status === "open"; }).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ color: C.text, fontSize: "18px", fontWeight: "700", fontFamily: F }}>Bug Tracker</h2>
          <p style={{ color: C.muted, fontSize: "12px", fontFamily: F, marginTop: "3px" }}>{openCount} open · {items.length} total</p>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["open", "investigating", "resolved", "all"].map(function(f) {
            return <button key={f} onClick={function() { setFilter(f); }} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid " + (filter === f ? C.from : C.border), background: filter === f ? C.from + "18" : "transparent", color: filter === f ? C.from : C.muted, fontSize: "11px", fontFamily: F, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>;
          })}
          <Btn onClick={function() { setShowNew(true); }} small>+ Log bug</Btn>
          <Btn ghost onClick={load} small>↻</Btn>
        </div>
      </div>

      {loading && <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Spinner/></div>}
      {!loading && filtered.length === 0 && <Empty icon="🐛" text="No bugs"/>}
      {!loading && <div style={{ display: "grid", gap: "8px" }}>
        {filtered.map(function(b) {
          return (
            <Card key={b.id} style={{ cursor: "pointer" }} onClick={function() { setSelected(b); }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                    <span style={{ color: C.text, fontSize: "13px", fontFamily: F, fontWeight: "600" }}>{b.title}</span>
                    <Badge status={b.severity}/>
                    <Badge status={b.status}/>
                  </div>
                  {b.description && <p style={{ color: C.muted, fontSize: "11px", fontFamily: F, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.description}</p>}
                  <p style={{ color: C.muted, fontSize: "10px", fontFamily: F }}>{b.created_at ? new Date(b.created_at).toLocaleString() : "—"}{b.reported_by ? " · by " + b.reported_by : ""}</p>
                </div>
                <span style={{ color: C.muted, fontSize: "18px" }}>›</span>
              </div>
            </Card>
          );
        })}
      </div>}

      {showNew && (
        <Modal onClose={function() { setShowNew(false); }}>
          <ModalHeader title="Log a bug" onClose={function() { setShowNew(false); }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div><Label>Title</Label><Input value={newBug.title} onChange={function(v) { setNewBug(function(p) { return Object.assign({}, p, { title: v }); }); }} placeholder="Short description of the bug"/></div>
            <div><Label>Details</Label><Textarea value={newBug.description} onChange={function(v) { setNewBug(function(p) { return Object.assign({}, p, { description: v }); }); }} placeholder="Steps to reproduce, what happened, what was expected…"/></div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}><Label>Severity</Label>
                <select value={newBug.severity} onChange={function(e) { setNewBug(function(p) { return Object.assign({}, p, { severity: e.target.value }); }); }} style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "#0d1520", border: "1px solid " + C.border, color: C.text, fontSize: "13px", fontFamily: F, outline: "none" }}>
                  {["low", "medium", "high", "critical"].map(function(s) { return <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>; })}
                </select>
              </div>
              <div style={{ flex: 1 }}><Label>Reported by</Label><Input value={newBug.reported_by} onChange={function(v) { setNewBug(function(p) { return Object.assign({}, p, { reported_by: v }); }); }} placeholder="email or name"/></div>
            </div>
            <button onClick={submitBug} disabled={saving || !newBug.title} style={{ padding: "11px", borderRadius: "10px", background: "linear-gradient(135deg," + C.from + "," + C.to + ")", border: "none", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: F, opacity: saving ? .6 : 1 }}>Submit bug</button>
          </div>
        </Modal>
      )}

      {selected && (
        <Modal onClose={function() { setSelected(null); }}>
          <ModalHeader title={selected.title} onClose={function() { setSelected(null); }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}><Badge status={selected.severity}/><Badge status={selected.status}/></div>
            {selected.description && <div style={{ padding: "12px", borderRadius: "10px", background: "#0d1520", border: "1px solid " + C.border }}><p style={{ color: C.text, fontSize: "13px", fontFamily: F, lineHeight: 1.6 }}>{selected.description}</p></div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><Label>Filed</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"}</p></div>
              {selected.reported_by && <div><Label>Reported by</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{selected.reported_by}</p></div>}
              {selected.resolved_at && <div><Label>Resolved</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{new Date(selected.resolved_at).toLocaleString()}</p></div>}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selected.status === "open" && <Btn onClick={function() { updateStatus(selected.id, "investigating"); }} disabled={saving} color={C.purple}>→ Investigating</Btn>}
              {selected.status !== "resolved" && <Btn onClick={function() { updateStatus(selected.id, "resolved"); }} disabled={saving} color={C.success}>✓ Mark resolved</Btn>}
              {selected.status !== "open" && <Btn onClick={function() { updateStatus(selected.id, "open"); }} disabled={saving} ghost>↩ Reopen</Btn>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── USERS TAB ──
function Users() {
  var [items, setItems] = useState([]);
  var [loading, setLoading] = useState(true);
  var [filter, setFilter] = useState("active");
  var [selected, setSelected] = useState(null);
  var [banReason, setBanReason] = useState("");
  var [saving, setSaving] = useState(false);
  var [search, setSearch] = useState("");

  var load = useCallback(function() {
    setLoading(true);
    dbGet("user_profiles", { order: "joined_at.desc" })
      .then(function(data) { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(function() { setLoading(false); });
  }, []);
  useEffect(function() { load(); }, [load]);

  function updateUser(id, body) {
    setSaving(true);
    dbPatch("user_profiles", id, body)
      .then(function() { load(); setSelected(null); setBanReason(""); setSaving(false); })
      .catch(function() { setSaving(false); });
  }

  var filtered = items
    .filter(function(i) { return filter === "all" || i.status === filter; })
    .filter(function(i) { return !search || (i.email && i.email.toLowerCase().includes(search.toLowerCase())); });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ color: C.text, fontSize: "18px", fontWeight: "700", fontFamily: F }}>Users</h2>
          <p style={{ color: C.muted, fontSize: "12px", fontFamily: F, marginTop: "3px" }}>{items.length} total users</p>
        </div>
        <Btn ghost onClick={load} small>↻ Refresh</Btn>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
        <input value={search} onChange={function(e) { setSearch(e.target.value); }} placeholder="Search by email…" style={{ flex: 1, minWidth: "180px", padding: "8px 12px", borderRadius: "8px", background: "#0d1520", border: "1px solid " + C.border, color: C.text, fontSize: "13px", fontFamily: F, outline: "none" }}/>
        {["active", "suspended", "banned", "all"].map(function(f) {
          return <button key={f} onClick={function() { setFilter(f); }} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid " + (filter === f ? C.from : C.border), background: filter === f ? C.from + "18" : "transparent", color: filter === f ? C.from : C.muted, fontSize: "11px", fontFamily: F, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>;
        })}
      </div>

      {loading && <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Spinner/></div>}
      {!loading && filtered.length === 0 && <Empty icon="👤" text="No users found"/>}
      {!loading && <div style={{ display: "grid", gap: "8px" }}>
        {filtered.map(function(u) {
          return (
            <Card key={u.id} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={function() { setSelected(u); setBanReason(u.ban_reason || ""); }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: C.from + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                  <span style={{ color: C.text, fontSize: "13px", fontFamily: F, fontWeight: "600" }}>{u.email || "—"}</span>
                  <Badge status={u.status || "active"}/>
                  {u.is_premium && <span style={{ padding: "2px 7px", borderRadius: "999px", fontSize: "10px", background: C.goldBg, color: C.gold, border: "1px solid " + C.gold + "33", fontFamily: F, fontWeight: "600" }}>✦ Premium</span>}
                </div>
                <p style={{ color: C.muted, fontSize: "11px", fontFamily: F }}>Joined: {u.joined_at ? new Date(u.joined_at).toLocaleDateString() : "—"}{u.last_seen ? " · Last seen: " + new Date(u.last_seen).toLocaleDateString() : ""}</p>
              </div>
              <span style={{ color: C.muted, fontSize: "18px" }}>›</span>
            </Card>
          );
        })}
      </div>}

      {selected && (
        <Modal onClose={function() { setSelected(null); }}>
          <ModalHeader title={selected.email || "User"} onClose={function() { setSelected(null); }}/>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><Label>Status</Label><Badge status={selected.status || "active"}/></div>
              <div><Label>Premium</Label><p style={{ color: C.text, fontSize: "13px", fontFamily: F }}>{selected.is_premium ? "✦ Yes" : "No"}</p></div>
              <div><Label>Joined</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{selected.joined_at ? new Date(selected.joined_at).toLocaleString() : "—"}</p></div>
              <div><Label>Last seen</Label><p style={{ color: C.text, fontSize: "12px", fontFamily: F }}>{selected.last_seen ? new Date(selected.last_seen).toLocaleString() : "—"}</p></div>
            </div>
            {selected.ban_reason && <div style={{ padding: "12px", borderRadius: "10px", background: C.dangerBg, border: "1px solid " + C.danger + "22" }}><p style={{ color: C.danger, fontSize: "12px", fontFamily: F }}>Ban reason: {selected.ban_reason}</p></div>}
            <div><Label>Ban / suspension reason</Label><Input value={banReason} onChange={setBanReason} placeholder="Reason for action (required for ban)"/></div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selected.status !== "active" && <Btn onClick={function() { updateUser(selected.id, { status: "active", ban_reason: null }); }} disabled={saving} color={C.success}>✓ Restore</Btn>}
              {selected.status === "active" && <Btn onClick={function() { updateUser(selected.id, { status: "suspended", ban_reason: banReason }); }} disabled={saving} color={C.warn}>⚠ Suspend</Btn>}
              {selected.status !== "banned" && <Btn onClick={function() { updateUser(selected.id, { status: "banned", ban_reason: banReason }); }} disabled={saving || !banReason} danger>🚫 Ban</Btn>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── STATS TAB ──
function Stats() {
  var [data, setData] = useState({ verifications: [], reports: [], bugs: [], users: [] });
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    Promise.all([
      dbGet("verifications", {}),
      dbGet("reports", {}),
      dbGet("bugs", {}),
      dbGet("user_profiles", {}),
    ]).then(function(results) {
      setData({ verifications: results[0] || [], reports: results[1] || [], bugs: results[2] || [], users: results[3] || [] });
      setLoading(false);
    }).catch(function() { setLoading(false); });
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}><Spinner/></div>;

  var v = data.verifications; var r = data.reports; var b = data.bugs; var u = data.users;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2 style={{ color: C.text, fontSize: "18px", fontWeight: "700", fontFamily: F }}>Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "10px" }}>
        <StatCard icon="👥" label="Total Users" value={u.length} color={C.from} delta={"+0 today"}/>
        <StatCard icon="🪪" label="Pending Verifications" value={v.filter(function(x){return x.status==="pending";}).length} color={C.warn}/>
        <StatCard icon="✅" label="Approved Users" value={v.filter(function(x){return x.status==="approved";}).length} color={C.success}/>
        <StatCard icon="🚨" label="Open Reports" value={r.filter(function(x){return x.status==="open";}).length} color={C.danger}/>
        <StatCard icon="🐛" label="Open Bugs" value={b.filter(function(x){return x.status==="open";}).length} color={C.purple}/>
        <StatCard icon="✦" label="Premium Users" value={u.filter(function(x){return x.is_premium;}).length} color={C.gold}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <Card>
          <h3 style={{ color: C.text, fontSize: "14px", fontWeight: "600", fontFamily: F, marginBottom: "14px" }}>🪪 Verifications</h3>
          {[{l:"Pending",v:v.filter(function(x){return x.status==="pending";}).length,c:C.warn},{l:"Approved",v:v.filter(function(x){return x.status==="approved";}).length,c:C.success},{l:"Rejected",v:v.filter(function(x){return x.status==="rejected";}).length,c:C.danger},{l:"Total",v:v.length,c:C.text}].map(function(s){return(
            <div key={s.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid "+C.border }}>
              <span style={{ color:C.muted, fontSize:"12px", fontFamily:F }}>{s.l}</span>
              <span style={{ color:s.c, fontSize:"14px", fontWeight:"700", fontFamily:F }}>{s.v}</span>
            </div>
          );})}
        </Card>
        <Card>
          <h3 style={{ color: C.text, fontSize: "14px", fontWeight: "600", fontFamily: F, marginBottom: "14px" }}>🛡️ Reports</h3>
          {[{l:"Open",v:r.filter(function(x){return x.status==="open";}).length,c:C.warn},{l:"Reviewing",v:r.filter(function(x){return x.status==="reviewing";}).length,c:C.purple},{l:"Resolved",v:r.filter(function(x){return x.status==="resolved";}).length,c:C.success},{l:"Total",v:r.length,c:C.text}].map(function(s){return(
            <div key={s.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid "+C.border }}>
              <span style={{ color:C.muted, fontSize:"12px", fontFamily:F }}>{s.l}</span>
              <span style={{ color:s.c, fontSize:"14px", fontWeight:"700", fontFamily:F }}>{s.v}</span>
            </div>
          );})}
        </Card>
        <Card>
          <h3 style={{ color: C.text, fontSize: "14px", fontWeight: "600", fontFamily: F, marginBottom: "14px" }}>🐛 Bugs</h3>
          {[{l:"Open",v:b.filter(function(x){return x.status==="open";}).length,c:C.warn},{l:"Investigating",v:b.filter(function(x){return x.status==="investigating";}).length,c:C.purple},{l:"Resolved",v:b.filter(function(x){return x.status==="resolved";}).length,c:C.success},{l:"Critical",v:b.filter(function(x){return x.severity==="critical";}).length,c:C.danger}].map(function(s){return(
            <div key={s.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid "+C.border }}>
              <span style={{ color:C.muted, fontSize:"12px", fontFamily:F }}>{s.l}</span>
              <span style={{ color:s.c, fontSize:"14px", fontWeight:"700", fontFamily:F }}>{s.v}</span>
            </div>
          );})}
        </Card>
        <Card>
          <h3 style={{ color: C.text, fontSize: "14px", fontWeight: "600", fontFamily: F, marginBottom: "14px" }}>👥 Users</h3>
          {[{l:"Active",v:u.filter(function(x){return (x.status||"active")==="active";}).length,c:C.success},{l:"Suspended",v:u.filter(function(x){return x.status==="suspended";}).length,c:C.warn},{l:"Banned",v:u.filter(function(x){return x.status==="banned";}).length,c:C.danger},{l:"Premium",v:u.filter(function(x){return x.is_premium;}).length,c:C.gold}].map(function(s){return(
            <div key={s.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid "+C.border }}>
              <span style={{ color:C.muted, fontSize:"12px", fontFamily:F }}>{s.l}</span>
              <span style={{ color:s.c, fontSize:"14px", fontWeight:"700", fontFamily:F }}>{s.v}</span>
            </div>
          );})}
        </Card>
      </div>
    </div>
  );
}

// ── ANNOUNCEMENTS TAB ──
function Announcements() {
  var [msg, setMsg] = useState("");
  var [sent, setSent] = useState(false);
  var [drafts, setDrafts] = useState([
    { id: 1, title: "Welcome to Truth beta!", body: "We're live! Thank you for being an early user.", status: "draft", created: new Date().toISOString() },
  ]);
  function saveDraft() {
    if (!msg.trim()) return;
    setDrafts(function(p) { return [{ id: Date.now(), title: msg.split("\n")[0].substring(0, 50), body: msg, status: "draft", created: new Date().toISOString() }, ...p]; });
    setSent(true); setMsg(""); setTimeout(function() { setSent(false); }, 2000);
  }
  return (
    <div>
      <h2 style={{ color: C.text, fontSize: "18px", fontWeight: "700", fontFamily: F, marginBottom: "4px" }}>Announcements</h2>
      <p style={{ color: C.muted, fontSize: "12px", fontFamily: F, marginBottom: "20px" }}>Broadcast messages to all Truth users</p>
      <Card style={{ marginBottom: "16px" }}>
        <Label>New announcement</Label>
        <Textarea value={msg} onChange={setMsg} placeholder="Write your message to all users…" rows={4}/>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <button onClick={saveDraft} disabled={!msg.trim()} style={{ padding: "9px 18px", borderRadius: "9px", background: "linear-gradient(135deg," + C.from + "," + C.to + ")", border: "none", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: F, opacity: !msg.trim() ? .5 : 1 }}>{sent ? "✓ Saved!" : "Save draft"}</button>
          <Btn ghost onClick={function() { setMsg(""); }}>Clear</Btn>
        </div>
      </Card>
      <Label>Drafts</Label>
      {drafts.map(function(d) {
        return (
          <Card key={d.id} style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <span style={{ color: C.text, fontSize: "13px", fontFamily: F, fontWeight: "600" }}>{d.title}</span>
              <Badge status={d.status}/>
            </div>
            <p style={{ color: C.muted, fontSize: "11px", fontFamily: F, marginBottom: "8px" }}>{d.body.substring(0, 120)}{d.body.length > 120 ? "…" : ""}</p>
            <div style={{ display: "flex", gap: "7px" }}>
              <Btn small color={C.from}>📤 Send to all users</Btn>
              <Btn small ghost>✏️ Edit</Btn>
              <Btn small danger>Delete</Btn>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ── MAIN APP ──
var TABS = [
  { id: "stats", icon: "📊", label: "Overview" },
  { id: "verifications", icon: "🪪", label: "Verifications" },
  { id: "reports", icon: "🛡️", label: "Reports" },
  { id: "bugs", icon: "🐛", label: "Bugs" },
  { id: "users", icon: "👥", label: "Users" },
  { id: "announcements", icon: "📣", label: "Announcements" },
];

export default function App() {
  var [authed, setAuthed] = useState(false);
  var [tab, setTab] = useState("stats");

  if (!authed) return <div><style>{CSS}</style><Login onLogin={function() { setAuthed(true); }}/></div>;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex" }}>
      <style>{CSS}</style>

      {/* Sidebar */}
      <div style={{ width: "220px", borderRight: "1px solid " + C.border, display: "flex", flexDirection: "column", padding: "20px 12px", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", marginBottom: "24px" }}>
          <div style={{ fontSize: "22px" }}>🛡️</div>
          <div><p style={{ color: C.text, fontSize: "14px", fontWeight: "700", fontFamily: F }}>Truth Admin</p><p style={{ color: C.muted, fontSize: "10px", fontFamily: F }}>v3 · Supabase live</p></div>
        </div>
        {TABS.map(function(t) {
          var active = tab === t.id;
          return (
            <button key={t.id} onClick={function() { setTab(t.id); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "9px", border: "none", background: active ? C.from + "14" : "transparent", cursor: "pointer", width: "100%", textAlign: "left", marginBottom: "3px", transition: "all .15s" }}>
              <span style={{ fontSize: "16px" }}>{t.icon}</span>
              <span style={{ color: active ? C.from : C.mutedHi, fontSize: "13px", fontFamily: F, fontWeight: active ? "600" : "400" }}>{t.label}</span>
            </button>
          );
        })}
        <div style={{ marginTop: "auto", padding: "12px 10px", borderRadius: "10px", background: C.card, border: "1px solid " + C.border }}>
          <p style={{ color: C.muted, fontSize: "10px", fontFamily: F, lineHeight: 1.6, marginBottom: "8px" }}>🟢 Supabase connected<br/>🟢 truth-v3.vercel.app live</p>
          <button onClick={function() { setAuthed(false); }} style={{ background: "none", border: "none", color: C.muted, fontSize: "11px", cursor: "pointer", fontFamily: F }}>Sign out</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxHeight: "100vh" }}>
        <div className="fade">
          {tab === "stats" && <Stats/>}
          {tab === "verifications" && <Verifications/>}
          {tab === "reports" && <Reports/>}
          {tab === "bugs" && <Bugs/>}
          {tab === "users" && <Users/>}
          {tab === "announcements" && <Announcements/>}
        </div>
      </div>
    </div>
  );
}
