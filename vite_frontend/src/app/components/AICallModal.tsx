import { useState, useEffect } from "react";
import { X, Phone, User, Users } from "lucide-react";

interface AICallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AICallModal({ isOpen, onClose }: AICallModalProps) {
  const [step, setStep] = useState<"select" | "phone">("select");
  const [profilingFor, setProfilingFor] = useState<"self" | "other" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [language, setLanguage] = useState<"english" | "hindi" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Auto-fill phone number from localStorage when "For Myself" is selected
  // Clear phone number when "For Someone Else" is selected
  useEffect(() => {
    if (profilingFor === "self") {
      const storedPhone = localStorage.getItem('userPhone');
      if (storedPhone) {
        setPhoneNumber(storedPhone);
      }
    } else if (profilingFor === "other") {
      setPhoneNumber("");
    }
  }, [profilingFor]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (profilingFor) {
      setStep("phone");
    }
  };

  const handleScheduleCall = async () => {
    setIsLoading(true);
    
    try {
      const RETELL_API_KEY = "key_ace8335826d342d97df120754a85";
      const FROM_NUMBER = "+13186162139";
      const AGENT_ID = "agent_06ec6b99b1437632316bc34f2c";
      
      const userName = localStorage.getItem('userName') || 'User';
      const timestamp = new Date().toISOString();
      const storedPhone = localStorage.getItem('userPhone') || '';
      
      const formData = {
        timestamp: timestamp,
        firstName: userName,
        phone: storedPhone, // Always use localStorage phone
        phoneToCallTo: phoneNumber, // Use input field value for the call
        preferredLanguage: language
      };
      
      const payload = {
        from_number: FROM_NUMBER,
        to_number: `+${formData.phoneToCallTo}`, // Add + prefix for Retell API (phone already has 91)
        agent_id: AGENT_ID,
        retell_llm_dynamic_variables: formData
      };
      
      const response = await fetch("https://api.retellai.com/v2/create-phone-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RETELL_API_KEY}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Call scheduled successfully:", result);
        setIsLoading(false);
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        console.error("Failed to schedule call:", error);
        alert(`Failed to schedule call: ${error.message || 'Please try again'}`);
      }
    } catch (error) {
      console.error("Error scheduling call:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStep("select");
    setProfilingFor(null);
    setPhoneNumber("");
    setLanguage(null);
    setIsLoading(false);
    setShowSuccessModal(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    handleClose();
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-surface-container-low rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>

        {step === "select" ? (
          <>
            {/* Icon */}
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)' }}>
              <Phone className="w-8 h-8" style={{ color: 'var(--primary-foreground)' }} />
            </div>

            {/* Title */}
            <h3 className="text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 600 }}>
              AI Phone Call Setup
            </h3>
            <p className="text-on-surface-variant mb-8" style={{ fontFamily: 'var(--font-family-body)' }}>
              Who is this nutrition profile for?
            </p>

            {/* Selection Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={() => setProfilingFor("self")}
                className={`w-full p-5 rounded-lg transition-all duration-200 flex items-center gap-4 ${
                  profilingFor === "self" ? "" : "bg-surface-container hover:bg-surface-container-high"
                }`}
                style={
                  profilingFor === "self"
                    ? {
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                        color: 'var(--primary-foreground)',
                      }
                    : {}
                }
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  profilingFor === "self" ? "bg-white/20" : "bg-surface-container-high"
                }`}>
                  <User className={`w-6 h-6 ${profilingFor === "self" ? "text-white" : "text-primary"}`} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`mb-1 ${profilingFor === "self" ? "text-white" : "text-on-surface"}`} style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                    For Myself
                  </h4>
                  <p className={`text-sm ${profilingFor === "self" ? "text-white/80" : "text-on-surface-variant"}`} style={{ fontFamily: 'var(--font-family-body)' }}>
                    Set up my own nutrition profile
                  </p>
                </div>
              </button>

              <button
                onClick={() => setProfilingFor("other")}
                className={`w-full p-5 rounded-lg transition-all duration-200 flex items-center gap-4 ${
                  profilingFor === "other" ? "" : "bg-surface-container hover:bg-surface-container-high"
                }`}
                style={
                  profilingFor === "other"
                    ? {
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                        color: 'var(--primary-foreground)',
                      }
                    : {}
                }
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  profilingFor === "other" ? "bg-white/20" : "bg-surface-container-high"
                }`}>
                  <Users className={`w-6 h-6 ${profilingFor === "other" ? "text-white" : "text-primary"}`} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`mb-1 ${profilingFor === "other" ? "text-white" : "text-on-surface"}`} style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                    For Someone Else
                  </h4>
                  <p className={`text-sm ${profilingFor === "other" ? "text-white/80" : "text-on-surface-variant"}`} style={{ fontFamily: 'var(--font-family-body)' }}>
                    Help a family member or friend
                  </p>
                </div>
              </button>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!profilingFor}
              className="w-full py-3.5 px-6 rounded-md transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                color: 'var(--primary-foreground)',
                fontFamily: 'var(--font-family-body)',
                fontWeight: 600,
              }}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            {/* Icon */}
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)' }}>
              <Phone className="w-8 h-8" style={{ color: 'var(--primary-foreground)' }} />
            </div>

            {/* Title */}
            <h3 className="text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 600 }}>
              Contact Details
            </h3>
            <p className="text-on-surface-variant mb-8" style={{ fontFamily: 'var(--font-family-body)' }}>
              We'll call this number to complete the profiling
            </p>

            {/* Phone Number Input */}
            <div className="mb-6">
              <label className="block text-on-surface mb-3 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 rounded-md outline-none transition-all duration-200"
                style={{ fontFamily: 'var(--font-family-body)' }}
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

            {/* Language Selection */}
            <div className="mb-8">
              <label className="block text-on-surface mb-3 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                Preferred Language
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLanguage("english")}
                  className={`py-3 px-4 rounded-md transition-all duration-200 ${
                    language === "english" ? "" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                  style={
                    language === "english"
                      ? {
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                          color: 'var(--primary-foreground)',
                          fontFamily: 'var(--font-family-body)',
                          fontWeight: 600,
                        }
                      : {
                          fontFamily: 'var(--font-family-body)',
                        }
                  }
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("hindi")}
                  className={`py-3 px-4 rounded-md transition-all duration-200 ${
                    language === "hindi" ? "" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                  style={
                    language === "hindi"
                      ? {
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                          color: 'var(--primary-foreground)',
                          fontFamily: 'var(--font-family-body)',
                          fontWeight: 600,
                        }
                      : {
                          fontFamily: 'var(--font-family-body)',
                        }
                  }
                >
                  हिंदी (Hindi)
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep("select")}
                className="flex-1 py-3.5 px-6 rounded-md transition-all duration-200 bg-surface-container hover:bg-surface-container-high text-on-surface"
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 600,
                }}
              >
                Back
              </button>
              <button
                onClick={handleScheduleCall}
                disabled={!phoneNumber || !language || isLoading}
                className="flex-1 py-3.5 px-6 rounded-md transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                  color: 'var(--primary-foreground)',
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 600,
                }}
              >
                {isLoading ? 'Scheduling...' : 'Schedule Call'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          {/* Success Modal Content */}
          <div className="relative bg-surface-container-low rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ background: 'linear-gradient(135deg, rgba(103, 222, 130, 0.2) 0%, rgba(103, 222, 130, 0.3) 100%)' }}>
              <Phone className="w-8 h-8 text-primary" />
            </div>

            {/* Success Message */}
            <h3 className="text-on-surface mb-4 text-center" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
              AI Call Scheduled!
            </h3>
            <p className="text-on-surface-variant mb-8 text-center leading-relaxed" style={{ fontFamily: 'var(--font-family-body)' }}>
              Your nutrition report will be ready within a few minutes. We'll call you shortly to complete your profiling.
            </p>

            {/* Go to Dashboard Button */}
            <button
              onClick={handleSuccessModalClose}
              className="w-full py-3.5 px-6 rounded-md transition-all duration-200 hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                color: 'var(--primary-foreground)',
                fontFamily: 'var(--font-family-body)',
                fontWeight: 600,
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}
