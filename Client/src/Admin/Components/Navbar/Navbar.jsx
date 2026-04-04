import React from "react";
import img from "/OIP (2).webp";

const Navbar = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .nb {
          width: 100%;
          height: 62px;
          background: rgba(255,255,255,0.9);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 1px 12px rgba(0,0,0,0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-sizing: border-box;
        }

        .nb-left { display: flex; align-items: center; gap: 10px; }

        .nb-logo {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #fb923c 0%, #f43f5e 100%);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 3px 10px rgba(251,146,60,0.35);
          flex-shrink: 0;
        }
        .nb-logo svg { width: 16px; height: 16px; fill: #fff; }

        .nb-title { font-size: 14px; font-weight: 700; color: #111827; }

        .nb-badge {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #fb923c;
          background: rgba(251,146,60,0.1);
          border: 1px solid rgba(251,146,60,0.25);
          padding: 3px 9px; border-radius: 20px;
        }

        .nb-right { display: flex; align-items: center; gap: 10px; }

        .nb-icon-btn {
          width: 36px; height: 36px; border-radius: 10px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative;
          transition: box-shadow 0.15s;
        }
        .nb-icon-btn:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .nb-icon-btn svg { width: 15px; height: 15px; color: #6b7280; }

        .nb-dot {
          position: absolute; top: 8px; right: 8px;
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef4444;
          border: 1.5px solid #fff;
        }

        .nb-sep { width: 1px; height: 22px; background: rgba(0,0,0,0.08); }

        .nb-user {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 12px 4px 4px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: box-shadow 0.15s;
        }
        .nb-user:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.09); }

        .nb-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          object-fit: cover; border: 2px solid rgba(0,0,0,0.07); display: block;
        }
        .nb-avatar-fb {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, #fb923c, #f43f5e);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          border: 2px solid rgba(0,0,0,0.07); flex-shrink: 0;
        }
        .nb-uname { font-size: 12px; font-weight: 600; color: #111827; line-height: 1.3; }
        .nb-urole { font-size: 10px; color: #9ca3af; }
        .nb-chev { width: 12px; height: 12px; color: #9ca3af; flex-shrink: 0; }
      `}</style>

      <header className="nb">
        <div className="nb-left">
          <div className="nb-logo">
            <svg viewBox="0 0 24 24"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z"/></svg>
          </div>
          <span className="nb-title">Admin Portal</span>
          <span className="nb-badge">LMS</span>
        </div>

        <div className="nb-right">
          <div className="nb-icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="nb-dot"></span>
          </div>

          <div className="nb-sep" />

          <div className="nb-user">
            <img src={img} alt="Admin" className="nb-avatar"
              onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
            <div className="nb-avatar-fb" style={{display:"none"}}>AD</div>
            <div>
              <div className="nb-uname">Admin User</div>
              <div className="nb-urole">Administrator</div>
            </div>
            <svg className="nb-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;