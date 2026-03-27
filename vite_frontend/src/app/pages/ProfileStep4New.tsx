import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Sparkles, Zap } from "lucide-react";

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
      console.log('Profiling data sent successfully');
    } else {
      console.error('Failed to send profiling data');
    }
  } catch (error) {
    console.error('Error sending profiling data:', error);
  }
};

export function ProfileStep4New() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSkip = async () => {
    setIsLoading(true);
    
    // Send data to webhook (basic profile data)
    await sendProfilingData({}, false);
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handleCustomize = async () => {
    // Navigate to extended profiling
    navigate("/profile/extended");
  };

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate("/profile/step3")}
            className="w-10 h-10 bg-surface-container-low rounded-md flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h4 className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem' }}>Finalize Your Profile</h4>
        </div>

        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-primary tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
              STEP 4 OF 4
            </span>
            <span className="text-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
              100% Complete
            </span>
          </div>
          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                width: '100%',
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-container) 100%)'
              }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center pt-12">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)' }}>
            <Sparkles className="w-12 h-12" style={{ color: 'var(--primary-foreground)' }} />
          </div>

          {/* Title */}
          <h2 className="mb-6" style={{ fontFamily: 'var(--font-family-display)', fontSize: '3rem' }}>
            You're almost <span className="text-primary">there!</span>
          </h2>
          
          <p className="text-on-surface-variant leading-relaxed mb-12 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-family-body)' }}>
            We have enough information to create your personalized nutrition plan. However, answering a few more questions can help us fine-tune your experience for even better results.
          </p>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-3xl mx-auto">
            {/* Customize Further */}
            <button
              onClick={handleCustomize}
              className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container transition-all duration-300 text-left group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <span 
                  className="px-3 py-1.5 rounded-full text-xs tracking-wider"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                    color: 'var(--primary-foreground)',
                    fontFamily: 'var(--font-family-body)',
                    fontWeight: 600,
                  }}
                >
                  ● RECOMMENDED
                </span>
              </div>

              <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-on-surface mb-3" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                Yes, Customize Further
              </h3>
              
              <p className="text-on-surface-variant leading-relaxed mb-6" style={{ fontFamily: 'var(--font-family-body)' }}>
                Answer additional questions about your profession, budget, sleep, cuisine preferences, and more for a highly personalized plan.
              </p>

              <div className="flex items-center gap-2 text-primary" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                <span>Continue Setup</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Generate Plan Now */}
            <button
              onClick={handleSkip}
              className="bg-surface-container-low p-8 rounded-xl hover:bg-surface-container transition-all duration-300 text-left group"
            >
              <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-on-surface mb-3" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                No, Generate Plan Now
              </h3>
              
              <p className="text-on-surface-variant leading-relaxed mb-6" style={{ fontFamily: 'var(--font-family-body)' }}>
                Skip the extra questions and jump straight into your dashboard. You can always customize your preferences later.
              </p>

              <div className="flex items-center gap-2 text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Info Note */}
          <div className="mt-16 p-6 bg-surface-container-low rounded-lg max-w-2xl mx-auto">
            <p className="text-on-surface-variant text-sm leading-relaxed" style={{ fontFamily: 'var(--font-family-body)' }}>
              💡 <strong className="text-on-surface">Pro tip:</strong> The more we know about your lifestyle and preferences, the more accurate and sustainable your nutrition plan will be. Most users find the extended profile takes just 2-3 minutes.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-start mt-16 pt-8" style={{ borderTop: '1px solid var(--outline-variant)' }}>
          <button 
            onClick={() => navigate("/profile/step3")}
            className="px-8 py-3.5 rounded-md transition-all duration-200 bg-surface-container-low hover:bg-surface-container text-on-surface"
            style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}
          >
            Back
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
                This usually takes 1-2 minutes. We're analyzing your profile and creating a personalized meal plan just for you...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}