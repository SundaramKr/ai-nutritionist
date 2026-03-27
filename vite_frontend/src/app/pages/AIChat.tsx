import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Send, Sparkles, Droplet, Plus } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { Sidebar } from "../components/Sidebar";
import { useNutrition } from "../context/NutritionContext";
import { fetchUserDataFromAPIs, getTodayMeals as getTodayMealsFromUtils, getUserDetails } from "../utils/apiUtils";

export function AIChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed } = useSidebar();
  const { logMeal, unlogMeal, isMealLogged, nutritionData, dailyTargets, waterIntake } = useNutrition();
  const [message, setMessage] = useState("");
  const initialPrompt = location.state?.initialPrompt;
  const promptProcessed = useRef(false);
  const [todayMeals, setTodayMeals] = useState(getTodayMealsFromUtils());

  // Fetch user data on component mount and update meals when localStorage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (userPhone) {
          await fetchUserDataFromAPIs(userPhone);
          setTodayMeals(getTodayMealsFromUtils());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    const handleStorageChange = () => {
      setTodayMeals(getTodayMealsFromUtils());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Daily targets from meal plan totals
  const mealPlanTargets = todayMeals?.totals || {};
  const calorieTarget = mealPlanTargets.calories || dailyTargets.calories || 2250;
  const proteinTarget = mealPlanTargets.protein || dailyTargets.protein || 120;
  const carbsTarget = mealPlanTargets.carbs || dailyTargets.carbs || 180;
  const fatsTarget = mealPlanTargets.fats || dailyTargets.fats || 60;
  const waterTarget = dailyTargets.water_ml || 3000;

  const caloriesRemaining = Math.max(0, calorieTarget - nutritionData.calories);
  const calPercent = Math.min(100, Math.round((nutritionData.calories / calorieTarget) * 100)) || 0;

  const pP = Math.min(100, Math.round((nutritionData.protein / proteinTarget) * 100)) || 0;
  const cP = Math.min(100, Math.round((nutritionData.carbs / carbsTarget) * 100)) || 0;
  const fP = Math.min(100, Math.round((nutritionData.fats / fatsTarget) * 100)) || 0;

  const waterRemaining = Math.max(0, waterTarget - waterIntake);

  const [messages, setMessages] = useState<{ id: string; text: string; sender: 'ai' | 'user'; timestamp: string }[]>([
    {
      id: '1',
      text: 'Hi! How can I help you today?',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  useEffect(() => {
    if (initialPrompt && !promptProcessed.current) {
      promptProcessed.current = true;
      
      const userMessage = {
        id: Date.now().toString(),
        text: initialPrompt,
        sender: 'user' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMessage]);

      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: "I've analyzed your meal and metabolic window! Here are some optimized, bio-available alternatives you could swap it with to maintain your alignment...",
          sender: 'ai' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);

      // Clean up local state so it doesn't trigger again on reload
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [initialPrompt, navigate, location.pathname]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuery = message;
    setMessage("");

    // Show typing indicator
    const typingMessage = {
      id: (Date.now() + 1).toString(),
      text: "Generating your personalized meal plan...",
      sender: 'ai' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Get user details and current meal plan
      const user = getUserDetails();
      const currentMealPlan = localStorage.getItem('userMealPlan');
      
      if (!user) {
        const errorMessage = {
          id: (Date.now() + 2).toString(),
          text: "Please complete your profile first to generate personalized meal plans.",
          sender: 'ai' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
        return;
      }

      // API constants
      const OPENAI_API_KEY = "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";
      const SUPABASE_URL = "https://eiecdmzgvoagdsivbmzn.functions.supabase.co/save-user";

      // System prompt
      const systemPromptJson = `
You are an expert Indian nutritionist and diet coach.
    
Your task is to generate highly personalized, practical, and realistic Indian meal plans.
    
CRITICAL RULES (STRICT):
1. ONLY output valid JSON. NO markdown, NO explanations outside JSON.
2. Follow exact JSON schema provided. DO NOT change structure.
3. Do NOT add extra fields.
4. Do NOT remove any required fields.
5. Do NOT rename keys.
6. Ensure all values are filled (no null unless unavoidable).
7. Numbers must be numbers (not strings).
8. Keep units consistent:
   - calories in kcal
   - protein/carbs/fats in grams
   - prep_time in minutes
   - cost in INR (₹ as number)
9. MAKE SURE you don't miss a single day of week in response. Don't do // Remaining days (Wednesday → Sunday) follow the exact same structure. Make sure json is complete everywhere.
    
NUTRITION RULES:
1. ONLY suggest Indian foods.
2. Avoid western foods unless explicitly requested.
3. Meals must be simple, affordable, realistic.
4. Respect diet type, allergies, conditions.
5. Align strictly with user's goal.
6. Ensure sufficient protein intake.
7. Avoid repeating meals more than 2 times/week.
8. Consider budget and lifestyle.
    
OUTPUT MUST BE PURE JSON.
`;

      // User prompt
      const userPromptJson = `
Generate a highly personalized 7-day Indian meal plan based on this request: "${userQuery}"
    
====================
USER PROFILE
====================
    
Basic Details:
- Age: ${user.age || 'Not specified'}
- Height: ${user.height || 'Not specified'}
- Weight: ${user.weight || 'Not specified'}
- Gender: ${user.gender || 'Not specified'}
    
Goal:
- Primary Goal: ${user.primaryGoal || 'Not specified'}
    
Diet:
- Diet Type: ${user.dietType || 'Not specified'}
    
Health:
- Medical Conditions: ${user.medicalConditions || 'None'}
- Allergies: ${user.allergies || 'None'}
    
Lifestyle:
- Activity Level: ${user.activityLevel || 'Not specified'}
- Workout Type: ${user.workoutType || 'Not specified'}
- Profession: ${user.profession || 'Not specified'}
    
Eating Habits:
- Current Meals per Day: ${user.currentMealsPerDay || 'Not specified'}
- Preferred Meals per Day: ${user.preferredMealsPerDay || 'Not specified'}
- Eats Outside Frequency: ${user.eatsOutsideFrequency || 'Not specified'}
    
Advanced Preferences:
- Body Fat %: ${user.bodyFat || 'Not specified'}
- Budget: ${user.budget || 'Not specified'}
- Water Intake: ${user.waterIntake || 'Not specified'}
- Sleep Quality: ${user.sleepQuality || 'Not specified'}
- Cuisine Preference: ${user.cuisinePreference || 'Not specified'}
- Foods to Avoid: ${user.foodsToAvoid || 'Not specified'}
- Meal Prep: ${user.mealPrep || 'Not specified'}
    
Current Meal Plan:
${currentMealPlan || 'No current meal plan available'}
    
====================
STRICT JSON SCHEMA
====================
    
{
  "plan": {
    "goal": "string",
    "diet_type": "string",
    "days": [
      {
        "day": "Monday",
        "meals": {
          "breakfast": {
            "name": "string",
            "ingredients": ["string"],
            "prep_time": number,
            "macros": {
              "calories": number,
              "protein": number,
              "carbs": number,
              "fats": number
            },
            "alternative": "string"
          },
          "lunch": { "same structure" },
          "dinner": { "same structure" }
        },
        "totals": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number
        },
        "micronutrients": ["string"],
        "explanation": "string"
      }
    ]
  },
  "grocery_list": {
    "grains": ["string"],
    "proteins": ["string"],
    "vegetables": ["string"],
    "dairy": ["string"],
    "others": ["string"]
  },
  "cost": {
    "daily": [number],
    "average": number
  },
  "insights": ["string"],
  "tips": ["string"]
}
    
====================
OUTPUT REQUIREMENTS
====================
    
1. Fill all 7 days (Monday → Sunday).
2. Each meal must include:
   - name
   - ingredients
   - prep_time
   - macros
   - alternative option
3. Each day must include:
   - totals
   - micronutrients
   - explanation
4. Grocery list must be grouped correctly.
5. Cost must include 7 daily values + average.
6. Insights: 3–5 points.
7. Tips: exactly 3 points.
    
FINAL RULE:
RETURN ONLY VALID JSON. NO TEXT BEFORE OR AFTER.
`;

      // Call OpenAI API
      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPromptJson },
            { role: "user", content: userPromptJson }
          ]
        })
      });

      if (!aiRes.ok) {
        throw new Error(`OpenAI API error: ${aiRes.status}`);
      }

      const aiData = await aiRes.json();
      
      let mealPlan = "Failed to generate meal plan.";
      
      try {
        mealPlan = aiData.choices[0].message.content;
        
        // Save to Supabase
        const userPhone = localStorage.getItem('userPhone');
        if (userPhone) {
          const saveRes = await fetch(`${SUPABASE_URL}?phone=${userPhone}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              type: "plan",
              meal_plan: mealPlan
            })
          });
          
          if (!saveRes.ok) {
            console.error('Failed to save meal plan:', saveRes.status);
          }
        }
        
        // Refresh data after saving
        await fetchUserDataFromAPIs(userPhone!);
        setTodayMeals(getTodayMealsFromUtils());
        
      } catch (err) {
        console.error("Parse error:", err);
        console.error("OpenAI response:", JSON.stringify(aiData, null, 2));
        mealPlan = "Failed to generate meal plan. Please try again.";
      }

      // Remove typing message and add AI response
      const aiMessage = {
        id: (Date.now() + 2).toString(),
        text: `I've generated a new personalized meal plan based on your request: "${userQuery}". The plan has been saved and is now active! Check your dashboard to see the updated meals.`,
        sender: 'ai' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
      
    } catch (error) {
      console.error('AI API Error:', error);
      
      // Remove typing message and add error message
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, I encountered an error generating your meal plan. Please try again.",
        sender: 'ai' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Navratri is ongoing and I can't have non-veg for the next 9 days suggest a veg meal plan",
    "Today I cannot have non-veg food",
    "I ate outside",
    "I skipped a meal",
    "Tell me more",
    "Show me protein-rich foods",
    "Adjust my dinner plan",
  ];

  // Breakfast meal data
  const breakfastMeal = {
    id: "breakfast-heritage-bowl",
    name: "Heritage Grain Power Bowl",
    time: "07:30 AM",
    category: "BREAKFAST",
    calories: 420,
    protein: 18,
    carbs: 34,
    fats: 22,
    fiber: 8,
    vitaminA: 320,
    vitaminC: 12,
    vitaminD: 15,
    vitaminE: 8,
    vitaminK: 45,
    vitaminB1: 0.3,
    vitaminB2: 0.4,
    vitaminB3: 4.2,
    vitaminB6: 0.5,
    vitaminB9: 85,
    vitaminB12: 1.2,
    calcium: 180,
    iron: 3.5,
    magnesium: 95,
    zinc: 2.8,
    selenium: 18,
  };

  // Paneer Quinoa Bowl meal data
  const paneerBowlMeal = {
    id: "lunch-paneer-bowl",
    name: "Paneer & Greens Quinoa Bowl",
    time: "12:45 PM",
    category: "LUNCH",
    calories: 620,
    protein: 32,
    carbs: 12,
    fats: 38,
    fiber: 10,
    vitaminA: 420,
    vitaminC: 45,
    vitaminD: 12,
    vitaminE: 15,
    vitaminK: 85,
    vitaminB1: 0.4,
    vitaminB2: 0.6,
    vitaminB3: 5.8,
    vitaminB6: 0.7,
    vitaminB9: 95,
    vitaminB12: 2.5,
    calcium: 280,
    iron: 4.2,
    magnesium: 120,
    zinc: 3.8,
    selenium: 22,
  };

  const handleLogBreakfast = () => {
    logMeal(breakfastMeal);
  };

  const handleLogPaneerBowl = () => {
    logMeal(paneerBowlMeal);
  };

  const isBreakfastLogged = isMealLogged(breakfastMeal.id);
  const isPaneerBowlLogged = isMealLogged(paneerBowlMeal.id);

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      {/* Main Chat Area */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-48'}`}>
        {/* Chat Column */}
        <div className="flex-1 flex flex-col relative lg:mr-80 mr-0">
          {/* Messages - with padding bottom to prevent overlap with fixed input */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-56 md:pb-64 lg:pb-80 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-4">
                {msg.sender === 'ai' ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)' }}>
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--primary-foreground)' }} />
                  </div>
                ) : (
                  <div className="w-8 h-8 flex-shrink-0" />
                )}
                <div className={`flex-1 ${msg.sender === 'user' ? 'max-w-lg' : ''}`}>
                  <div className={`p-5 rounded-xl inline-block rounded-tl-none ${
                    msg.sender === 'user' 
                      ? '' 
                      : 'bg-surface-container-low'
                  }`}
                  style={msg.sender === 'user' ? { background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)' } : {}}
                  >
                    <p className="leading-relaxed" style={{ fontFamily: 'var(--font-family-body)', color: msg.sender === 'user' ? 'var(--primary-foreground)' : 'var(--on-surface)' }}>
                      {msg.text}
                    </p>
                  </div>
                  <span className="text-on-surface-variant text-xs mt-2 block" style={{ fontFamily: 'var(--font-family-body)' }}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Input Section at Bottom */}
          <div className="fixed bottom-0 bg-surface p-4 md:p-6 border-t lg:right-80 right-0" style={{ 
            left: isCollapsed ? '4rem' : '12rem',
            borderTopColor: 'var(--outline-variant)',
          }}>
            {/* Quick Prompts - Horizontal Scroll */}
            <div className="mb-3">
              <span className="text-xs text-on-surface-variant block mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                QUICK ACTIONS
              </span>
              <div 
                className="flex gap-2 overflow-x-auto pb-2" 
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--outline-variant) transparent'
                }}
              >
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // Set the prompt as message and trigger the same API workflow
                      setMessage(prompt);
                      // Trigger the send message function after a short delay to ensure state is set
                      setTimeout(() => {
                        handleSendMessage();
                      }, 100);
                    }}
                    className="px-4 py-2 bg-surface-container-low text-on-surface text-sm rounded-full hover:bg-surface-container transition-all duration-200 whitespace-nowrap flex-shrink-0"
                    style={{ fontFamily: 'var(--font-family-body)' }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message your AI Coach..."
                className="w-full bg-surface-container-low text-on-surface pl-6 pr-16 py-3 md:py-4 rounded-xl outline-none transition-all duration-200 placeholder:text-on-surface-variant/60 text-sm md:text-base"
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'var(--surface-container)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(103, 222, 130, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'var(--surface-container-low)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-80"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                }}
              >
                <Send className="w-5 h-5" style={{ color: 'var(--primary-foreground)' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Today's Plan - FIXED POSITION - Hidden on mobile */}
        <div className="hidden lg:flex fixed top-0 right-0 w-80 bg-surface-container-low p-6 flex-col h-screen overflow-hidden" style={{ borderLeft: '1px solid var(--outline-variant)' }}>
          <span className="text-xs text-primary uppercase tracking-wider block mb-4" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
            CURRENT TARGET
          </span>
          <h3 className="text-on-surface mb-6" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
            Today's Plan
          </h3>

          {/* Calorie Overview */}
          <div className="bg-surface-container p-5 rounded-xl mb-6">
            <span className="text-on-surface-variant text-sm block mb-2" style={{ fontFamily: 'var(--font-family-body)' }}>
              Calories Remaining
            </span>
            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.5rem', fontWeight: 700 }}>
                {caloriesRemaining.toLocaleString()}
              </h2>
              <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                /{calorieTarget} kcal
              </span>
            </div>
            <div className="relative w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${calPercent}%`,
                  background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-container) 100%)'
                }}
              ></div>
            </div>
          </div>

          {/* Macros Grid */}
          <div className="space-y-3 mb-6">
            <div className="bg-surface-container p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                  PROTEIN
                </span>
                <span className="text-on-surface text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                  {nutritionData.protein}g
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pP}%`, backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>

            <div className="bg-surface-container p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                  CARBS
                </span>
                <span className="text-on-surface text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                  {nutritionData.carbs}g
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cP}%`, backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>

            <div className="bg-surface-container p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                  FATS
                </span>
                <span className="text-on-surface text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                  {nutritionData.fats}g
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${fP}%`, backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
          </div>

          {/* Hydration */}
          <div className="bg-surface-container p-5 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Droplet className="w-5 h-5 text-primary" />
              <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                Hydration Goal
              </h4>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', fontWeight: 700 }}>
                {(waterIntake / 1000).toFixed(1)} <span className="text-on-surface-variant text-base">/ {(waterTarget / 1000).toFixed(1)}L</span>
              </h3>
            </div>
            <p className="text-on-surface-variant text-xs mt-2" style={{ fontFamily: 'var(--font-family-body)' }}>
              Drink {waterRemaining}ml more to hit your goal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}