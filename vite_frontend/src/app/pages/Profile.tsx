import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, Ruler, Weight, Target, TrendingUp, Zap, Leaf, Sparkles, ChevronRight, Check } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import { Switch } from "../components/ui/switch";
import { fetchUserDataFromAPIs, getUserDetails } from "../utils/apiUtils";

export function Profile() {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [smartCoaching, setSmartCoaching] = useState(false);
  const [userDetails, setUserDetails] = useState(getUserDetails());

  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [metrics, setMetrics] = useState({
    height: userDetails?.height || 178,
    currentWeight: userDetails?.weight || 21,
    goalWeight: userDetails?.weight || 21, // Using current as goal since not specified
    bodyFat: userDetails?.bodyFat || 16,
    activityLevel: userDetails?.activityLevel || "Moderately active (3–5 days/week)",
    dietType: userDetails?.dietType || "Non-Vegetarian",
    primaryGoal: userDetails?.primaryGoal || "Build muscle",
    medicalConditions: userDetails?.medicalConditions || "Pregnancy",
    allergies: userDetails?.allergies || "Gluten",
    workoutType: userDetails?.workoutType || "Yes – Gym (strength training)",
    profession: userDetails?.profession || "Student",
    currentMealsPerDay: userDetails?.currentMealsPerDay || "4+ meals",
    preferredMealsPerDay: userDetails?.preferredMealsPerDay || "4 meals",
    eatsOutsideFrequency: userDetails?.eatsOutsideFrequency || "1–2 times/week",
    budget: userDetails?.budget || "200–300 rupees",
    waterIntake: userDetails?.waterIntake || "Good",
    sleepQuality: userDetails?.sleepQuality || "Average",
    cuisinePreference: userDetails?.cuisinePreference || "Mixed food",
    foodsToAvoid: userDetails?.foodsToAvoid || "None",
    mealPrep: userDetails?.mealPrep || "Yes"
  });
  
  // Fetch user data on component mount and update user details when localStorage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (userPhone) {
          await fetchUserDataFromAPIs(userPhone);
          const details = getUserDetails();
          if (details) {
            setUserDetails(details);
            setMetrics(prev => ({
              ...prev,
              height: details.height || prev.height,
              currentWeight: details.weight || prev.currentWeight,
              bodyFat: details.bodyFat || prev.bodyFat,
              activityLevel: details.activityLevel || prev.activityLevel,
              dietType: details.dietType || prev.dietType,
              primaryGoal: details.primaryGoal || prev.primaryGoal,
              medicalConditions: details.medicalConditions || prev.medicalConditions,
              allergies: details.allergies || prev.allergies,
              workoutType: details.workoutType || prev.workoutType,
              profession: details.profession || prev.profession
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchData();
    
    const handleStorageChange = () => {
      const details = getUserDetails();
      if (details) {
        setUserDetails(details);
        setMetrics(prev => ({
          ...prev,
          height: details.height || prev.height,
          currentWeight: details.weight || prev.currentWeight,
          bodyFat: details.bodyFat || prev.bodyFat,
          activityLevel: details.activityLevel || prev.activityLevel,
          dietType: details.dietType || prev.dietType,
          primaryGoal: details.primaryGoal || prev.primaryGoal,
          medicalConditions: details.medicalConditions || prev.medicalConditions,
          allergies: details.allergies || prev.allergies,
          workoutType: details.workoutType || prev.workoutType,
          profession: details.profession || prev.profession
        }));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-48'} p-9`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-9">
          <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.25rem' }}>
            Profile & Settings
          </h1>
        </div>

        {/* Profile Section */}
        <div className="bg-surface-container-low p-9 rounded-xl mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/vector-1742875355318-00d715aec3e8"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-on-surface mb-1.5" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.25rem', fontWeight: 700 }}>
                {localStorage.getItem('userName') || 'User'}
              </h2>
            </div>
          </div>
        </div>

        {/* Biometric Profile Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4.5">
            <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.3125rem', fontWeight: 600 }}>
              Biometric Profile
            </h3>
            <button 
              onClick={() => setIsEditingMetrics(!isEditingMetrics)}
              className="text-primary hover:underline" 
              style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}
            >
              {isEditingMetrics ? 'SAVE ALL STATS' : 'UPDATE ALL STATS'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4.5">
            {/* Height */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <div className="flex items-center gap-2.25 mb-4.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <Ruler className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                  HEIGHT
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                {isEditingMetrics ? (
                  <input 
                    type="number" 
                    value={metrics.height} 
                    onChange={e => setMetrics({...metrics, height: Number(e.target.value)})}
                    className="bg-surface border border-surface-container-high text-on-surface rounded px-2 py-1 w-24 text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-family-display)' }}
                  />
                ) : (
                  <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.625rem', fontWeight: 700 }}>
                    {metrics.height}
                  </h3>
                )}
                <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem' }}>
                  cm
                </span>
              </div>
            </div>

            {/* Current Weight */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <div className="flex items-center gap-2.25 mb-4.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <Weight className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                  CURRENT WEIGHT
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                {isEditingMetrics ? (
                  <input 
                    type="number" 
                    value={metrics.currentWeight} 
                    onChange={e => setMetrics({...metrics, currentWeight: Number(e.target.value)})}
                    className="bg-surface border border-surface-container-high text-on-surface rounded px-2 py-1 w-24 text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-family-display)' }}
                  />
                ) : (
                  <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.625rem', fontWeight: 700 }}>
                    {metrics.currentWeight}
                  </h3>
                )}
                <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem' }}>
                  kg
                </span>
              </div>
            </div>

            {/* Goal Weight */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <div className="flex items-center gap-2.25 mb-4.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <Target className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                  GOAL WEIGHT
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                {isEditingMetrics ? (
                  <input 
                    type="number" 
                    value={metrics.goalWeight} 
                    onChange={e => setMetrics({...metrics, goalWeight: Number(e.target.value)})}
                    className="bg-surface border border-surface-container-high text-on-surface rounded px-2 py-1 w-24 text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-family-display)' }}
                  />
                ) : (
                  <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.625rem', fontWeight: 700 }}>
                    {metrics.goalWeight}
                  </h3>
                )}
                <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem' }}>
                  kg
                </span>
              </div>
            </div>

            {/* Body Fat % */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <div className="flex items-center gap-2.25 mb-4.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                  BODY FAT %
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                {isEditingMetrics ? (
                  <input 
                    type="number" 
                    value={metrics.bodyFat} 
                    onChange={e => setMetrics({...metrics, bodyFat: Number(e.target.value)})}
                    className="bg-surface border border-surface-container-high text-on-surface rounded px-2 py-1 w-24 text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-family-display)' }}
                  />
                ) : (
                  <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.625rem', fontWeight: 700 }}>
                    {metrics.bodyFat}
                  </h3>
                )}
                <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem' }}>
                  %
                </span>
              </div>
            </div>

            {/* Activity Level */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <div className="flex items-center gap-2.25 mb-4.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <Zap className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                  ACTIVITY LEVEL
                </span>
              </div>
              {isEditingMetrics ? (
                <select 
                  value={metrics.activityLevel} 
                  onChange={e => setMetrics({...metrics, activityLevel: e.target.value})}
                  className="bg-surface border border-surface-container-high text-on-surface rounded px-2 py-1 w-full text-sm mt-1"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  <option value="Sedentary">Sedentary</option>
                  <option value="Lightly Active">Lightly Active</option>
                  <option value="Moderately Active">Moderately Active</option>
                  <option value="Highly Active">Highly Active</option>
                </select>
              ) : (
                <>
                  <h4 className="text-on-surface mb-1" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.125rem', fontWeight: 600 }}>
                    {metrics.activityLevel}
                  </h4>
                  <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    {metrics.activityLevel === "Highly Active" ? "5-6 workouts per week" : 
                     metrics.activityLevel === "Moderately Active" ? "3-4 workouts per week" :
                     metrics.activityLevel === "Lightly Active" ? "1-2 workouts per week" : "Little or no exercise"}
                  </p>
                </>
              )}
            </div>

            {/* Diet Type */}
            <div className="bg-surface-container-low p-6 rounded-xl">
              <div className="flex items-center gap-2.25 mb-4.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                  <Leaf className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                  DIET TYPE
                </span>
              </div>
              {isEditingMetrics ? (
                <select 
                  value={metrics.dietType} 
                  onChange={e => setMetrics({...metrics, dietType: e.target.value})}
                  className="bg-surface border border-surface-container-high text-on-surface rounded px-2 py-1 w-full text-sm mt-1"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  <option value="Paleo Focused">Paleo Focused</option>
                  <option value="Keto">Keto</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Vegan">Vegan</option>
                </select>
              ) : (
                <>
                  <h4 className="text-on-surface mb-1" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.125rem', fontWeight: 600 }}>
                    {metrics.dietType}
                  </h4>
                  <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    {metrics.dietType === "Paleo Focused" ? "High protein, zero refined sugar" :
                     metrics.dietType === "Keto" ? "High fat, very low carb" :
                     metrics.dietType === "Vegan" ? "Plant-based only" : "Balanced macros"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Performance Targets and Vitality Insights */}
        <div className="grid grid-cols-3 gap-4.5 mb-6">
          {/* Performance Targets */}
          <div className="col-span-2 bg-surface-container-low p-6 rounded-xl">
            <h3 className="text-on-surface mb-6" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.3125rem', fontWeight: 600 }}>
              Performance Targets
            </h3>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Current Goal */}
              <div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider block mb-2.25" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                  CURRENT GOAL
                </span>
                <h4 className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.125rem', fontWeight: 600 }}>
                  {metrics.primaryGoal}
                </h4>
              </div>

              {/* Daily Calories */}
              <div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider block mb-2.25" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                  DAILY CALORIES
                </span>
                <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.125rem', fontWeight: 600 }}>
                  2,650 kcal
                </h4>
              </div>
            </div>

            {/* Macro Nutrient Split */}
            <div className="mb-6">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider block mb-3" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                MACRO NUTRIENT SPLIT
              </span>
              <div className="flex gap-0 h-3 rounded-full overflow-hidden mb-3">
                <div className="bg-primary" style={{ width: '40%' }}></div>
                <div className="bg-primary" style={{ width: '30%', opacity: 0.7 }}></div>
                <div className="bg-surface-container-high" style={{ width: '30%' }}></div>
              </div>
              <div className="flex gap-4.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.25 h-2.25 rounded-full bg-primary"></div>
                  <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    40% Protein
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.25 h-2.25 rounded-full bg-primary" style={{ opacity: 0.7 }}></div>
                  <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    30% Fats
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.25 h-2.25 rounded-full bg-surface-container-high"></div>
                  <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    30% Carbs
                  </span>
                </div>
              </div>
            </div>

            {/* Target Date */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.5625rem' }}>
                  TARGET DATE
                </span>
                <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem', fontWeight: 600 }}>
                  November 15, 2024
                </h4>
              </div>
              <button 
                onClick={() => navigate("/ai-chat")}
                className="px-6 py-3 rounded-md flex items-center gap-2.25 hover:opacity-90 transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                  color: 'var(--primary-foreground)',
                }}
              >
                <Sparkles className="w-3.75 h-3.75" />
                <span style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}>
                  MODIFY WITH AI COACH
                </span>
              </button>
            </div>
          </div>

          {/* Vitality Insights */}
          <div className="bg-surface-container-low p-6 rounded-xl">
            <div className="flex items-center gap-2.25 mb-6">
              <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                <Sparkles className="w-4.5 h-4.5 text-primary" />
              </div>
            </div>
            <h3 className="text-on-surface mb-3" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.3125rem', fontWeight: 600 }}>
              Vitality Insights
            </h3>
            <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
              {metrics.medicalConditions}
            </p>
            <p className="text-on-surface-variant mt-1" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
              Allergies: {metrics.allergies}
            </p>
            <button 
              onClick={() => navigate("/ai-chat")}
              className="text-primary hover:underline flex items-center gap-1.5" 
              style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600, fontSize: '0.75rem' }}
            >
              View Detailed Report
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Preferences and Account Management */}
        <div className="grid grid-cols-2 gap-4.5">
          {/* Preferences */}
          <div className="bg-surface-container-low p-6 rounded-xl">
            <div className="flex items-center gap-2.25 mb-6">
              <Bell className="w-4.5 h-4.5 text-primary" />
              <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.3125rem', fontWeight: 600 }}>
                Preferences
              </h3>
            </div>

            <div className="space-y-4.5">
              {/* Push Notifications */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-on-surface mb-0.75" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem', fontWeight: 600 }}>
                    Push Notifications
                  </h4>
                  <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    Meal reminders and performance alerts
                  </p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications}
                />
              </div>

              {/* Weekly Insights Digest */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-on-surface mb-0.75" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem', fontWeight: 600 }}>
                    Weekly Insights Digest
                  </h4>
                  <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    Summary of your nutritional performance
                  </p>
                </div>
                <Switch 
                  checked={weeklyDigest} 
                  onCheckedChange={setWeeklyDigest}
                />
              </div>

              {/* Smart Coaching Prompts */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-on-surface mb-0.75" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem', fontWeight: 600 }}>
                    Smart Coaching Prompts
                  </h4>
                  <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                    Real-time suggestions based on activity
                  </p>
                </div>
                <Switch 
                  checked={smartCoaching} 
                  onCheckedChange={setSmartCoaching}
                />
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-surface-container-low p-6 rounded-xl">
            <div className="flex items-center gap-2.25 mb-6">
              <TrendingUp className="w-4.5 h-4.5 text-primary" />
              <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.3125rem', fontWeight: 600 }}>
                Account Management
              </h3>
            </div>

            <div className="space-y-3">
              {/* Change Password */}
              <button className="w-full flex items-center justify-between p-3 rounded-md hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2.25">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <span className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem', fontWeight: 600 }}>
                    Change Password
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </button>

              {/* Export My Data */}
              <button className="w-full flex items-center justify-between p-3 rounded-md hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2.25">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(103, 222, 130, 0.2)' }}>
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <span className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem', fontWeight: 600 }}>
                    Export My Data
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </button>

              {/* Log Out */}
              <button 
                onClick={() => navigate("/login-signup")}
                className="w-full flex items-center justify-between p-3 rounded-md hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-2.25">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                    <svg className="w-3.5 h-3.5" style={{ color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.9375rem', fontWeight: 600 }}>
                    Log Out
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
