import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, Calendar, CheckCircle2, Circle, RefreshCw, MessageCircle, ArrowLeft } from "lucide-react";
import { useNutrition } from "../context/NutritionContext";
import { useSidebar } from "../context/SidebarContext";
import { Sidebar } from "../components/Sidebar";
import { fetchUserDataFromAPIs, getTodayMeals as getTodayMealsFromUtils } from "../utils/apiUtils";

export function MealPlan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Today");
  const { logMeal, unlogMeal, isMealLogged, nutritionData, dailyTargets } = useNutrition();
  const { isCollapsed } = useSidebar();
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
  const calorieTarget = mealPlanTargets.calories || 2250;
  const proteinTarget = mealPlanTargets.protein || 120;
  const carbsTarget = mealPlanTargets.carbs || 180;
  const fatsTarget = mealPlanTargets.fats || 60;
  const fiberTarget = 25;

  const caloriesRemaining = Math.max(0, calorieTarget - nutritionData.calories);

  const pP = Math.min(100, Math.round((nutritionData.protein / proteinTarget) * 100));
  const cP = Math.min(100, Math.round((nutritionData.carbs / carbsTarget) * 100));
  const fP = Math.min(100, Math.round((nutritionData.fats / fatsTarget) * 100));
  const fiP = Math.min(100, Math.round((nutritionData.fiber / fiberTarget) * 100));
  const metabolicAlignment = Math.round((pP + cP + fP) / 3) || 0;

  // Meal data dynamically loaded from meal plan
  const breakfastMeal = todayMeals?.breakfast || {
    id: "breakfast-fallback",
    name: "Loading breakfast...",
    time: "07:30 AM",
    category: "BREAKFAST",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  };

  const lunchMeal = todayMeals?.lunch || {
    id: "lunch-fallback",
    name: "Loading lunch...",
    time: "01:00 PM",
    category: "LUNCH",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  };

  const dinnerMeal = todayMeals?.dinner || {
    id: "dinner-fallback",
    name: "Loading dinner...",
    time: "08:00 PM",
    category: "DINNER",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  };

  const handleLogMeal = (meal: typeof breakfastMeal) => {
    logMeal(meal);
  };

  const handleUnlogMeal = (meal: typeof breakfastMeal) => {
    unlogMeal(meal);
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-48'}`}>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-24">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => navigate("/dashboard")}
                className="w-10 h-10 bg-surface-container-low rounded-md flex items-center justify-center hover:bg-surface-container-high transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </button>
              <div>
                <h1 className="mb-2" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.5rem' }}>
                  Meal Planning & <span className="text-primary">Prepping</span>
                </h1>
                <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                  A panoramic view of your daily biological requirements. We track the subtle shifts in your composition against curated nutritional benchmarks.
                </p>
              </div>
            </div>

            {/* Daily Budget Section */}
            <div className="mb-8 bg-surface-container-low p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                    CALORIES REMAINING
                  </span>
                  <h2 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', fontWeight: 700 }}>
                    {caloriesRemaining.toLocaleString()} <span className="text-on-surface-variant text-lg">/ {calorieTarget} kcal</span>
                  </h2>
                </div>
                <div className="px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <span className="text-primary" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 700 }}>
                    {metabolicAlignment}% METABOLIC ALIGNMENT
                  </span>
                </div>
              </div>

              {/* Macro Bars */}
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-on-surface-variant text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      PROTEIN
                    </span>
                    <span className="text-primary text-sm" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      {nutritionData.protein}g / {proteinTarget}g
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pP}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-on-surface-variant text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      CARBOHYDRATES
                    </span>
                    <span className="text-on-surface text-sm" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      {nutritionData.carbs}g / {carbsTarget}g
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${cP}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-on-surface-variant text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      HEALTHY FATS
                    </span>
                    <span className="text-rose-400 text-sm" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      {nutritionData.fats}g / {fatsTarget}g
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full transition-all duration-500" style={{ width: `${fP}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Meals */}
            <div className="flex flex-col gap-4">
              {/* Breakfast Strip */}
              <div className="bg-surface-container-low rounded-xl p-5 flex items-center gap-6 transition-all hover:bg-surface-container">
                <button
                  onClick={() => isMealLogged(breakfastMeal.id) ? handleUnlogMeal(breakfastMeal) : handleLogMeal(breakfastMeal)}
                  className="transition-opacity hover:opacity-80 focus:outline-none"
                >
                  {isMealLogged(breakfastMeal.id) ? (
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  ) : (
                    <Circle className="w-8 h-8 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors" />
                  )}
                </button>

                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="text-on-surface font-semibold truncate mb-1" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem' }}>
                    {breakfastMeal.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                    <span className="font-semibold uppercase tracking-wider">{breakfastMeal.time} • {breakfastMeal.category}</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span className="text-primary font-semibold">{breakfastMeal.calories} kcal</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span>{breakfastMeal.protein}g Protein</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span>{breakfastMeal.carbs}g Carbs</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span>{breakfastMeal.fats}g Fats</span>
                  </div>
                </div>

                <div className="relative group ml-auto pl-4">
                  <button
                    onClick={() => navigate("/ai-chat", { state: { initialPrompt: `Generate a new meal plan with alternative breakfast options to replace "${breakfastMeal.name}". Keep the same calories (${breakfastMeal.calories} kcal) and macros (${breakfastMeal.protein}g protein, ${breakfastMeal.carbs}g carbs, ${breakfastMeal.fats}g fats).` } })}
                    className="p-3 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-xs py-1.5 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Swap
                  </span>
                </div>
              </div>

              {/* Lunch Strip */}
              <div className="bg-surface-container-low rounded-xl p-5 flex items-center gap-6 transition-all hover:bg-surface-container">
                <button
                  onClick={() => isMealLogged(lunchMeal.id) ? handleUnlogMeal(lunchMeal) : handleLogMeal(lunchMeal)}
                  className="transition-opacity hover:opacity-80 focus:outline-none"
                >
                  {isMealLogged(lunchMeal.id) ? (
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  ) : (
                    <Circle className="w-8 h-8 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors" />
                  )}
                </button>

                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="text-on-surface font-semibold truncate mb-1" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem' }}>
                    {lunchMeal.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                    <span className="font-semibold uppercase tracking-wider">{lunchMeal.time} • {lunchMeal.category}</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span className="text-primary font-semibold">{lunchMeal.calories} kcal</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span>{lunchMeal.protein}g Protein</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span>{lunchMeal.carbs}g Carbs</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span>{lunchMeal.fats}g Fats</span>
                  </div>
                </div>

                <div className="relative group ml-auto pl-4">
                  <button
                    onClick={() => navigate("/ai-chat", { state: { initialPrompt: `Generate a new meal plan with alternative lunch options to replace "${lunchMeal.name}". Keep the same calories (${lunchMeal.calories} kcal) and macros (${lunchMeal.protein}g protein, ${lunchMeal.carbs}g carbs, ${lunchMeal.fats}g fats).` } })}
                    className="p-3 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-xs py-1.5 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Swap
                  </span>
                </div>
              </div>

              {/* Dinner Strip */}
              <div className="bg-surface-container-low rounded-xl p-5 flex items-center gap-6 transition-all hover:bg-surface-container">
                <button
                  onClick={() => isMealLogged(dinnerMeal.id) ? handleUnlogMeal(dinnerMeal) : handleLogMeal(dinnerMeal)}
                  className="transition-opacity hover:opacity-80 focus:outline-none"
                >
                  {isMealLogged(dinnerMeal.id) ? (
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  ) : (
                    <Circle className="w-8 h-8 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors" />
                  )}
                </button>

                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="text-on-surface font-semibold truncate mb-1" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem' }}>
                    {dinnerMeal.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                    <span className="font-semibold uppercase tracking-wider">{dinnerMeal.time} • {dinnerMeal.category}</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span className="text-primary font-semibold">{dinnerMeal.calories} kcal</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span>{dinnerMeal.protein}g Protein</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span>{dinnerMeal.carbs}g Carbs</span>
                    <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                    <span>{dinnerMeal.fats}g Fats</span>
                  </div>
                </div>

                <div className="relative group ml-auto pl-4">
                  <button
                    onClick={() => navigate("/ai-chat", { state: { initialPrompt: `Generate a new meal plan with alternative dinner options to replace "${dinnerMeal.name}". Keep the same calories (${dinnerMeal.calories} kcal) and macros (${dinnerMeal.protein}g protein, ${dinnerMeal.carbs}g carbs, ${dinnerMeal.fats}g fats).` } })}
                    className="p-3 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-xs py-1.5 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Swap
                  </span>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="mt-6">
              <button onClick={() => navigate("/meal-prep")} className="w-full bg-surface-container-low p-6 rounded-xl hover:bg-surface-container transition-all duration-200 text-left group">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem', fontWeight: 600 }}>
                    Enter Meal Prep Mode
                  </h4>
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <p className="text-on-surface-variant text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                  Optimized multi-dish cooking guide for the week ahead.
                </p>
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
          Talk to AI Coach
        </span>
      </button>
    </div>
  );
}