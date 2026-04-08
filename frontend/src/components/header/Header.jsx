import React, { useState, useEffect } from "react";
import { CLIENTROUTES } from "../../../../backend/routes/clientRoutes";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  UserCog,
  TrendingUp,
  Wallet,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  GraduationCap,
} from "lucide-react";

const MENU_ITEMS = [
  { name: "Dashboard",  path: CLIENTROUTES.DASHBOARD,     icon: LayoutDashboard },
  { name: "Students",   path: CLIENTROUTES.LIST_STUDENTS, icon: Users },
  { name: "Courses",    path: CLIENTROUTES.COURSES,       icon: BookOpen },
  { name: "Attendance", path: CLIENTROUTES.ATTENDANCE,    icon: CalendarCheck },
  { name: "Staffs",     path: CLIENTROUTES.STAFFS,        icon: UserCog },
  { name: "Investment", path: CLIENTROUTES.INVESTMENT,    icon: TrendingUp },
  { name: "Fees",       path: CLIENTROUTES.FEES,          icon: Wallet },
  { name: "Expenses",   path: CLIENTROUTES.EXPENSES,      icon: CreditCard },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authFlag");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // close mobile drawer on resize to lg
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  // ─── Shared nav link renderer ────────────────────────────────────────────
  const NavLink = ({ item, onClick }) => {
    const active = isActive(item.path);
    const Icon = item.icon;
    return (
      <a
        href={item.path}
        onClick={onClick}
        title={collapsed ? item.name : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group
          ${active
            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          }`}
      >
        <Icon
          size={20}
          className={`shrink-0 transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`}
        />
        {!collapsed && <span className="truncate">{item.name}</span>}
      </a>
    );
  };

  // ─── Sidebar content (shared between desktop + mobile drawer) ────────────
  const SidebarContent = ({ onLinkClick }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 shrink-0 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-gray-900 text-lg tracking-tight whitespace-nowrap">
            Quadros
          </span>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {!collapsed && (
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Menu
          </p>
        )}
        {MENU_ITEMS.map((item) => (
          <NavLink key={item.name} item={item} onClick={onLinkClick} />
        ))}
      </div>

      {/* Footer */}
      <div className={`shrink-0 p-3 border-t border-gray-100 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <button
            onClick={() => { onLinkClick?.(); handleLogout(); }}
            title="Logout"
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
          </button>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white font-bold text-xs">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">John Doe</p>
              <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">Admin</p>
            </div>
            <button
              onClick={() => { onLinkClick?.(); handleLogout(); }}
              title="Logout"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Top Bar ─────────────────────────────────────────────── */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 shrink-0 z-30 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base">Quadros</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ──────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close btn */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors z-10"
        >
          <ChevronLeft size={20} />
        </button>
        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
      </div>

      {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col h-full bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out shrink-0 relative
          ${collapsed ? "w-[68px]" : "w-64"}`}
      >
        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-all"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <SidebarContent />
      </aside>
    </>
  );
}

export default Header;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authFlag");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const MENU_ITEMS = [
    { name: "Dashboard", path: CLIENTROUTES.DASHBOARD, icon: "📊" },
    { name: "Students", path: CLIENTROUTES.LIST_STUDENTS, icon: "👥" },
    { name: "Courses", path: CLIENTROUTES.COURSES, icon: "📚" },
    { name: "Attendance", path: CLIENTROUTES.ATTENDANCE, icon: "📅" },
    { name: "Staffs", path: CLIENTROUTES.STAFFS, icon: "🧑‍🏫" },
    { name: "Investment", path: CLIENTROUTES.INVESTMENT, icon: "📈" },
    { name: "Fees", path: CLIENTROUTES.FEES, icon: "⚙️" },
    { name: "Expenses", path: CLIENTROUTES.EXPENSES, icon: "💳" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 shadow-sm w-full shrink-0 z-30 relative border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-sm">QP</span>
          </div>
          <h1 className="text-gray-900 font-bold text-lg">Quadros</h1>
        </div>
        <button
          className="text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all"
          onClick={() => setIsOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar background overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (Desktop fixed width, Mobile off-canvas) */}
      <div className={`fixed lg:static top-0 left-0 h-full w-72 bg-white shadow-xl lg:shadow-none z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 p-6 shrink-0 bg-white lg:border-none border-b border-gray-100">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-200">
             <span className="text-white font-bold text-xl">🎓</span>
           </div>
           <h2 className="text-gray-900 font-bold text-2xl tracking-tight">Quadros</h2>
           {/* Close button for mobile */}
           <button className="lg:hidden ml-auto text-gray-500 p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsOpen(false)}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 no-scrollbar">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-2">Menu</p>
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <a
                key={item.name}
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
                onClick={() => setIsOpen(false)}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-transform duration-200 ${isActive ? 'scale-110 bg-blue-100' : 'bg-gray-50 group-hover:bg-blue-50 group-hover:scale-110'}`}>
                   <span className="text-lg">{item.icon}</span>
                </div>
                <span className="font-semibold text-[15px]">{item.name}</span>
              </a>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
          <div className="flex items-center justify-between px-2 py-2 mb-2">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-blue-200 border-2 border-white">
                 <span className="text-white font-medium text-sm">JD</span>
               </div>
               <div className="overflow-hidden">
                 <h4 className="font-bold text-gray-900 text-sm truncate">John Doe</h4>
                 <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wide truncate">Admin</p>
               </div>
             </div>
             <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
             </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

