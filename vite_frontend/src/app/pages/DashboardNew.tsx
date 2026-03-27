import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, ChevronRight, Plus, UtensilsCrossed, TrendingUp, Target, Flame, Activity, Apple, Coffee, Sun, Moon, Droplet, Check, Zap, MessageCircle } from "lucide-react";
import { useNutrition } from "../context/NutritionContext";
import { useSidebar } from "../context/SidebarContext";
import { Sidebar } from "../components/Sidebar";
import { fetchUserDataFromAPIs, getTodayMeals as getTodayMealsFromUtils } from "../utils/apiUtils";

export function Dashboard() {
  const navigate = useNavigate();
  const { nutritionData, logMeal, unlogMeal, isMealLogged, dailyTargets, waterIntake, logWater } = useNutrition();
  const { isCollapsed } = useSidebar();
  const waterGoal = dailyTargets.water_ml;
  const [todayMeals, setTodayMeals] = useState(getTodayMealsFromUtils());

  // Fetch user data on component mount and every page load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) {
          // If no phone in localStorage, redirect to login
          navigate('/login');
          return;
        }

        // Fetch user details and meal plan using utility function
        await fetchUserDataFromAPIs(userPhone);
        
        // Update today's meals state with Indian timezone
        setTodayMeals(getTodayMealsFromUtils());
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Still allow user to access dashboard but with limited functionality
      }
    };

    fetchUserData();
  }, [navigate]);

  // Meal tracking state (dynamically loaded from meal plan)
  const meals = todayMeals ? [
    todayMeals.breakfast,
    todayMeals.lunch,
    todayMeals.dinner
  ] : [
    // Fallback meals if no data available
    {
      id: "breakfast-1",
      type: "BREAKFAST",
      category: "BREAKFAST",
      time: "07:30 AM",
      name: "Loading breakfast...",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
    },
    {
      id: "lunch-1",
      type: "LUNCH",
      category: "LUNCH",
      time: "01:00 PM",
      name: "Loading lunch...",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
    },
    {
      id: "dinner-1",
      type: "DINNER",
      category: "DINNER",
      time: "08:00 PM",
      name: "Loading dinner...",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
    },
  ];

  const toggleMealConsumed = (id: string) => {
    const matchedMeals = meals.filter((m: any) => m.id === id);
    if (matchedMeals.length === 0) return;
    const meal = matchedMeals[0];
    if (isMealLogged(id)) {
      unlogMeal(meal as any);
    } else {
      logMeal(meal as any);
    }
  };

  // Daily targets from meal plan totals
  const mealPlanTargets = todayMeals?.totals || {};
  const calorieTarget = mealPlanTargets.calories || 2250;
  const proteinTarget = mealPlanTargets.protein || 120;
  const carbsTarget = mealPlanTargets.carbs || 180;
  const fatsTarget = mealPlanTargets.fats || 60;

  // Calculate remaining and percentages
  // Calculate consumed totals from checked local meals (for local display only, global targets use context)
  // We'll use nutritionData from context for the global stats card
  const caloriesConsumed = nutritionData.calories;
  const caloriesRemaining = Math.max(0, calorieTarget - caloriesConsumed);
  const caloriePercentage = Math.min(Math.round((caloriesConsumed / calorieTarget) * 100), 100);
  
  // Calculate stroke offset for circle (circumference = 2 * PI * r = 2 * 3.14159 * 30 = 188.495) - scaled to 75%
  const circumference = 188.495;
  const strokeOffset = circumference - (circumference * caloriePercentage) / 100;

  return (
    <div className="min-h-screen bg-surface pb-21">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-48'} p-9`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-9">
          <div>
            <h1 className="mb-1.5" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.25rem' }}>
              Good morning, <span className="text-primary">Alex.</span>
            </h1>
            <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.84375rem' }}>
              Your metabolic efficiency is up 12% this week. You're on track to hit your protein targets by dinner.
            </p>
          </div>
          <div className="flex gap-2.25">
            <button className="w-7.5 h-7.5 bg-surface-container-low rounded-md flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <Bell className="w-3.75 h-3.75 text-on-surface-variant" />
            </button>
            <button 
              onClick={() => navigate("/profile")}
              className="w-7.5 h-7.5 rounded-md overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/vector-1742875355318-00d715aec3e8"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4.5">
          {/* Left Column - Main Content */}
          <div className="col-span-2 space-y-4.5">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4.5">
              {/* Hydration Tracker */}
              <div className="bg-surface-container-low p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div 
                  className="flex-1 w-full cursor-pointer group" 
                  onClick={() => navigate("/water-intake")}
                >
                  <div className="flex items-center gap-2.25 mb-4.5">
                    <Droplet className="w-3.75 h-3.75 text-on-surface-variant group-hover:text-primary transition-colors" />
                    <span className="text-xs text-on-surface-variant uppercase tracking-wider group-hover:text-on-surface transition-colors" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                      HYDRATION TRACKER
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>
                      {(waterIntake / 1000).toFixed(1)}
                    </h3>
                    <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem', paddingBottom: '0.25rem' }}>
                      / {(waterGoal / 1000).toFixed(1)}L
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2.25 w-full md:w-auto">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      logWater(250);
                    }}
                    className="flex-1 md:flex-none px-4 py-2.25 bg-surface-container-high hover:bg-surface-container text-on-surface text-sm rounded-md text-center transition-colors" 
                    style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    +250ml
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      logWater(500);
                    }}
                    className="flex-1 md:flex-none px-4 py-2.25 bg-surface-container-high hover:bg-surface-container text-on-surface text-sm rounded-md text-center transition-colors" 
                    style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    +500ml
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/water-intake");
                    }}
                    className="flex-1 md:flex-none px-4 py-2.25 text-primary hover:bg-surface-container-high text-sm rounded-md text-center transition-colors" 
                    style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    Custom
                  </button>
                </div>
              </div>
            </div>

            {/* Today's Meal Journey */}
            <div>
              <div className="flex justify-between items-center mb-4.5">
                <div>
                  <h3 className="text-on-surface mb-0.75" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.3125rem', fontWeight: 600 }}>
                    Today's Meal Journey
                  </h3>
                  <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    Refining your intake, one choice at a time
                  </p>
                </div>
                <button 
                  onClick={() => navigate("/meal-plan")}
                  className="text-primary hover:underline" 
                  style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}
                >
                  View Full Planner
                </button>
              </div>

              <div className="space-y-3">
                {meals.map((meal) => (
                  <div 
                    key={meal.id}
                    className="bg-surface-container-low rounded-xl p-4 hover:bg-surface-container transition-all duration-200 cursor-pointer"
                    onClick={() => toggleMealConsumed(meal.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Circular Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMealConsumed(meal.id);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          isMealLogged(meal.id) 
                            ? 'bg-primary' 
                            : 'border-2 border-on-surface-variant bg-transparent'
                        }`}
                      >
                        {isMealLogged(meal.id) && (
                          <Check className="w-4.5 h-4.5" style={{ color: 'var(--primary-foreground)' }} />
                        )}
                      </button>

                      {/* Meal Info - Left Side */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="text-xs text-on-surface-variant uppercase tracking-wider" 
                            style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}
                          >
                            {meal.time}
                          </span>
                          <span className="text-on-surface-variant">•</span>
                          <span 
                            className="text-xs text-primary uppercase tracking-wider" 
                            style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}
                          >
                            {meal.category}
                          </span>
                        </div>
                        <h4 
                          className="text-on-surface truncate" 
                          style={{ fontFamily: 'var(--font-family-display)', fontSize: '1rem', fontWeight: 600 }}
                        >
                          {meal.name}
                        </h4>
                      </div>

                      {/* Nutrition Stats - Right Side */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <span 
                            className="text-on-surface block" 
                            style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.125rem', fontWeight: 700 }}
                          >
                            {meal.calories}
                          </span>
                          <span 
                            className="text-on-surface-variant text-xs uppercase tracking-wider" 
                            style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.5625rem', fontWeight: 600 }}
                          >
                            KCAL
                          </span>
                        </div>

                        <div className="text-center">
                          <span 
                            className="text-on-surface block" 
                            style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.125rem', fontWeight: 700 }}
                          >
                            {meal.protein}g
                          </span>
                          <span 
                            className="text-on-surface-variant text-xs uppercase tracking-wider" 
                            style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.5625rem', fontWeight: 600 }}
                          >
                            PROTEIN
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div 
                          className={`px-4 py-2 rounded-md ${
                            isMealLogged(meal.id) 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                          style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.625rem', fontWeight: 600, minWidth: '90px', textAlign: 'center' }}
                        >
                          {isMealLogged(meal.id) ? 'COMPLETED' : 'PENDING'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Today's Plan */}
          <div className="space-y-4.5">
            <div className="bg-surface-container-low p-4.5 rounded-xl">
              <span className="text-xs text-primary uppercase tracking-wider block mb-2.25" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                CURRENT TARGET
              </span>
              <h3 className="text-on-surface mb-4.5" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.125rem', fontWeight: 600 }}>
                Today's Plan
              </h3>

              {/* Calorie Ring */}
              <div className="mb-4.5">
                <span className="text-on-surface-variant text-sm block mb-2.25" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                  Calories Remaining
                </span>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.625rem', fontWeight: 700, lineHeight: '1' }}>
                      {caloriesRemaining.toLocaleString()}
                    </h2>
                    <span className="text-on-surface-variant text-sm" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>/{calorieTarget} kcal</span>
                  </div>
                  <div className="relative w-18 h-18 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="36" cy="36" r="30" stroke="var(--surface-container-high)" strokeWidth="6" fill="none" />
                      <circle 
                        cx="36" 
                        cy="36" 
                        r="30" 
                        stroke="var(--primary)" 
                        strokeWidth="6" 
                        fill="none" 
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '0.9375rem', fontWeight: 700 }}>
                        {caloriePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-4.5 mb-4.5">
                <div className="text-center">
                  <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 700, lineHeight: '1', marginBottom: '0.25rem' }}>
                    {nutritionData.protein}g
                  </h4>
                  <span className="text-on-surface-variant text-xs tracking-wider block" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    /{proteinTarget}g Protein
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 700, lineHeight: '1', marginBottom: '0.25rem' }}>
                    {nutritionData.carbs}g
                  </h4>
                  <span className="text-on-surface-variant text-xs tracking-wider block" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    /{carbsTarget}g Carbs
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 700, lineHeight: '1', marginBottom: '0.25rem' }}>
                    {nutritionData.fats}g
                  </h4>
                  <span className="text-on-surface-variant text-xs tracking-wider block" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    /{fatsTarget}g Fats
                  </span>
                </div>
              </div>

              {/* High Intensity Window */}
              <div className="bg-surface-container p-3 rounded-lg mb-2.25 flex items-start gap-2.25">
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <Zap className="w-3 h-3 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-on-surface mb-0.75" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}>
                    High Intensity Window
                  </h4>
                  <p className="text-on-surface-variant text-xs" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.65rem' }}>
                    Optimal performance window: 16:00 - 18:00
                  </p>
                </div>
              </div>

              {/* Hydration Focus */}
              <div className="bg-surface-container p-3 rounded-lg flex items-start gap-2.25">
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <Droplet className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <h4 className="text-on-surface mb-0.75" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}>
                    Hydration Focus
                  </h4>
                  <p className="text-on-surface-variant text-xs" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.65rem' }}>
                    Drink 800ml before lunch for enzyme support
                  </p>
                </div>
              </div>

              {/* View Full Nutrition Button */}
              <button 
                onClick={() => navigate("/nutrition-tracker")}
                className="w-full py-2.25 px-3 rounded-md mt-4.5 transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                  color: 'var(--primary-foreground)',
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                View Full Nutrition Breakdown
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent AI Chat Bar */}
      <button 
        onClick={() => navigate("/ai-chat")}
        className="fixed bottom-4.5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-[0_15px_45px_rgba(0,0,0,0.3)] hover:opacity-90 transition-all duration-200 flex items-center gap-2.25"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
          color: 'var(--primary-foreground)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <MessageCircle className="w-3.75 h-3.75" />
        <span style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}>
          Message your AI Coach
        </span>
      </button>
    </div>
  );
}