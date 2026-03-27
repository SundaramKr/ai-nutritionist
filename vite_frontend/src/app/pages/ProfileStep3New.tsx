import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ProfileStep3New() {
  const navigate = useNavigate();
  
  // State for Step 3 questions
  const [outsideFood, setOutsideFood] = useState<string | null>(null);
  const [activityLevel, setActivityLevel] = useState<string | null>(null);
  const [workout, setWorkout] = useState<string | null>(null);
  const [whatsappUpdates, setWhatsappUpdates] = useState<string | null>(null);

  const handleNext = () => {
    // Validation - check if all required fields are filled
    if (!outsideFood) {
      alert("Please select how often you eat outside food");
      return;
    }
    
    if (!activityLevel) {
      alert("Please select your daily activity level");
      return;
    }
    
    if (!workout) {
      alert("Please select your workout status");
      return;
    }
    
    if (!whatsappUpdates) {
      alert("Please select whether you want WhatsApp updates");
      return;
    }
    
    // Store data in localStorage
    localStorage.setItem('userEatOut', outsideFood);
    localStorage.setItem('userActivity', activityLevel);
    localStorage.setItem('userWorkout', workout);
    localStorage.setItem('userWhatsapp', whatsappUpdates);
    
    navigate("/profile/step4");
  };

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate("/profile/step2")}
            className="w-10 h-10 bg-surface-container-low rounded-md flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h4 className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem' }}>Activity & Preferences</h4>
        </div>

        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-primary tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              STEP 3 OF 4
            </span>
            <span className="text-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
              75% Complete
            </span>
          </div>
          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                width: '75%',
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-container) 100%)'
              }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Title */}
          <div className="max-w-3xl">
            <h2 className="mb-6" style={{ fontFamily: 'var(--font-family-display)' }}>
              Your lifestyle fuels your <span className="text-primary">progress.</span>
            </h2>
            <p className="text-on-surface-variant leading-relaxed" style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}>
              Understanding your daily activity and habits helps us optimize your nutrition for maximum results.
            </p>
          </div>

          {/* Outside Food Frequency */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              How often do you eat outside food?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Rarely", "1–2 times/week", "3–5 times/week", "Almost daily"].map((option) => (
                <button
                  key={option}
                  onClick={() => setOutsideFood(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    outsideFood === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    outsideFood === option
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
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              What is your daily activity level?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Sedentary (little to no exercise)",
                "Lightly active (1–2 days/week)",
                "Moderately active (3–5 days/week)",
                "Very active (6–7 days/week)"
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => setActivityLevel(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 text-left ${
                    activityLevel === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    activityLevel === option
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
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Workout */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              Do you currently work out?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "No",
                "Yes – Gym (strength training)",
                "Yes – Cardio (running, cycling, etc.)",
                "Yes – Sports / Mixed"
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => setWorkout(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    workout === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    workout === option
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
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Updates */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              Would you like to receive your meal plan and daily updates on WhatsApp?
            </label>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  onClick={() => setWhatsappUpdates(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    whatsappUpdates === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    whatsappUpdates === option
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
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-4 mt-16 pt-8" style={{ borderTop: '1px solid var(--outline-variant)' }}>
          <button 
            onClick={() => navigate("/profile/step2")}
            className="px-8 py-3.5 rounded-md transition-all duration-200 bg-surface-container-low hover:bg-surface-container text-on-surface"
            style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            className="px-8 py-3.5 rounded-md transition-all duration-200 hover:opacity-90 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
              color: 'var(--primary-foreground)',
              fontFamily: 'var(--font-family-body)',
              fontWeight: 600,
            }}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}