import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Function to send profiling data to webhook
const sendProfilingData = async (userData: any, isExtended: boolean = false) => {
  try {
    // Get basic profile data from localStorage for all scenarios
    const basicData = {
      user_age: localStorage.getItem('userAge'),
      user_height: localStorage.getItem('userHeight'),
      user_weight: localStorage.getItem('userWeight'),
      user_gender: localStorage.getItem('userGender'),
      user_goal: localStorage.getItem('userGoal'),
      user_diet: localStorage.getItem('userDiet'),
      user_health: localStorage.getItem('userHealth'),
      user_allergies: localStorage.getItem('userAllergies'),
      user_activity: localStorage.getItem('userActivity'),
      user_workout: localStorage.getItem('userWorkout'),
      user_current_meal: localStorage.getItem('userCurrentMeals'),
      user_preferred_meal: localStorage.getItem('userPreferredMeals'),
      user_eatout: localStorage.getItem('userEatOut'),
      user_whatsapp: localStorage.getItem('userWhatsapp')
    };
    
    // Merge basic and extended data
    const allData = { ...basicData, ...userData };
    
    // Create custom_analysis_data object from localStorage and userData
    const customAnalysisData = {
      user_age: allData.user_age || "unknown",
      user_height: allData.user_height || "unknown",
      user_weight: allData.user_weight || "unknown",
      user_health: allData.user_health || "None",
      user_allergies: allData.user_allergies || "None",
      user_current_meal: allData.user_current_meal || "3",
      user_preferred_meal: allData.user_preferred_meal || "3",
      user_diet: allData.user_diet || "Non-vegetarian",
      user_goal: allData.user_goal || "Gain weight",
      user_activity: allData.user_activity || "Fairly active",
      user_workout: allData.user_workout || "Goes to the gym",
      user_eatout: allData.user_eatout || "Often",
      user_whatsapp: allData.user_whatsapp || "No",
      user_profession: allData.user_profession || "Student",
      user_bodyfat: allData.user_bodyfat || "16",
      user_budget: allData.user_budget || "200–300 rupees",
      user_waterintake: allData.user_waterintake || "Good",
      user_sleepquality: allData.user_sleepquality || "Average",
      user_preferences: allData.user_preferences || "Mixed food",
      user_dislikes: allData.user_dislikes || "None",
      user_mealprep: allData.user_mealprep || "Yes",
      user_additional: allData.user_additional || "None"
    };
    
    // Generate random call ID
    const callId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Get current timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '/');
    
    const response = await fetch('https://ainutritionist-webhook.vercel.app/api/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        event: "call_analyzed",
        call: {
          call_id: callId,
          retell_llm_dynamic_variables: {
            timestamp: timestamp,
            firstName: localStorage.getItem('userName') || "User",
            phone: localStorage.getItem('userPhone') || null, // Already has 91 prefix
            preferredLanguage: "English"
          },
          call_status: "ended",
          call_analysis: {
            custom_analysis_data: {
              user_age: allData.user_age || "21 years",
              user_height: allData.user_height || "5 feet 11",
              user_weight: allData.user_weight || "55 kg",
              user_health: allData.user_health || "None",
              user_allergies: allData.user_allergies || "Peanuts",
              user_current_meal: allData.user_current_meal || "3",
              user_preferred_meal: allData.user_preferred_meal || "4",
              user_diet: allData.user_diet || "Non-vegetarian",
              user_goal: allData.user_goal || "Gain weight",
              user_activity: allData.user_activity || "Fairly active",
              user_workout: allData.user_workout || "Goes to the gym",
              user_eatout: allData.user_eatout || "Often",
              user_whatsapp: allData.user_whatsapp || "Yes",
              user_profession: allData.user_profession || "Student",
              user_bodyfat: allData.user_bodyfat || "16",
              user_budget: allData.user_budget || "200–300 rupees",
              user_waterintake: allData.user_waterintake || "Good",
              user_sleepquality: allData.user_sleepquality || "Average",
              user_preferences: allData.user_preferences || "Mixed food",
              user_dislikes: allData.user_dislikes || "None",
              user_mealprep: allData.user_mealprep || "Yes",
              user_additional: allData.user_additional || "None"
            }
          }
        }
      })
    });
    
    if (response.ok) {
      console.log('Extended profiling data sent successfully');
    } else {
      console.error('Failed to send extended profiling data');
    }
  } catch (error) {
    console.error('Error sending extended profiling data:', error);
  }
};

export function ProfileExtended() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // State for extended questions
  const [profession, setProfession] = useState<string | null>(null);
  const [bodyFatKnown, setBodyFatKnown] = useState<string | null>(null);
  const [bodyFatPercentage, setBodyFatPercentage] = useState("");
  const [mealBudget, setMealBudget] = useState<string | null>(null);
  const [budgetRange, setBudgetRange] = useState<string | null>(null);
  const [waterIntake, setWaterIntake] = useState<string | null>(null);
  const [sleepQuality, setSleepQuality] = useState<string | null>(null);
  const [cuisinePreference, setCuisinePreference] = useState<string | null>(null);
  const [avoidFoods, setAvoidFoods] = useState("");
  const [mealPrepping, setMealPrepping] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleFinish = async () => {
    setIsLoading(true);
    
    // Get extended profile data
    const extendedData = {
      user_profession: profession,
      user_bodyfat: bodyFatKnown === "Yes" ? bodyFatPercentage : null,
      user_budget: mealBudget === "Yes" ? budgetRange : null,
      user_waterintake: waterIntake,
      user_sleepquality: sleepQuality,
      user_preferences: cuisinePreference,
      user_dislikes: avoidFoods || null,
      user_mealprep: mealPrepping,
      user_additional: additionalNotes || null
    };
    
    // Send data to webhook (extended profile data)
    await sendProfilingData(extendedData, true);
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const inputFocusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.backgroundColor = 'var(--surface-container-low)';
    e.target.style.boxShadow = '0 0 0 4px rgba(103, 222, 130, 0.1)';
  };

  const inputBlurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.backgroundColor = 'var(--surface-container-lowest)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate("/profile/step4")}
            className="w-10 h-10 bg-surface-container-low rounded-md flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h4 className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem' }}>Extended Profile</h4>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Title */}
          <div className="max-w-3xl">
            <h2 className="mb-6" style={{ fontFamily: 'var(--font-family-display)' }}>
              Fine-tune your <span className="text-primary">experience.</span>
            </h2>
            <p className="text-on-surface-variant leading-relaxed" style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}>
              These additional details help us create a nutrition plan that seamlessly fits into your lifestyle.
            </p>
          </div>

          {/* Profession */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              What best describes your profession?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Student", "Working professional", "Homemaker", "Other"].map((option) => (
                <button
                  key={option}
                  onClick={() => setProfession(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    profession === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    profession === option
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

          {/* Body Fat Percentage */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              Do you know your body fat percentage?
            </label>
            <div className="grid grid-cols-2 gap-4 max-w-md mb-4">
              {["No", "Yes"].map((option) => (
                <button
                  key={option}
                  onClick={() => setBodyFatKnown(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    bodyFatKnown === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    bodyFatKnown === option
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
            {bodyFatKnown === "Yes" && (
              <input
                type="number"
                value={bodyFatPercentage}
                onChange={(e) => setBodyFatPercentage(e.target.value)}
                placeholder="Enter body fat percentage (%)"
                className="w-full max-w-md bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200"
                style={{ fontFamily: 'var(--font-family-body)' }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            )}
          </div>

          {/* Meal Budget */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              Do you have a daily budget for meals?
            </label>
            <div className="grid grid-cols-2 gap-4 max-w-md mb-4">
              {["No constraint", "Yes"].map((option) => (
                <button
                  key={option}
                  onClick={() => setMealBudget(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    mealBudget === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    mealBudget === option
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
            {mealBudget === "Yes" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["₹100–200", "₹200–500", "₹500–1000", "₹1000+"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setBudgetRange(option)}
                    className={`py-4 px-6 rounded-md transition-all duration-200 ${
                      budgetRange === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                    }`}
                    style={
                      budgetRange === option
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
            )}
          </div>

          {/* Water Intake */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              How would you rate your daily water intake?
            </label>
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              {["Low", "Moderate", "High"].map((option) => (
                <button
                  key={option}
                  onClick={() => setWaterIntake(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    waterIntake === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    waterIntake === option
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

          {/* Sleep Quality */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              How would you rate your sleep quality?
            </label>
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              {["Poor", "Average", "Good"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSleepQuality(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    sleepQuality === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    sleepQuality === option
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

          {/* Cuisine Preference */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              What cuisine do you prefer?
            </label>
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              {["North Indian", "South Indian", "Mixed"].map((option) => (
                <button
                  key={option}
                  onClick={() => setCuisinePreference(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    cuisinePreference === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    cuisinePreference === option
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

          {/* Foods to Avoid */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              Are there any foods you dislike or want to avoid?
            </label>
            <input
              type="text"
              value={avoidFoods}
              onChange={(e) => setAvoidFoods(e.target.value)}
              placeholder="e.g., mushrooms, bitter gourd, etc."
              className="w-full bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200"
              style={{ fontFamily: 'var(--font-family-body)' }}
              onFocus={inputFocusStyle}
              onBlur={inputBlurStyle}
            />
          </div>

          {/* Meal Prepping */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              Are you open to meal prepping?
            </label>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  onClick={() => setMealPrepping(option)}
                  className={`py-4 px-6 rounded-md transition-all duration-200 ${
                    mealPrepping === option ? "" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                  }`}
                  style={
                    mealPrepping === option
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

          {/* Additional Notes */}
          <div>
            <label className="block text-on-surface mb-5 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              Anything else you'd like us to consider?
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Share any additional preferences, goals, or concerns..."
              rows={4}
              className="w-full bg-surface-container-lowest text-on-surface px-6 py-4 rounded-md outline-none transition-all duration-200 resize-none"
              style={{ fontFamily: 'var(--font-family-body)' }}
              onFocus={inputFocusStyle}
              onBlur={inputBlurStyle}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-4 mt-16 pt-8" style={{ borderTop: '1px solid var(--outline-variant)' }}>
          <button 
            onClick={() => navigate("/profile/step4")}
            className="px-8 py-3.5 rounded-md transition-all duration-200 bg-surface-container-low hover:bg-surface-container text-on-surface"
            style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}
          >
            Back
          </button>
          <button 
            onClick={handleFinish}
            className="px-8 py-3.5 rounded-md transition-all duration-200 hover:opacity-90 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
              color: 'var(--primary-foreground)',
              fontFamily: 'var(--font-family-body)',
              fontWeight: 600,
            }}
          >
            Complete Setup
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container-low rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              {/* Loading Spinner */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              
              {/* Loading Text */}
              <h3 className="text-on-surface mb-4" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                Generating Your AI Nutrition Plan
              </h3>
              
              <p className="text-on-surface-variant leading-relaxed" style={{ fontFamily: 'var(--font-family-body)' }}>
                This usually takes 1-2 minutes. We're analyzing your complete profile and creating a personalized meal plan just for you...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
