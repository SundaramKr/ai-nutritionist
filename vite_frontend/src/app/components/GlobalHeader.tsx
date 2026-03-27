import { useNavigate, useLocation } from "react-router";

export function GlobalHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the global profile icon on authentication and onboarding pages
  const hiddenRoutes = [
    "/", 
    "/login-signup", 
    "/signup", 
    "/profiling-method",
    "/profile/step1",
    "/profile/step2",
    "/profile/step3",
    "/profile/step4",
    "/profile/extended",
    "/dashboard" // Dashboard already has its own specific top bar
  ];

  if (hiddenRoutes.indexOf(location.pathname) !== -1) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-20 pointer-events-none z-50 flex justify-end items-start p-6">
      <button 
        onClick={() => navigate("/profile")}
        className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant pointer-events-auto transition-transform hover:scale-105 shadow-md flex-shrink-0"
      >
        <img 
          src="https://images.unsplash.com/vector-1742875355318-00d715aec3e8"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
}
