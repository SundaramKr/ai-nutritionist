import { useState } from "react";
import { useNavigate } from "react-router";
import { Logo } from "../components/Logo";
import { Phone, Lock, Eye } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation - check if both fields are filled
    if (!phoneNumber.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    // Validate phone number - must be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setError("Phone number must be exactly 10 digits");
      return;
    }
    
    // Validate password - must be at least 8 characters with letters and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and contain both letters and numbers");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('https://eiecdmzgvoagdsivbmzn.functions.supabase.co/password-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: `91${phoneNumber.trim()}`,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (data.ok) {
        // Store phone number and name in localStorage (phone with 91 prefix, no +)
        localStorage.setItem('userPhone', `91${phoneNumber.trim()}`); // Store with 91 prefix
        localStorage.setItem('userName', data.name);
        console.log('Login successful:', data);
        
        // Check if user has meal plan
        try {
          const planResponse = await fetch(`https://eiecdmzgvoagdsivbmzn.functions.supabase.co/get-plan?phone=91${phoneNumber.trim()}`);
          const planData = await planResponse.json();
          
          if (planData.latest && planData.latest.meal_plan) {
            navigate("/dashboard");
          } else {
            navigate("/profiling-method");
          }
        } catch (planError) {
          console.error('Error checking meal plan:', planError);
          // Default to profiling method selector if plan check fails
          navigate("/profiling-method");
        }
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Network error:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="w-full max-w-[1400px]">
        {/* Header */}
        <div className="mb-20">
          <Logo />
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center">
          {/* Hero Text */}
          <div className="text-center mb-16">
            <h1 className="mb-6" style={{ fontFamily: 'var(--font-family-display)' }}>
              Vitality <span className="text-primary">Awaits.</span>
            </h1>
            <p className="text-on-surface-variant text-lg" style={{ fontFamily: 'var(--font-family-body)' }}>
              Access personalized Indian nutrition<br />
              plans backed by AI.
            </p>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-md bg-surface-container-low rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            {/* Tabs */}
            <div className="flex gap-3 mb-10">
              <button 
                className="flex-1 py-3 px-6 rounded-md transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                  color: 'var(--primary-foreground)',
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem'
                }}
              >
                LOGIN
              </button>
              <button 
                onClick={() => navigate("/signup")}
                className="flex-1 py-3 px-6 text-on-surface-variant transition-all duration-200 hover:text-on-surface"
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem'
                }}
              >
                SIGN UP
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm" style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#dc2626'
                }}>
                  {error}
                </div>
              )}
              
              {/* Phone Number Input */}
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface pl-12 pr-4 py-4 rounded-md outline-none transition-all duration-200 placeholder:text-on-surface-variant/60"
                  style={{
                    boxShadow: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'var(--surface-container-low)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(103, 222, 130, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'var(--surface-container-lowest)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface pl-12 pr-12 py-4 rounded-md outline-none transition-all duration-200 placeholder:text-on-surface-variant/60"
                  style={{
                    boxShadow: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'var(--surface-container-low)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(103, 222, 130, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'var(--surface-container-lowest)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant cursor-pointer" />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-md transition-all duration-200 hover:opacity-90 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                  color: 'var(--primary-foreground)',
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 600,
                  letterSpacing: '0.025em',
                }}
              >
                {isLoading ? 'Logging In...' : 'Log In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-10 text-center text-on-surface-variant">
              Don't have an account?{" "}
              <button 
                onClick={() => navigate("/signup")}
                className="text-primary font-semibold hover:underline"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}