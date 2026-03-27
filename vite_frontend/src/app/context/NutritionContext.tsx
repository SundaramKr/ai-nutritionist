import { createContext, useContext, useState, ReactNode } from "react";

interface Meal {
  id: string;
  name: string;
  time: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  // Micronutrients
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  vitaminB1?: number;
  vitaminB2?: number;
  vitaminB3?: number;
  vitaminB6?: number;
  vitaminB9?: number;
  vitaminB12?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  zinc?: number;
  selenium?: number;
}

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
  vitaminB1: number;
  vitaminB2: number;
  vitaminB3: number;
  vitaminB6: number;
  vitaminB9: number;
  vitaminB12: number;
  calcium: number;
  iron: number;
  magnesium: number;
  zinc: number;
  selenium: number;
}

interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  water_ml: number;
}

interface NutritionContextType {
  loggedMeals: string[];
  nutritionData: NutritionData;
  dailyTargets: DailyTargets;
  waterIntake: number;
  logMeal: (meal: Meal) => void;
  unlogMeal: (meal: Meal) => void;
  isMealLogged: (mealId: string) => boolean;
  updateDailyTargets: (targets: Partial<DailyTargets>) => void;
  logWater: (amount: number) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export function NutritionProvider({ children }: { children: ReactNode }) {
  const [loggedMeals, setLoggedMeals] = useState<string[]>([]);
  const [nutritionData, setNutritionData] = useState<NutritionData>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0,
    vitaminK: 0,
    vitaminB1: 0,
    vitaminB2: 0,
    vitaminB3: 0,
    vitaminB6: 0,
    vitaminB9: 0,
    vitaminB12: 0,
    calcium: 0,
    iron: 0,
    magnesium: 0,
    zinc: 0,
    selenium: 0,
  });

  const [dailyTargets, setDailyTargets] = useState<DailyTargets>({
    calories: 2250,
    protein: 180,
    carbs: 250,
    fats: 70,
    fiber: 35,
    water_ml: 2500
  });

  const updateDailyTargets = (targets: Partial<DailyTargets>) => {
    setDailyTargets(prev => ({ ...prev, ...targets }));
  };

  const [waterIntake, setWaterIntake] = useState<number>(0);

  const logWater = (amount: number) => {
    setWaterIntake(prev => prev + amount);
  };

  const logMeal = (meal: Meal) => {
    if (loggedMeals.indexOf(meal.id) === -1) {
      setLoggedMeals([...loggedMeals, meal.id]);
      setNutritionData((prev) => ({
        calories: prev.calories + meal.calories,
        protein: prev.protein + meal.protein,
        carbs: prev.carbs + meal.carbs,
        fats: prev.fats + meal.fats,
        fiber: prev.fiber + (meal.fiber || 0),
        vitaminA: prev.vitaminA + (meal.vitaminA || 0),
        vitaminC: prev.vitaminC + (meal.vitaminC || 0),
        vitaminD: prev.vitaminD + (meal.vitaminD || 0),
        vitaminE: prev.vitaminE + (meal.vitaminE || 0),
        vitaminK: prev.vitaminK + (meal.vitaminK || 0),
        vitaminB1: prev.vitaminB1 + (meal.vitaminB1 || 0),
        vitaminB2: prev.vitaminB2 + (meal.vitaminB2 || 0),
        vitaminB3: prev.vitaminB3 + (meal.vitaminB3 || 0),
        vitaminB6: prev.vitaminB6 + (meal.vitaminB6 || 0),
        vitaminB9: prev.vitaminB9 + (meal.vitaminB9 || 0),
        vitaminB12: prev.vitaminB12 + (meal.vitaminB12 || 0),
        calcium: prev.calcium + (meal.calcium || 0),
        iron: prev.iron + (meal.iron || 0),
        magnesium: prev.magnesium + (meal.magnesium || 0),
        zinc: prev.zinc + (meal.zinc || 0),
        selenium: prev.selenium + (meal.selenium || 0),
      }));
    }
  };

  const unlogMeal = (meal: Meal) => {
    if (loggedMeals.indexOf(meal.id) !== -1) {
      setLoggedMeals(loggedMeals.filter((id) => id !== meal.id));
      setNutritionData((prev) => ({
        calories: prev.calories - meal.calories,
        protein: prev.protein - meal.protein,
        carbs: prev.carbs - meal.carbs,
        fats: prev.fats - meal.fats,
        fiber: prev.fiber - (meal.fiber || 0),
        vitaminA: prev.vitaminA - (meal.vitaminA || 0),
        vitaminC: prev.vitaminC - (meal.vitaminC || 0),
        vitaminD: prev.vitaminD - (meal.vitaminD || 0),
        vitaminE: prev.vitaminE - (meal.vitaminE || 0),
        vitaminK: prev.vitaminK - (meal.vitaminK || 0),
        vitaminB1: prev.vitaminB1 - (meal.vitaminB1 || 0),
        vitaminB2: prev.vitaminB2 - (meal.vitaminB2 || 0),
        vitaminB3: prev.vitaminB3 - (meal.vitaminB3 || 0),
        vitaminB6: prev.vitaminB6 - (meal.vitaminB6 || 0),
        vitaminB9: prev.vitaminB9 - (meal.vitaminB9 || 0),
        vitaminB12: prev.vitaminB12 - (meal.vitaminB12 || 0),
        calcium: prev.calcium - (meal.calcium || 0),
        iron: prev.iron - (meal.iron || 0),
        magnesium: prev.magnesium - (meal.magnesium || 0),
        zinc: prev.zinc - (meal.zinc || 0),
        selenium: prev.selenium - (meal.selenium || 0),
      }));
    }
  };

  const isMealLogged = (mealId: string) => loggedMeals.indexOf(mealId) !== -1;

  return (
    <NutritionContext.Provider value={{ 
      loggedMeals, 
      nutritionData, 
      dailyTargets,
      waterIntake,
      logMeal, 
      unlogMeal, 
      isMealLogged,
      updateDailyTargets,
      logWater
    }}>
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error("useNutrition must be used within a NutritionProvider");
  }
  return context;
}

export type { Meal, NutritionData, DailyTargets };