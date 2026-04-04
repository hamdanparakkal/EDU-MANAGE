import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";

const navItems = [
  { to: "/admin/", icon: "fa-house", label: "Dashboard" },
  { to: "/admin/myprofile", icon: "fa-user", label: "Profile" },
  { to: "/admin/editprofile", icon: "fa-user-pen", label: "Edit Profile" },
  { to: "/admin/changepassword", icon: "fa-unlock", label: "Change Password" },
  { to: "/admin/viewteacher", icon: "fa-chalkboard-user", label: "View Teacher" },
  { to: "/admin/Adminreg", icon: "fa-address-card", label: "Registration" },
  { to: "/admin/sem", icon: "fa-book", label: "Semester" },
  { to: "/admin/year", icon: "fa-calendar", label: "Year" },
  { to: "/admin/Department", icon: "fa-building", label: "Department" },
  { to: "/admin/course", icon: "fa-graduation-cap", label: "Course" },
  { to: "/admin/subject", icon: "fa-book-open-reader", label: "Subject" },
  { to: "/admin/info", icon: "fa-circle-info", label: "Info" },
  { to: "/admin/class", icon: "fa-school", label: "Class" },
  { to: "/admin/viewcomplaint", icon: "fa-comment", label: "View Complaint" },
  { to: "/admin/viewFeedback", icon: "fa-message", label: "View Feedback" },
  { to: "/admin/reportteachers", icon: "fa-chart-bar", label: "Report" },
];

const sections = [
  { label: "Navigation", items: navItems.slice(0, 4) },
  { label: "Management", items: navItems.slice(4, 13) },
  { label: "Feedback & Reports", items: navItems.slice(13) },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("aid");
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        .sb {
          position: sticky; top: 0; height: 100%;
          width: 80px;
          background: rgba(255, 255, 255, 0.75);
          border-right: 1px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 10px 0 30px rgba(0,0,0,0.02);
          display: flex; flex-direction: column;
          transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden; z-index: 100; flex-shrink: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sb.open { width: 260px; }

        /* Brand */
        .sb-brand {
          display: flex; align-items: center; gap: 14px;
          padding: 16px;
          border-bottom: 1px solid rgba(0,0,0,0.03);
          min-height: 80px; overflow: hidden;
          white-space: nowrap; flex-shrink: 0;
          justify-content: center;
        }
        .sb.open .sb-brand { justify-content: flex-start; padding: 16px 24px; }

        .sb-brand-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #fb923c, #f43f5e);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(251,146,60,0.35);
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes bounceIn {
          0% { transform: scale(0); rotate: -20deg; }
          60% { transform: scale(1.1); rotate: 10deg; }
          100% { transform: scale(1); rotate: 0; }
        }

        .sb-brand-text {
          font-size: 16px; font-weight: 850; color: #111827;
          white-space: nowrap; opacity: 0; transform: translateX(-20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #111827, #4b5563);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: none;
        }
        .sb.open .sb-brand-text { opacity: 1; transform: translateX(0); display: block; }

        /* Nav */
        .sb-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 12px; display: flex; flex-direction: column; gap: 6px;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.05) transparent;
        }
        .sb-nav::-webkit-scrollbar { width: 4px; }
        .sb-nav::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }

        .sb-section {
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #9ca3af; padding: 20px 16px 8px;
          white-space: nowrap; overflow: hidden;
          opacity: 0; max-height: 0;
          transition: all 0.3s ease;
          display: none;
        }
        .sb.open .sb-section { opacity: 1; max-height: 40px; display: block; }

        .sb-divider { height: 1px; background: rgba(0,0,0,0.03); margin: 8px 12px; flex-shrink: 0; }

        /* Links */
        .sb-link {
          display: flex; align-items: center; 
          padding: 12px; border-radius: 14px;
          text-decoration: none; color: #6b7280;
          font-size: 14px; font-weight: 600;
          white-space: nowrap; overflow: hidden;
          cursor: pointer; position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          justify-content: center;
          margin-bottom: 2px;
        }
        .sb.open .sb-link { justify-content: flex-start; padding-left: 20px; gap: 14px; }

        .sb-link:hover { 
          background: rgba(251, 146, 60, 0.08); 
          color: #111827;
          border-color: rgba(251, 146, 60, 0.1);
          transform: translateX(4px);
        }
        .sb.open .sb-link:hover { transform: translateX(8px); }
        
        .sb-link:hover .sb-icon { 
          color: #fb923c; 
          transform: scale(1.2) rotate(5deg);
        }

        .sb-link.active {
          background: linear-gradient(135deg, rgba(251, 146, 60, 0.12) 0%, rgba(244, 63, 94, 0.12) 100%);
          color: #f43f5e;
          border-color: rgba(244, 63, 94, 0.15);
          box-shadow: 0 4px 15px rgba(244, 63, 94, 0.05);
        }
        .sb-link.active .sb-icon { color: #f43f5e; animation: pulseIcon 2s infinite; }

        @keyframes pulseIcon {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .sb-icon {
          font-size: 18px; width: 24px; text-align: center;
          flex-shrink: 0; color: #9ca3af;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sb-label {
          opacity: 0; transform: translateX(-15px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: none;
        }
        .sb.open .sb-label { 
          display: block; opacity: 1; transform: translateX(0); 
          animation: slideInFade 0.4s ease-out forwards;
        }
        @keyframes slideInFade {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Footer */
        .sb-footer { border-top: 1px solid rgba(0,0,0,0.03); padding: 12px; flex-shrink: 0; }
        .sb-logout {
          display: flex; align-items: center; 
          padding: 12px; border-radius: 14px;
          color: #ef4444; font-size: 14px; font-weight: 700;
          cursor: pointer; white-space: nowrap; overflow: hidden;
          transition: all 0.3s ease;
          justify-content: center;
        }
        .sb.open .sb-logout { justify-content: flex-start; padding-left: 16px; gap: 14px; }

        .sb-logout:hover { 
          background: rgba(239, 68, 68, 0.08); 
          transform: translateX(4px);
          color: #dc2626;
        }
        .sb.open .sb-logout:hover { transform: translateX(8px); }
        .sb-logout .sb-icon { color: #f87171; transition: transform 0.3s; }
        .sb-logout:hover .sb-icon { transform: rotate(-15deg) scale(1.1); }
      `}</style>

      <aside
        className={`sb${isOpen ? " open" : ""}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="sb-brand">
          <div className="sb-brand-icon">🎓</div>
          <span className="sb-brand-text">LMS Admin</span>
        </div>

        <nav className="sb-nav">
          {sections.map((section, si) => (
            <div key={section.label}>
              {si > 0 && <div className="sb-divider" />}
              <div className="sb-section">{section.label}</div>
              {section.items.map(item => (
                <Link key={item.to} to={item.to}
                  className={`sb-link${location.pathname === item.to ? " active" : ""}`}
                  title={!isOpen ? item.label : undefined}>
                  <i className={`fa-solid ${item.icon} sb-icon`}></i>
                  <span className="sb-label">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="sb-logout" title={!isOpen ? "Logout" : undefined} onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket sb-icon"></i>
            <span className="sb-label">Logout</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;