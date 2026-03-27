import { useNavigate, useLocation } from "react-router";
import { Home, TrendingUp, UtensilsCrossed, Camera, CircleDot, User, ChevronLeft, Sparkles } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 bg-surface-container-low p-4.5 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-48'}`}
      style={{ borderRight: '1px solid var(--outline-variant)' }}
    >
      {/* Logo */}
      <div className="mb-9">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)' }}>
            <span className="text-lg" style={{ color: 'var(--primary-foreground)' }}>🥗</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
              NutriPlan
            </span>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="mb-4 w-full flex items-center justify-center px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all duration-200 rounded-md"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronLeft className="w-5 h-5" style={{ transform: 'scaleX(-1)' }} /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => navigate("/dashboard")}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-md transition-all duration-200${!isActive("/dashboard") && 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
          style={
            isActive("/dashboard")
              ? {
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                color: 'var(--primary-foreground)',
                fontFamily: 'var(--font-family-body)',
                fontWeight: 600,
              }
              : { fontFamily: 'var(--font-family-body)', fontWeight: 600 }
          }
          title="Home"
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>Home</span>}
        </button>

        <button
          onClick={() => navigate("/ai-chat")}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-md transition-all duration-200 ${!isActive("/ai-chat") && 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
          style={
            isActive("/ai-chat")
              ? {
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                color: 'var(--primary-foreground)',
                fontFamily: 'var(--font-family-body)',
                fontWeight: 600,
              }
              : { fontFamily: 'var(--font-family-body)', fontWeight: 600 }
          }
          title="AI Coach"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>AI Coach</span>}
        </button>

        <button
          onClick={() => navigate("/meal-plan")}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-md transition-all duration-200 ${!isActive("/meal-plan") && 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
          style={
            isActive("/meal-plan")
              ? {
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                color: 'var(--primary-foreground)',
                fontFamily: 'var(--font-family-body)',
                fontWeight: 600,
              }
              : { fontFamily: 'var(--font-family-body)', fontWeight: 600 }
          }
          title="Meal Plan"
        >
          <UtensilsCrossed className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Meal Plan</span>}
        </button>
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-2">
        <button
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 text-on-surface-variant hover:text-on-surface transition-all duration-200 rounded-md`}
          style={{ fontFamily: 'var(--font-family-body)' }}
          title="Support"
        >
          <CircleDot className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Support</span>}
        </button>
        <button
          onClick={() => navigate("/login-signup")}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 text-on-surface-variant hover:text-on-surface transition-all duration-200 rounded-md`}
          style={{ fontFamily: 'var(--font-family-body)' }}
          title="Log Out"
        >
          <User className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Log Out</span>}
        </button>
      </div>
    </div>
  );
}