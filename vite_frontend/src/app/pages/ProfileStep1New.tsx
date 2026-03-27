import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ProfileStep1New() {
  const navigate = useNavigate();
  
  // Essential Questions State
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "feet">("cm");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [dietType, setDietType] = useState<string | null>(null);
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);

  const handleNext = () => {
    // Validation - check if all required fields are filled
    if (!age.trim()) {
      alert("Please enter your age");
      return;
    }
    
    // Validate height based on unit
    if (heightUnit === "cm") {
      if (!heightCm.trim()) {
        alert("Please enter your height in cm");
        return;
      }
    } else {
      if (!heightFeet.trim() || !heightInches.trim()) {
        alert("Please enter your height in feet and inches");
        return;
      }
    }
    
    if (!weight.trim()) {
      alert("Please enter your weight");
      return;
    }
    
    if (!dietType) {
      alert("Please select your diet type");
      return;
    }
    
    if (!primaryGoal) {
      alert("Please select your primary goal");
      return;
    }
    
    if (!gender) {
      alert("Please select your gender");
      return;
    }
    
    // Store data in localStorage
    localStorage.setItem('userAge', age);
    
    // Convert height to cm for consistency
    let heightInCm = heightCm;
    if (heightUnit === "feet") {
      heightInCm = (parseInt(heightFeet) * 30.48 + parseInt(heightInches) * 2.54).toString();
    }
    localStorage.setItem('userHeight', heightInCm);
    localStorage.setItem('userWeight', weight);
    localStorage.setItem('userGender', gender);
    localStorage.setItem('userGoal', primaryGoal);
    localStorage.setItem('userDiet', dietType);
    localStorage.setItem('userHealth', ''); // Not collected in this step
    localStorage.setItem('userAllergies', ''); // Not collected in this step
    localStorage.setItem('userActivity', ''); // Not collected in this step
    localStorage.setItem('userWorkout', ''); // Not collected in this step
    localStorage.setItem('userCurrentMeals', ''); // Not collected in this step
    localStorage.setItem('userPreferredMeals', ''); // Not collected in this step
    localStorage.setItem('userEatOut', ''); // Not collected in this step
    
    navigate("/profile/step2");
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
            onClick={() => navigate("/profiling-method")}
            className="w-10 h-10 bg-surface-container-low rounded-md flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h4 className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem' }}>Essential Information</h4>
        </div>

        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-primary tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              STEP 1 OF 4
            </span>
            <span className="text-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
              25% Complete
            </span>
          </div>
          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                width: '25%',
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
              Let's calibrate your <span className="text-primary">vitality.</span>
            </h2>
            <p className="text-on-surface-variant leading-relaxed" style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}>
              Precision nutrition starts with accurate data. Your metrics help our AI craft a plan that evolves with you.
            </p>
          </div>

          {/* Age */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              What is your age?
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full max-w-md bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200"
              style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}
              onFocus={inputFocusStyle}
              onBlur={inputBlurStyle}
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              What is your current weight (kg)?
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kg"
              className="w-full max-w-md bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200"
              style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}
              onFocus={inputFocusStyle}
              onBlur={inputBlurStyle}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              What is your gender?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Male", "Female", "Prefer not to say"].map((option) => (
                <button
                  key={option}
                  onClick={() => setGender(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    gender === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    gender === option
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

          {/* Height */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              What is your height?
            </label>
            
            {/* Unit Selector */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setHeightUnit("cm")}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  heightUnit === "cm" ? "" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                }`}
                style={
                  heightUnit === "cm"
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
                CM
              </button>
              <button
                onClick={() => setHeightUnit("feet")}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  heightUnit === "feet" ? "" : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                }`}
                style={
                  heightUnit === "feet"
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
                FEET + INCHES
              </button>
            </div>

            {heightUnit === "cm" ? (
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="Enter height in cm"
                className="w-full max-w-md bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200"
                style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            ) : (
              <div className="flex gap-4 max-w-md">
                <input
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  placeholder="Feet"
                  className="flex-1 bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200"
                  style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
                <input
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  placeholder="Inches"
                  className="flex-1 bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200"
                  style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
              </div>
            )}
          </div>

          {/* Diet Type */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              What type of diet do you follow?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Vegetarian", "Eggitarian", "Non-Vegetarian", "Jain"].map((option) => (
                <button
                  key={option}
                  onClick={() => setDietType(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    dietType === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    dietType === option
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

          {/* Primary Goal */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              What is your primary goal?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Lose weight", "Gain weight", "Build muscle", "Improve overall fitness"].map((option) => (
                <button
                  key={option}
                  onClick={() => setPrimaryGoal(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    primaryGoal === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    primaryGoal === option
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
            onClick={() => navigate("/profiling-method")}
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