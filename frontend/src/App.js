import React, { useState, useEffect, useCallback } from "react";
import { api } from "./api";

// ─── Styles ──────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit',sans-serif;background:#f3f4f8;color:#1a1a2e}
:root{
  --brand:#1a56db;--brand-l:#e8f0fe;--brand-d:#1239a6;
  --green:#0e9f6e;--green-l:#def7ec;
  --amber:#c27803;--amber-l:#fdf6b2;
  --red:#c81e1e;--red-l:#fde8e8;
  --purple:#7e3af2;--purple-l:#edebfe;
  --teal:#0694a2;--teal-l:#d5f5f6;
  --border:#e5e7eb;--surface:#fff;--muted:#6b7280;
}

/* Layout */
.shell{display:flex;flex-direction:column;min-height:100vh}
.topbar{display:flex;align-items:center;gap:12px;padding:0 20px;height:54px;background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100}
.topbar-logo{font-size:16px;font-weight:700;color:var(--brand);display:flex;align-items:center;gap:7px;flex:1}
.topbar-user{display:flex;align-items:center;gap:10px;font-size:13px}
.avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
.main-wrap{display:flex;flex:1;overflow:hidden}
.sidebar{width:200px;flex-shrink:0;background:#fff;border-right:1px solid var(--border);padding:12px 0;overflow-y:auto;height:calc(100vh - 54px);position:sticky;top:54px}
.content{flex:1;padding:24px;overflow-y:auto;height:calc(100vh - 54px)}

/* Nav */
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 16px;font-size:13px;font-weight:500;cursor:pointer;color:var(--muted);border-left:2.5px solid transparent;transition:all .12s}
.nav-item:hover{background:#f9fafb;color:#1a1a2e}
.nav-item.active{color:var(--brand);background:var(--brand-l);border-left-color:var(--brand)}
.nav-icon{font-size:14px;width:18px;text-align:center}
.nav-badge{margin-left:auto;background:var(--red-l);color:var(--red);font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px}
.nav-section{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;padding:10px 16px 4px}

/* Page */
.page-head{margin-bottom:20px}
.page-head h1{font-size:21px;font-weight:700}
.page-head p{font-size:13px;color:var(--muted);margin-top:2px}

/* Cards */
.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 20px;margin-bottom:14px}
.card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.card-title{font-size:14px;font-weight:600}

/* Stats */
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:14px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px}
.stat-label{font-size:11px;font-weight:500;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}
.stat-val{font-size:26px;font-weight:700;line-height:1}
.stat-sub{font-size:11px;color:var(--muted);margin-top:2px}

/* Buttons */
.btn{padding:8px 16px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;border-radius:8px;cursor:pointer;border:1px solid var(--border);background:#fff;color:#374151;transition:all .15s}
.btn:hover{background:#f3f4f6}
.btn-primary{background:var(--brand);color:#fff;border-color:var(--brand)}
.btn-primary:hover{background:var(--brand-d)}
.btn-sm{padding:5px 11px;font-size:12px;font-family:'Outfit',sans-serif;font-weight:500;border-radius:6px;cursor:pointer;border:1px solid var(--border);background:#fff;color:#374151}
.btn-sm:hover{background:#f3f4f6}
.btn-approve{padding:5px 12px;font-size:12px;font-weight:600;background:var(--green-l);color:var(--green);border:none;border-radius:6px;cursor:pointer;font-family:'Outfit',sans-serif}
.btn-approve:hover{background:#bbf7d0}
.btn-reject{padding:5px 12px;font-size:12px;font-weight:600;background:var(--red-l);color:var(--red);border:none;border-radius:6px;cursor:pointer;font-family:'Outfit',sans-serif}
.btn-reject:hover{background:#fecaca}

/* Pills */
.pill{font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:.03em;display:inline-block}
.pill-pending{background:var(--amber-l);color:var(--amber)}
.pill-approved{background:var(--green-l);color:var(--green)}
.pill-rejected{background:var(--red-l);color:var(--red)}
.badge{font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:.04em}
.badge-student{background:var(--brand-l);color:var(--brand)}
.badge-faculty{background:var(--green-l);color:var(--green)}
.badge-admin{background:var(--purple-l);color:var(--purple)}

/* Achievement items */
.ach-list{display:flex;flex-direction:column;gap:8px}
.ach-item{display:flex;align-items:flex-start;gap:10px;padding:10px;background:#f9fafb;border-radius:10px;border:1px solid var(--border)}
.ach-icon{width:36px;height:36px;border-radius:8px;background:var(--brand-l);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.ach-body{flex:1}
.ach-title{font-size:13px;font-weight:600}
.ach-meta{font-size:11px;color:var(--muted);margin-top:1px}

/* Forms */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.form-row{display:flex;flex-direction:column;gap:5px}
.form-row.full{grid-column:1/-1}
.form-row label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
.form-row input,.form-row select,.form-row textarea{padding:9px 11px;font-family:'Outfit',sans-serif;font-size:13px;border:1px solid var(--border);border-radius:8px;background:#fff;color:#1a1a2e;outline:none}
.form-row input:focus,.form-row select:focus,.form-row textarea:focus{border-color:var(--brand)}
.drop-zone{border:2px dashed var(--border);border-radius:10px;padding:20px;text-align:center;font-size:13px;color:var(--muted);cursor:pointer;background:#f9fafb}
.drop-zone:hover{border-color:var(--brand);color:var(--brand)}

/* Table */
.data-table{width:100%;border-collapse:collapse;font-size:12px}
.data-table th{padding:8px 10px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);border-bottom:1px solid var(--border)}
.data-table td{padding:9px 10px;border-bottom:1px solid #f3f4f6}
.data-table tr:hover td{background:#f9fafb}

/* Portfolio header */
.portfolio-hero{background:linear-gradient(135deg,#1a56db 0%,#7e3af2 100%);border-radius:14px;padding:20px;color:#fff;margin-bottom:14px;display:flex;align-items:center;gap:16px}
.portfolio-avatar{width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0}

/* Bar chart */
.bar-chart{display:flex;align-items:flex-end;gap:8px;height:110px;padding:0 4px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bar{width:100%;border-radius:4px 4px 0 0;min-height:4px}
.bar-label{font-size:10px;color:var(--muted);text-align:center}
.bar-val{font-size:10px;font-weight:600}

/* NAAC */
.naac-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.naac-item{padding:12px;border:1px solid var(--border);border-radius:10px}
.naac-label{font-size:11px;font-weight:600;margin-bottom:5px}
.progress-bg{height:6px;background:#e5e7eb;border-radius:3px;overflow:hidden}
.progress-fill{height:100%;border-radius:3px}

/* Login */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f3f4f8}
.login-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:32px;width:380px}
.role-tabs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:16px}
.role-tab{padding:8px;font-size:12px;font-weight:500;border:1px solid var(--border);border-radius:8px;background:#fff;cursor:pointer;color:var(--muted);font-family:'Outfit',sans-serif;transition:all .15s}
.role-tab.active{background:var(--brand);color:#fff;border-color:var(--brand)}

/* Alerts */
.alert{padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:12px}
.alert-error{background:var(--red-l);color:var(--red)}
.alert-success{background:var(--green-l);color:var(--green)}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:6px}
@keyframes spin{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:2.5rem;color:var(--muted);font-size:13px}
.tag{display:inline-block;font-size:10px;padding:2px 7px;border-radius:4px;background:#f3f4f6;color:var(--muted);margin-right:4px;border:1px solid var(--border)}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px}
`;

// ─── Utility ─────────────────────────────────────────────
const ICONS = {
  Certification:"☁️", Conference:"📄", Competition:"🏆",
  Internship:"💼", Leadership:"💡", "Community Service":"🤝",
  "Club Activity":"🎭", Workshop:"📋",
};
const catIcon = c => ICONS[c] || "📜";
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "";

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div style={{position:"fixed",bottom:20,right:20,background:"#1a1a2e",color:"#fff",padding:"10px 18px",borderRadius:10,fontSize:13,fontWeight:500,zIndex:9999,animation:"none",boxShadow:"0 4px 12px rgba(0,0,0,.2)"}}>{msg}</div>;
}

function Spinner() { return <span className="spinner" />; }

// ─── Login ────────────────────────────────────────────────
function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("arjun@git.edu");
  const [password, setPassword] = useState("student123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const presets = {
    student: { email:"arjun@git.edu", password:"student123" },
    faculty: { email:"priya@git.edu", password:"faculty123" },
    admin:   { email:"admin@git.edu", password:"admin123" },
  };

  const pickRole = r => {
    setRole(r); setError("");
    setEmail(presets[r].email); setPassword(presets[r].password);
  };

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const { user } = await api.login(email, password);
      onLogin(user);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
          <span style={{fontSize:26}}>🎓</span>
          <div><div style={{fontSize:18,fontWeight:700,color:"var(--brand)"}}>Smart Student Hub</div><div style={{fontSize:12,color:"var(--muted)"}}>Centralised Digital Platform for HEIs</div></div>
        </div>
        <div className="role-tabs">
          {["student","faculty","admin"].map(r => <button key={r} className={`role-tab${role===r?" active":""}`} onClick={()=>pickRole(r)}>{r.charAt(0).toUpperCase()+r.slice(1)}</button>)}
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
          <div className="form-row"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" /></div>
          <div className="form-row"><label>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" /></div>
        </div>
        <button className="btn btn-primary" style={{width:"100%",padding:11}} onClick={submit} disabled={loading}>
          {loading && <Spinner />}Sign In →
        </button>
        <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:10}}>Demo logins pre-filled · Switch role tabs</div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("");
  const [toast, setToast] = useState("");
  const showToast = msg => setToast(msg);

  const login = u => {
    setUser(u);
    setPage(u.role === "student" ? "dashboard" : u.role === "faculty" ? "verify" : "overview");
  };

  if (!user) return <><style>{G}</style><Login onLogin={login} /></>;

  const navItems = {
    student: [
      { id:"dashboard", icon:"🏠", label:"Dashboard" },
      { id:"upload",    icon:"⬆️", label:"Upload Achievement" },
      { id:"achievements", icon:"🏅", label:"My Achievements" },
      { id:"portfolio", icon:"🎨", label:"My Portfolio" },
    ],
    faculty: [
      { id:"verify",   icon:"✅", label:"Verify Submissions", hasBadge:true },
      { id:"batches",  icon:"👥", label:"My Batches" },
      { id:"students", icon:"🎓", label:"Student Records" },
    ],
    admin: [
      { id:"overview",   icon:"📊", label:"Overview" },
      { id:"naac",       icon:"📋", label:"NAAC Reports" },
      { id:"allbatches", icon:"📚", label:"All Batches" },
      { id:"manage",     icon:"⚙️", label:"Manage Users" },
    ],
  };

  const avatarColors = { student:"#1a56db", faculty:"#0e9f6e", admin:"#7e3af2" };
  const initials = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  const panels = { student: StudentPanels, faculty: FacultyPanels, admin: AdminPanels };
  const PanelComponent = panels[user.role];

  return (
    <>
      <style>{G}</style>
      <div className="shell">
        <div className="topbar">
          <div className="topbar-logo"><span>🎓</span> Smart Student Hub</div>
          <div className="topbar-user">
            <div className="avatar" style={{background:avatarColors[user.role]}}>{initials}</div>
            <div><div style={{fontSize:13,fontWeight:600}}>{user.name}</div><span className={`badge badge-${user.role}`}>{user.role}</span></div>
            <button className="btn-sm" onClick={()=>setUser(null)}>Logout</button>
          </div>
        </div>
        <div className="main-wrap">
          <div className="sidebar">
            {navItems[user.role].map(item => (
              <div key={item.id} className={`nav-item${page===item.id?" active":""}`} onClick={()=>setPage(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="content">
            <PanelComponent page={page} user={user} setPage={setPage} showToast={showToast} />
          </div>
        </div>
      </div>
      {toast && <Toast msg={toast} onClose={()=>setToast("")} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// STUDENT PANELS
// ═══════════════════════════════════════════════════════════
function StudentPanels({ page, user, setPage, showToast }) {
  const [achs, setAchs] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try { setAchs(await api.getAchievements({ studentId: user.id })); }
    catch(e) { showToast("❌ " + e.message); }
    finally { setLoading(false); }
  }, [user.id, showToast]);

  useEffect(() => { reload(); }, [reload]);

  if (page === "dashboard") return <StudentDashboard user={user} achs={achs} loading={loading} setPage={setPage} />;
  if (page === "upload") return <UploadAch user={user} onDone={() => { reload(); setPage("achievements"); }} showToast={showToast} />;
  if (page === "achievements") return <AchievementsList achs={achs} loading={loading} onDelete={async id => { await api.deleteAchievement(id); showToast("🗑 Deleted"); reload(); }} setPage={setPage} />;
  if (page === "portfolio") return <Portfolio user={user} achs={achs} showToast={showToast} />;
  return null;
}

function StudentDashboard({ user, achs, loading, setPage }) {
  const approved = achs.filter(a => a.status === "approved").length;
  const pending  = achs.filter(a => a.status === "pending").length;
  return (
    <div>
      <div className="page-head"><h1>My Dashboard</h1><p>Welcome back, {user.name} 👋 · {user.dept} · {user.batch}</p></div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total</div><div className="stat-val" style={{color:"var(--brand)"}}>{achs.length}</div><div className="stat-sub">achievements</div></div>
        <div className="stat-card"><div className="stat-label">Verified</div><div className="stat-val" style={{color:"var(--green)"}}>{approved}</div><div className="stat-sub">approved</div></div>
        <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-val" style={{color:"var(--amber)"}}>{pending}</div><div className="stat-sub">awaiting review</div></div>
        <div className="stat-card"><div className="stat-label">CGPA</div><div className="stat-val" style={{color:"var(--purple)"}}>{user.cgpa || "—"}</div><div className="stat-sub">current</div></div>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Recent Achievements</div><button className="btn-sm" onClick={()=>setPage("achievements")}>View all →</button></div>
        {loading ? <div className="empty">Loading…</div> : achs.length === 0 ? <div className="empty">No achievements yet. Upload your first one!</div>
          : <div className="ach-list">{achs.slice(0,4).map(a => <AchItem key={a.id} a={a} />)}</div>}
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:10}}>Quick Actions</div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-primary" onClick={()=>setPage("upload")}>⬆️ Upload Achievement</button>
          <button className="btn" onClick={()=>setPage("portfolio")}>🎨 View Portfolio</button>
        </div>
      </div>
    </div>
  );
}

function AchItem({ a, onDelete }) {
  const statusCls = {approved:"pill-approved",pending:"pill-pending",rejected:"pill-rejected"};
  const statusLbl = {approved:"Verified",pending:"Pending",rejected:"Rejected"};
  return (
    <div className="ach-item">
      <div className="ach-icon">{catIcon(a.category)}</div>
      <div className="ach-body">
        <div className="ach-title">{a.title}</div>
        <div className="ach-meta">{a.category} · {a.org} · {fmtDate(a.date)}</div>
        {a.studentName && <div className="ach-meta" style={{color:"var(--brand)"}}>{a.studentName} · {a.rollNo}</div>}
        {a.description && <div className="ach-meta" style={{marginTop:2}}>{a.description}</div>}
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
        <span className={`pill ${statusCls[a.status]}`}>{statusLbl[a.status]}</span>
        {a.fileUrl && <a href={a.fileUrl} target="_blank" rel="noreferrer" style={{fontSize:11,color:"var(--brand)"}}>📎 View cert</a>}
        {onDelete && <button className="btn-sm" style={{color:"var(--red)"}} onClick={()=>onDelete(a.id)}>Delete</button>}
      </div>
    </div>
  );
}

function AchievementsList({ achs, loading, onDelete, setPage }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? achs : achs.filter(a => a.status === filter);
  return (
    <div>
      <div className="page-head"><h1>All Achievements</h1><p>Your complete activity record</p></div>
      <div className="card">
        <div className="card-head">
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[["all","All"],["approved","Verified"],["pending","Pending"],["rejected","Rejected"]].map(([v,l])=>(
              <button key={v} className={`btn-sm${filter===v?" btn-primary":""}`} onClick={()=>setFilter(v)}>{l} ({(v==="all"?achs:achs.filter(a=>a.status===v)).length})</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={()=>setPage("upload")}>+ Add</button>
        </div>
        {loading ? <div className="empty">Loading…</div> : filtered.length === 0 ? <div className="empty">Nothing here.</div>
          : <div className="ach-list">{filtered.map(a => <AchItem key={a.id} a={a} onDelete={onDelete} />)}</div>}
      </div>
    </div>
  );
}

function UploadAch({ user, onDone, showToast }) {
  const [form, setForm] = useState({ title:"", category:"Certification", org:"", date:"", description:"" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("studentId", user.id);
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (file) fd.append("file", file);
      await api.submitAchievement(fd);
      showToast("✅ Submitted! Awaiting faculty verification.");
      onDone();
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-head"><h1>Upload Achievement</h1><p>Submit for faculty verification</p></div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-grid">
          <div className="form-row full"><label>Achievement Title *</label><input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. AWS Solutions Architect" /></div>
          <div className="form-row"><label>Category</label>
            <select value={form.category} onChange={e=>set("category",e.target.value)}>
              {["Certification","Conference","Competition","Internship","Leadership","Community Service","Club Activity","Workshop"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-row"><label>Issuing Organisation</label><input value={form.org} onChange={e=>set("org",e.target.value)} placeholder="e.g. Amazon Web Services" /></div>
          <div className="form-row"><label>Date</label><input type="date" value={form.date} onChange={e=>set("date",e.target.value)} /></div>
          <div className="form-row full"><label>Description</label><textarea rows={3} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe the achievement…" style={{resize:"vertical"}} /></div>
          <div className="form-row full"><label>Certificate / Proof (optional)</label>
            <div className="drop-zone" onClick={()=>document.getElementById("fileInput").click()}>
              {file ? `✅ ${file.name}` : "📎 Click to upload (PDF, PNG, JPG — max 5MB)"}
            </div>
            <input id="fileInput" type="file" accept=".pdf,.png,.jpg,.jpeg" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])} />
          </div>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading && <Spinner />}Submit for Verification →</button>
        </div>
      </div>
    </div>
  );
}

function Portfolio({ user, achs, showToast }) {
  const approved = achs.filter(a => a.status === "approved");
  return (
    <div>
      <div className="page-head"><h1>Auto-Generated Portfolio</h1><p>Verified achievements compiled into your shareable profile</p></div>
      <div className="portfolio-hero">
        <div className="portfolio-avatar">{user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:20,fontWeight:700}}>{user.name}</div>
          <div style={{fontSize:12,opacity:.8,marginTop:2}}>B.Tech {user.dept} · CGPA {user.cgpa} · {user.batch}</div>
          <div style={{fontSize:12,opacity:.8}}>Roll No: {user.rollNo}</div>
          <div style={{display:"flex",gap:20,marginTop:10}}>
            {[["Verified",approved.length],["Total",achs.length]].map(([l,v])=>(
              <div key={l} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700}}>{v}</div><div style={{fontSize:10,opacity:.8}}>{l}</div></div>
            ))}
          </div>
        </div>
        <button onClick={()=>showToast("📄 PDF export — connect to pdf-lib or puppeteer backend")} style={{padding:"8px 14px",background:"rgba(255,255,255,.2)",color:"#fff",border:"1px solid rgba(255,255,255,.4)",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>Export PDF</button>
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:10}}>Verified Achievements ({approved.length})</div>
        {approved.length === 0 ? <div className="empty">No verified achievements yet.</div>
          : <div className="ach-list">{approved.map(a => <AchItem key={a.id} a={a} />)}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FACULTY PANELS
// ═══════════════════════════════════════════════════════════
function FacultyPanels({ page, user, setPage, showToast }) {
  const [pending, setPending] = useState([]);
  const [loadPending, setLoadPending] = useState(true);

  const reloadPending = useCallback(async () => {
    setLoadPending(true);
    try { setPending(await api.getAchievements({ facultyId: user.id, status: "pending" })); }
    catch(e) { showToast("❌ " + e.message); }
    finally { setLoadPending(false); }
  }, [user.id, showToast]);

  useEffect(() => { reloadPending(); }, [reloadPending]);

  const verify = async (id, status) => {
    try {
      await api.verifyAchievement(id, status, user.id);
      showToast(status === "approved" ? "✅ Approved! Added to portfolio." : "❌ Rejected. Student notified.");
      reloadPending();
    } catch(e) { showToast("❌ " + e.message); }
  };

  if (page === "verify") return <VerifyQueue pending={pending} loading={loadPending} onVerify={verify} />;
  if (page === "batches") return <FacultyBatches user={user} setPage={setPage} showToast={showToast} />;
  if (page === "students") return <FacultyStudents user={user} showToast={showToast} />;
  return null;
}

function VerifyQueue({ pending, loading, onVerify }) {
  return (
    <div>
      <div className="page-head"><h1>Verification Queue</h1><p>Review and approve student achievement submissions</p></div>
      {loading ? <div className="card"><div className="empty">Loading…</div></div>
        : pending.length === 0 ? <div className="card"><div className="empty">🎉 All caught up! No pending submissions.</div></div>
        : <div className="card">
          <div className="card-head"><div className="card-title">Pending ({pending.length})</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {pending.map(a => (
              <div key={a.id} style={{border:"1px solid var(--border)",borderRadius:10,padding:14}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div className="ach-icon">{catIcon(a.category)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600}}>{a.title}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{a.studentName} · {a.rollNo} · {a.category} · {fmtDate(a.date)}</div>
                    {a.description && <div style={{fontSize:12,color:"#374151",marginTop:4}}>{a.description}</div>}
                    {a.fileUrl && <a href={a.fileUrl} target="_blank" rel="noreferrer" style={{fontSize:11,color:"var(--brand)",display:"block",marginTop:4}}>📎 View Certificate</a>}
                    <div style={{display:"flex",gap:8,marginTop:8}}>
                      <button className="btn-approve" onClick={()=>onVerify(a.id,"approved")}>✓ Approve</button>
                      <button className="btn-reject" onClick={()=>onVerify(a.id,"rejected")}>✕ Reject</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}
    </div>
  );
}

function FacultyBatches({ user, setPage, showToast }) {
  const [batches, setBatches] = useState([]);
  useEffect(() => {
    api.getBatches({ facultyId: user.id }).then(setBatches).catch(e => showToast("❌ " + e.message));
  }, [user.id, showToast]);
  return (
    <div>
      <div className="page-head"><h1>My Batches</h1><p>Mentor batches assigned to you</p></div>
      {batches.map(b => (
        <div key={b.id} style={{display:"flex",alignItems:"center",gap:12,padding:14,border:"1px solid var(--border)",borderRadius:12,background:"#fff",marginBottom:8}}>
          <div style={{width:42,height:42,borderRadius:10,background:"var(--brand-l)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👥</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:13}}>{b.name}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{b.dept} · {b.year} · {b.studentCount} students · <span style={{color:"var(--amber)"}}>{b.pendingCount} pending</span></div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn-sm" onClick={()=>setPage("students")}>View Students</button>
            <button className="btn btn-primary" style={{padding:"5px 12px",fontSize:12}} onClick={()=>setPage("verify")}>Review ({b.pendingCount})</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FacultyStudents({ user, showToast }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getStudents({ facultyId: user.id }).then(s => { setStudents(s); setLoading(false); }).catch(e => showToast("❌ " + e.message));
  }, [user.id, showToast]);
  return (
    <div>
      <div className="page-head"><h1>Student Records</h1><p>Students in your batches</p></div>
      <div className="card" style={{overflowX:"auto"}}>
        {loading ? <div className="empty">Loading…</div> :
        <table className="data-table">
          <thead><tr><th>Student</th><th>Roll No</th><th>Dept</th><th>Batch</th><th>Total</th><th>Verified</th><th>CGPA</th></tr></thead>
          <tbody>{students.map(s => (
            <tr key={s.id}>
              <td style={{fontWeight:600}}>{s.name}</td>
              <td style={{fontFamily:"'JetBrains Mono',monospace",color:"var(--muted)"}}>{s.rollNo}</td>
              <td>{s.dept}</td>
              <td>{s.batch}</td>
              <td><span className="pill pill-approved">{s.achievementCount}</span></td>
              <td><span className="pill pill-approved">{s.verifiedCount}</span></td>
              <td style={{fontWeight:600}}>{s.cgpa}</td>
            </tr>
          ))}</tbody>
        </table>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN PANELS
// ═══════════════════════════════════════════════════════════
function AdminPanels({ page, user, setPage, showToast }) {
  if (page === "overview")   return <AdminOverview showToast={showToast} />;
  if (page === "naac")       return <AdminNAAC showToast={showToast} />;
  if (page === "allbatches") return <AdminBatches showToast={showToast} />;
  if (page === "manage")     return <AdminManage showToast={showToast} />;
  return null;
}

function AdminOverview({ showToast }) {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.getAdminStats().then(setStats).catch(e => showToast("❌ " + e.message)); }, [showToast]);
  if (!stats) return <div className="empty">Loading…</div>;
  const cats = Object.entries(stats.byCategory).sort((a,b)=>b[1]-a[1]);
  const max = Math.max(...cats.map(([,v])=>v), 1);
  const barColors = ["var(--brand)","var(--purple)","var(--amber)","var(--green)","var(--teal)","var(--red)"];
  return (
    <div>
      <div className="page-head"><h1>Institution Overview</h1><p>Goa Institute of Technology · 2025–2026</p></div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Students</div><div className="stat-val" style={{color:"var(--brand)"}}>{stats.totalStudents}</div></div>
        <div className="stat-card"><div className="stat-label">Faculty</div><div className="stat-val" style={{color:"var(--green)"}}>{stats.totalFaculty}</div></div>
        <div className="stat-card"><div className="stat-label">Achievements</div><div className="stat-val" style={{color:"var(--purple)"}}>{stats.totalAchs}</div></div>
        <div className="stat-card"><div className="stat-label">Batches</div><div className="stat-val" style={{color:"var(--teal)"}}>{stats.totalBatches}</div></div>
        <div className="stat-card"><div className="stat-label">Approved</div><div className="stat-val" style={{color:"var(--green)"}}>{stats.approved}</div></div>
        <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-val" style={{color:"var(--amber)"}}>{stats.pending}</div></div>
      </div>
      <div className="card">
        <div className="card-title" style={{marginBottom:12}}>Achievements by Category</div>
        <div className="bar-chart">
          {cats.map(([cat, val], i) => (
            <div key={cat} className="bar-col">
              <div className="bar-val" style={{color:barColors[i%barColors.length]}}>{val}</div>
              <div className="bar" style={{height:`${(val/max)*90}px`,background:barColors[i%barColors.length]}} />
              <div className="bar-label">{cat.split(" ")[0]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminNAAC({ showToast }) {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.getAdminStats().then(setStats).catch(e => showToast("❌ " + e.message)); }, [showToast]);
  const criteria = [
    { label:"C 3.1 – Research / Conferences", key:"Conference", max:50 },
    { label:"C 3.3 – Extension / Community", key:"Community Service", max:30 },
    { label:"C 4.4 – Certifications", key:"Certification", max:80 },
    { label:"C 5.1 – Leadership & Clubs", key:"Leadership", max:40 },
    { label:"C 5.3 – Competitions", key:"Competition", max:40 },
    { label:"C 3.4 – Internships", key:"Internship", max:60 },
  ];
  return (
    <div>
      <div className="page-head"><h1>NAAC Accreditation Reports</h1><p>Consolidated data for accreditation documentation</p></div>
      <div className="card">
        <div className="card-head">
          <div className="card-title">Criterion-wise Coverage</div>
          <button className="btn btn-primary" onClick={()=>showToast("📊 NAAC report export — connect to xlsx generator")}>Export Report</button>
        </div>
        <div className="naac-grid">
          {criteria.map(c => {
            const val = stats ? (stats.byCategory[c.key] || 0) : 0;
            const pct = Math.min(100, Math.round((val / c.max) * 100));
            return (
              <div key={c.key} className="naac-item">
                <div className="naac-label">{c.label}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div className="progress-bg" style={{flex:1}}><div className="progress-fill" style={{width:`${pct}%`,background:"var(--brand)"}} /></div>
                  <span style={{fontSize:12,fontWeight:700,minWidth:36}}>{val} / {c.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AdminBatches({ showToast }) {
  const [batches, setBatches] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name:"", dept:"", year:"1st Year" });

  const load = useCallback(() => { api.getBatches().then(setBatches).catch(e => showToast("❌ " + e.message)); }, [showToast]);
  useEffect(() => load(), [load]);

  const create = async () => {
    if (!form.name.trim() || !form.dept.trim()) { showToast("❌ Name and dept required"); return; }
    await api.createBatch(form);
    showToast("✅ Batch created!");
    setCreating(false);
    setForm({ name:"", dept:"", year:"1st Year" });
    load();
  };

  return (
    <div>
      <div className="page-head"><h1>All Batches</h1><p>Manage batches and mentor assignments</p></div>
      <div className="card">
        <div className="card-head">
          <div className="card-title">{batches.length} batches</div>
          <button className="btn btn-primary" onClick={()=>setCreating(v=>!v)}>+ New Batch</button>
        </div>
        {creating && (
          <div style={{background:"#f9fafb",border:"1px solid var(--border)",borderRadius:10,padding:14,marginBottom:12}}>
            <div className="form-grid" style={{marginBottom:10}}>
              <div className="form-row"><label>Batch Name</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. CSE-A 2024" /></div>
              <div className="form-row"><label>Department</label><input value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))} placeholder="e.g. CSE" /></div>
              <div className="form-row"><label>Year</label>
                <select value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))}>
                  {["1st Year","2nd Year","3rd Year","4th Year"].map(y=><option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={create}>Create Batch</button>
          </div>
        )}
        {batches.map(b => (
          <div key={b.id} style={{display:"flex",alignItems:"center",gap:12,padding:12,border:"1px solid var(--border)",borderRadius:10,background:"#fff",marginBottom:8}}>
            <div style={{width:38,height:38,borderRadius:9,background:"var(--brand-l)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📚</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{b.name}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{b.dept} · {b.year} · {b.studentCount} students · Mentor: {b.facultyName}</div>
            </div>
            <button className="btn-sm" onClick={()=>showToast("✏️ Edit batch — extend with modal form")}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminManage({ showToast }) {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    api.getStudents().then(setStudents).catch(e => showToast("❌ " + e.message));
  }, [showToast]);
  return (
    <div>
      <div className="page-head"><h1>Manage Users</h1><p>All registered students and faculty</p></div>
      <div className="card" style={{overflowX:"auto"}}>
        <div className="card-head"><div className="card-title">Students ({students.length})</div></div>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Roll No</th><th>Batch</th><th>Achievements</th><th>Verified</th></tr></thead>
          <tbody>{students.map(s => (
            <tr key={s.id}>
              <td style={{fontWeight:600}}>{s.name}</td>
              <td style={{color:"var(--muted)",fontSize:11}}>{s.email}</td>
              <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>{s.rollNo}</td>
              <td>{s.batch}</td>
              <td>{s.achievementCount}</td>
              <td><span className="pill pill-approved">{s.verifiedCount}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
