import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Droplet, Flame, Activity } from "lucide-react";
import { useNutrition } from "../context/NutritionContext";
import { useSidebar } from "../context/SidebarContext";
import { Sidebar } from "../components/Sidebar";
import { fetchUserDataFromAPIs, getTodayMeals as getTodayMealsFromUtils } from "../utils/apiUtils";

export function NutritionTracker() {
  const navigate = useNavigate();
  const { nutritionData } = useNutrition();
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

  const macros = [
    { name: "Protein", consumed: nutritionData.protein, target: proteinTarget, unit: "g", color: "#67de82" },
    { name: "Carbohydrates", consumed: nutritionData.carbs, target: carbsTarget, unit: "g", color: "#4ade80" },
    { name: "Fats", consumed: nutritionData.fats, target: fatsTarget, unit: "g", color: "#22c55e" },
  ];

  const micronutrients = [
    { name: "Calcium", consumed: nutritionData.calcium, target: 1000, unit: "mg", category: "Bone Health" },
    { name: "Magnesium", consumed: nutritionData.magnesium, target: 400, unit: "mg", category: "Muscle & Nerve" },
    { name: "Iron", consumed: nutritionData.iron, target: 18, unit: "mg", category: "Blood Health" },
    { name: "Vitamin C", consumed: nutritionData.vitaminC, target: 90, unit: "mg", category: "Immunity" },
    { name: "Vitamin D", consumed: nutritionData.vitaminD, target: 20, unit: "μg", category: "Bone & Immunity" },
    { name: "Vitamin A", consumed: nutritionData.vitaminA, target: 900, unit: "μg", category: "Vision & Skin" },
    { name: "Vitamin K", consumed: nutritionData.vitaminK, target: 120, unit: "μg", category: "Blood Clotting" },
    { name: "Vitamin E", consumed: nutritionData.vitaminE, target: 15, unit: "mg", category: "Antioxidant" },
    { name: "Vitamin B1", consumed: nutritionData.vitaminB1, target: 1.2, unit: "mg", category: "Energy Metabolism" },
    { name: "Vitamin B2", consumed: nutritionData.vitaminB2, target: 1.3, unit: "mg", category: "Energy Production" },
    { name: "Vitamin B3", consumed: nutritionData.vitaminB3, target: 16, unit: "mg", category: "Cellular Function" },
    { name: "Vitamin B6", consumed: nutritionData.vitaminB6, target: 1.7, unit: "mg", category: "Brain Health" },
    { name: "Folate (B9)", consumed: nutritionData.vitaminB9, target: 400, unit: "μg", category: "Cell Growth" },
    { name: "Vitamin B12", consumed: nutritionData.vitaminB12, target: 2.4, unit: "μg", category: "Nerve Function" },
    { name: "Zinc", consumed: nutritionData.zinc, target: 11, unit: "mg", category: "Immunity & Healing" },
    { name: "Selenium", consumed: nutritionData.selenium, target: 55, unit: "μg", category: "Antioxidant" },
  ];

  const mealsConsumed = todayMeals ? [todayMeals.breakfast].filter(meal => meal.name !== "Breakfast") : [
    {
      name: "Loading meals...",
      time: "--:--",
      type: "LOADING",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 p-12 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-48'}`}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-surface-container-low rounded-md flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <div>
            <h1 className="mb-2" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.5rem' }}>
              Vital Metrics & <span className="text-primary">Body Composition</span>
            </h1>
            <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
              A panoramic view of your biological evolution. We track the subtle shifts in your composition against curated nutritional benchmarks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Macros & Meals */}
          <div className="col-span-2 space-y-6">
            {/* Daily Summary */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs text-primary uppercase tracking-wider block mb-2" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                    TODAY'S PROGRESS
                  </span>
                  <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 600 }}>
                    Macro Distribution
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.5rem', fontWeight: 700 }}>
                      {nutritionData.calories}
                    </h2>
                    <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                      / {calorieTarget} kcal
                    </span>
                  </div>
                  <span className="text-primary text-sm" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                    {calorieTarget - nutritionData.calories} kcal remaining
                  </span>
                </div>
              </div>

              {/* Macro Bars */}
              <div className="space-y-4">
                {macros.map((macro) => {
                  const percentage = (macro.consumed / macro.target) * 100;
                  return (
                    <div key={macro.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                          {macro.name}
                        </span>
                        <span className="text-on-surface-variant text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                          {macro.consumed}{macro.unit} / {macro.target}{macro.unit}
                        </span>
                      </div>
                      <div className="relative w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(percentage, 100)}%`,
                            background: `linear-gradient(90deg, ${macro.color} 0%, ${macro.color}dd 100%)`
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micronutrient Profile (Horizontal) */}
            <div className="bg-surface-container-low p-6 rounded-xl overflow-hidden w-full">
              <span className="text-xs text-primary uppercase tracking-wider block mb-2" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                MICRONUTRIENT PROFILE
              </span>
              <h3 className="text-on-surface mb-6" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                Essential Nutrients
              </h3>

              <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .hide-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}} />

              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {micronutrients.map((nutrient) => {
                  const percentage = (nutrient.consumed / nutrient.target) * 100;
                  const isDeficient = percentage < 70;
                  const isOptimal = percentage >= 90 && percentage <= 110;
                  
                  return (
                    <div key={nutrient.name} className="bg-surface-container p-3.5 rounded-xl">
                      <div className="flex flex-col gap-1.5 mb-2.5">
                        <div className="flex justify-between items-start">
                          <h4 className="text-on-surface text-sm" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 700 }}>
                            {nutrient.name}
                          </h4>
                          <span className="text-on-surface-variant text-[10px] uppercase font-semibold" style={{ fontFamily: 'var(--font-family-body)' }}>
                            {nutrient.category}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-on-surface text-sm" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                            {nutrient.consumed}{nutrient.unit}
                          </span>
                          <span className="text-on-surface-variant text-xs" style={{ fontFamily: 'var(--font-family-body)' }}>
                            / {nutrient.target}{nutrient.unit}
                          </span>
                        </div>
                      </div>
                      
                      <div className="relative w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-1.5">
                        <div 
                          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: isDeficient ? '#ef4444' : isOptimal ? '#67de82' : '#fbbf24'
                          }}
                        ></div>
                      </div>
                      
                      <div className="h-3 flex items-center justify-start">
                        {isDeficient ? (
                          <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: 'var(--font-family-body)' }}>
                            ⚠ <span className="ml-[1px]">Below optimal</span>
                          </span>
                        ) : isOptimal ? (
                          <span className="text-[10px] text-primary font-medium" style={{ fontFamily: 'var(--font-family-body)' }}>
                            ✓ <span className="ml-[1px]">Optimal range</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-yellow-500 font-medium" style={{ fontFamily: 'var(--font-family-body)' }}>
                            In progress
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>

          {/* Right Column - Hydration & Activity */}
          <div className="space-y-6">

            {/* Hydration Card */}
            <div className="bg-surface-container-low p-6 rounded-xl" style={{ borderLeft: '3px solid var(--primary)' }}>
              <div className="flex items-center gap-3 mb-4">
                <Droplet className="w-6 h-6 text-primary" />
                <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                  Hydration Status
                </h4>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', fontWeight: 700 }}>
                  1.8L
                </h3>
                <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                  / 2.5L
                </span>
              </div>
              <p className="text-on-surface-variant text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                72% of daily goal completed
              </p>
            </div>

            {/* Activity Card */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-primary" />
                <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                  Activity Multiplier
                </h4>
              </div>
              <p className="text-on-surface-variant text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                Your active lifestyle adds +350 kcal to your daily budget
              </p>
            </div>

            {/* View Consumption Log Button */}
            <button 
              onClick={() => navigate("/meal-plan")}
              className="w-full bg-surface-container-low p-4 rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <Flame className="w-5 h-5 text-primary" />
                </div>
                <span className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600, fontSize: '1.125rem' }}>
                  Today's Logs
                </span>
              </div>
              <span className="text-primary group-hover:underline text-sm" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                View &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}