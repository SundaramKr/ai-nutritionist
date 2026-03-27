import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ProfileStep2New() {
  const navigate = useNavigate();
  
  // State for Step 2 questions
  const [foodAllergies, setFoodAllergies] = useState<string[]>([]);
  const [otherAllergy, setOtherAllergy] = useState("");
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [otherCondition, setOtherCondition] = useState("");
  const [currentMeals, setCurrentMeals] = useState<string | null>(null);
  const [preferredMeals, setPreferredMeals] = useState<string | null>(null);

  const handleNext = () => {
    // Validation - check if all required fields are filled
    if (foodAllergies.length === 0 && !otherAllergy.trim()) {
      alert("Please select at least one food allergy option or specify 'None'");
      return;
    }
    
    if (medicalConditions.length === 0 && !otherCondition.trim()) {
      alert("Please select at least one medical condition option or specify 'None'");
      return;
    }
    
    if (!currentMeals) {
      alert("Please select how many meals you currently eat");
      return;
    }
    
    if (!preferredMeals) {
      alert("Please select how many meals you prefer in your plan");
      return;
    }
    
    // Store data in localStorage
    const allergiesList = [...foodAllergies];
    if (otherAllergy.trim()) {
      allergiesList.push(otherAllergy.trim());
    }
    localStorage.setItem('userAllergies', allergiesList.join(', '));
    
    const conditionsList = [...medicalConditions];
    if (otherCondition.trim()) {
      conditionsList.push(otherCondition.trim());
    }
    localStorage.setItem('userHealth', conditionsList.join(', '));
    localStorage.setItem('userCurrentMeals', currentMeals);
    localStorage.setItem('userPreferredMeals', preferredMeals);
    
    navigate("/profile/step3");
  };

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const inputFocusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.backgroundColor = 'var(--surface-container-low)';
    e.target.style.boxShadow = '0 0 0 4px rgba(103, 222, 130, 0.1)';
  };

  const inputBlurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.backgroundColor = 'var(--surface-container-lowest)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate("/profile/step1")}
            className="w-10 h-10 bg-surface-container-low rounded-md flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h4 className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem' }}>Health & Lifestyle</h4>
        </div>

        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-primary tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              STEP 2 OF 4
            </span>
            <span className="text-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
              50% Complete
            </span>
          </div>
          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                width: '50%',
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
              Your health is our <span className="text-primary">priority.</span>
            </h2>
            <p className="text-on-surface-variant leading-relaxed" style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}>
              Understanding your health conditions and dietary restrictions helps us create a safe, personalized nutrition plan.
            </p>
          </div>

          {/* Food Allergies */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              Do you have any food allergies?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {["None", "Nuts", "Dairy", "Gluten"].map((option) => (
                <button
                  key={option}
                  onClick={() => toggleSelection(option, foodAllergies, setFoodAllergies)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    foodAllergies.includes(option) ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    foodAllergies.includes(option)
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
            <input
              type="text"
              value={otherAllergy}
              onChange={(e) => setOtherAllergy(e.target.value)}
              placeholder="Other (please specify)"
              className="w-full max-w-md bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200"
              style={{ fontFamily: 'var(--font-family-body)' }}
              onFocus={inputFocusStyle}
              onBlur={inputBlurStyle}
            />
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              Do you have any medical conditions we should consider? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {["None", "Diabetes", "Thyroid", "PCOS", "Hypertension", "Lactose intolerance", "Pregnancy"].map((option) => (
                <button
                  key={option}
                  onClick={() => toggleSelection(option, medicalConditions, setMedicalConditions)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    medicalConditions.includes(option) ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    medicalConditions.includes(option)
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
            <input
              type="text"
              value={otherCondition}
              onChange={(e) => setOtherCondition(e.target.value)}
              placeholder="Other (please specify)"
              className="w-full max-w-md bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200"
              style={{ fontFamily: 'var(--font-family-body)' }}
              onFocus={inputFocusStyle}
              onBlur={inputBlurStyle}
            />
          </div>

          {/* Current Meals */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              How many meals do you currently eat in a day?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["2 meals", "3 meals", "4+ meals", "Irregular"].map((option) => (
                <button
                  key={option}
                  onClick={() => setCurrentMeals(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    currentMeals === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    currentMeals === option
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

          {/* Preferred Meals */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              How many meals would you prefer in your plan?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["2 meals", "3 meals", "4 meals", "5+ meals"].map((option) => (
                <button
                  key={option}
                  onClick={() => setPreferredMeals(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    preferredMeals === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    preferredMeals === option
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
            onClick={() => navigate("/profile/step1")}
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