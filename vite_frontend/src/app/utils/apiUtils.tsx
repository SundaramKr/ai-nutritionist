// Utility functions for API calls and data fetching

// Get current day in Indian timezone
export const getCurrentDayInIndia = () => {
  const options: Intl.DateTimeFormatOptions = { 
    timeZone: 'Asia/Kolkata', 
    weekday: 'long' 
  };
  const day = new Date().toLocaleDateString('en-US', options);
  return day;
};

// Fetch user data from APIs
export const fetchUserDataFromAPIs = async (userPhone: string) => {
  try {
    const [detailsResponse, planResponse] = await Promise.all([
      fetch(`https://eiecdmzgvoagdsivbmzn.functions.supabase.co/get-details?phone=${userPhone}`),
      fetch(`https://eiecdmzgvoagdsivbmzn.functions.supabase.co/get-plan?phone=${userPhone}`)
    ]);

    const detailsData = await detailsResponse.json();
    const planData = await planResponse.json();

    let mealPlanData = null;
    
    // Store only specific fields in localStorage
    if (detailsData.user && detailsData.user.user_details) {
      localStorage.setItem('userDetails', detailsData.user.user_details);
    }

    if (planData.latest && planData.latest.meal_plan) {
      // Parse the meal_plan string if it's a string
      mealPlanData = planData.latest.meal_plan;
      if (typeof mealPlanData === 'string') {
        mealPlanData = JSON.parse(mealPlanData);
      }
      localStorage.setItem('userMealPlan', JSON.stringify(mealPlanData));
    }

    return {
      userDetails: detailsData.user?.user_details || null,
      mealPlan: mealPlanData
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      userDetails: null,
      mealPlan: null
    };
  }
};

// Parse user details from localStorage
export const getUserDetails = () => {
  try {
    const userDetailsStr = localStorage.getItem('userDetails');
    if (!userDetailsStr) return null;
    
    // Parse the user details string into structured data
    const lines = userDetailsStr.split('\n').filter(line => line.trim());
    const details: any = {};
    
    lines.forEach(line => {
      if (line.includes('Age:')) details.age = parseInt(line.split(':')[1].trim());
      if (line.includes('Height:')) details.height = parseInt(line.split(':')[1].trim());
      if (line.includes('Weight:')) details.weight = parseInt(line.split(':')[1].trim());
      if (line.includes('Gender:')) details.gender = line.split(':')[1].trim();
      if (line.includes('Primary Goal:')) details.primaryGoal = line.split(':')[1].trim();
      if (line.includes('Diet Type:')) details.dietType = line.split(':')[1].trim();
      if (line.includes('Medical Conditions:')) details.medicalConditions = line.split(':')[1].trim();
      if (line.includes('Allergies:')) details.allergies = line.split(':')[1].trim();
      if (line.includes('Activity Level:')) details.activityLevel = line.split(':')[1].trim();
      if (line.includes('Workout Type:')) details.workoutType = line.split(':')[1].trim();
      if (line.includes('Profession:')) details.profession = line.split(':')[1].trim();
      if (line.includes('Current Meals per Day:')) details.currentMealsPerDay = line.split(':')[1].trim();
      if (line.includes('Preferred Meals per Day:')) details.preferredMealsPerDay = line.split(':')[1].trim();
      if (line.includes('Eats Outside Frequency:')) details.eatsOutsideFrequency = line.split(':')[1].trim();
      if (line.includes('Body Fat %:')) details.bodyFat = parseFloat(line.split(':')[1].trim());
      if (line.includes('Budget:')) details.budget = line.split(':')[1].trim();
      if (line.includes('Water Intake:')) details.waterIntake = line.split(':')[1].trim();
      if (line.includes('Sleep Quality:')) details.sleepQuality = line.split(':')[1].trim();
      if (line.includes('Cuisine Preference:')) details.cuisinePreference = line.split(':')[1].trim();
      if (line.includes('Foods to Avoid:')) details.foodsToAvoid = line.split(':')[1].trim();
      if (line.includes('Meal Prep:')) details.mealPrep = line.split(':')[1].trim();
    });
    
    return details;
  } catch {
    return null;
  }
};

// Parse meal plan from localStorage
export const getMealPlan = () => {
  try {
    const mealPlanStr = localStorage.getItem('userMealPlan');
    return mealPlanStr ? JSON.parse(mealPlanStr) : null;
  } catch {
    return null;
  }
};

// Get today's meal data based on Indian timezone
export const getTodayMeals = () => {
  const mealPlan = getMealPlan();
  if (!mealPlan?.plan?.days) return null;
  
  const currentDay = getCurrentDayInIndia();
  const todayData = mealPlan.plan.days.find((day: any) => day.day === currentDay);
  
  if (!todayData?.meals) return null;
  
  return {
    breakfast: {
      id: "breakfast-today",
      name: todayData.meals.breakfast?.name || "Breakfast",
      time: "07:30 AM",
      category: "BREAKFAST",
      calories: todayData.meals.breakfast?.macros?.calories || 0,
      protein: todayData.meals.breakfast?.macros?.protein || 0,
      carbs: todayData.meals.breakfast?.macros?.carbs || 0,
      fats: todayData.meals.breakfast?.macros?.fats || 0,
      fiber: todayData.meals.breakfast?.macros?.fiber || 0,
    },
    lunch: {
      id: "lunch-today",
      name: todayData.meals.lunch?.name || "Lunch",
      time: "01:00 PM",
      category: "LUNCH",
      calories: todayData.meals.lunch?.macros?.calories || 0,
      protein: todayData.meals.lunch?.macros?.protein || 0,
      carbs: todayData.meals.lunch?.macros?.carbs || 0,
      fats: todayData.meals.lunch?.macros?.fats || 0,
      fiber: todayData.meals.lunch?.macros?.fiber || 0,
    },
    dinner: {
      id: "dinner-today",
      name: todayData.meals.dinner?.name || "Dinner",
      time: "08:00 PM",
      category: "DINNER",
      calories: todayData.meals.dinner?.macros?.calories || 0,
      protein: todayData.meals.dinner?.macros?.protein || 0,
      carbs: todayData.meals.dinner?.macros?.carbs || 0,
      fats: todayData.meals.dinner?.macros?.fats || 0,
      fiber: todayData.meals.dinner?.macros?.fiber || 0,
    },
    totals: todayData.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 }
  };
};

// Get grocery list from meal plan
export const getGroceryList = () => {
  const mealPlan = getMealPlan();
  if (!mealPlan?.grocery_list) return [];
  
  const groceryList: any[] = [];
  
  // Convert grocery list to the format expected by components
  Object.entries(mealPlan.grocery_list).forEach(([category, items]) => {
    if (Array.isArray(items)) {
      items.forEach(item => {
        groceryList.push({
          id: `${category}-${item}`,
          name: item,
          category: category.charAt(0).toUpperCase() + category.slice(1),
          checked: false
        });
      });
    }
  });
  
  return groceryList;
};

// Get market list for meal prep
export const getMarketList = () => {
  const mealPlan = getMealPlan();
  if (!mealPlan?.grocery_list) return {};
  
  const marketList: Record<string, { name: string; amount: string; checked: boolean }[]> = {};
  
  Object.entries(mealPlan.grocery_list).forEach(([category, items]) => {
    if (Array.isArray(items)) {
      marketList[category.charAt(0).toUpperCase() + category.slice(1)] = items.map(item => ({
        name: item,
        amount: '1 unit',
        checked: false
      }));
    }
  });
  
  return marketList;
};
