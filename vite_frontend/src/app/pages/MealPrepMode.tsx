import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Users, Calendar, Clock, ChefHat, ShoppingCart, Plus, Search, CheckCircle2, Circle, Minus, Sparkles } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { Sidebar } from "../components/Sidebar";
import { fetchUserDataFromAPIs, getMarketList } from "../utils/apiUtils";

export function MealPrepMode() {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [selectedDietaryFocus, setSelectedDietaryFocus] = useState("Anti-inflammatory");
  const [isGroceryListGenerated, setIsGroceryListGenerated] = useState(false);
  const [activeDaysCount, setActiveDaysCount] = useState(3);
  const [marketList, setMarketList] = useState<Record<string, { name: string; amount: string; checked: boolean }[]>>(getMarketList());
  const swapOptions = ["Baby Kale", "Spinach", "Swiss Chard", "Arugula"];
  const [swapIndex, setSwapIndex] = useState(0);

  // Fetch user data on component mount and update market list when localStorage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (userPhone) {
          await fetchUserDataFromAPIs(userPhone);
          setMarketList(getMarketList());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    const handleStorageChange = () => {
      setMarketList(getMarketList());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const generateDateRange = (days: number) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days - 1);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: "Masala Omelette",
      tag: "HIGH PROTEIN",
      tagColor: "rgba(103, 222, 130, 0.9)",
      description: "Spiced Indian-style omelette with herbs",
      cookTime: "15 Min Cook",
      portions: 2,
      fridgeStable: "2 Days",
      calories: 350,
      protein: 25,
      carbs: 30,
      fats: 15,
      ingredients: "Eggs, Onion, Tomato, Green chili, Coriander, Turmeric, Salt, Oil",
      completed: false,
    },
    {
      id: 2,
      name: "Chicken Curry",
      tag: "MEAL PREP FRIENDLY",
      tagColor: "rgba(103, 222, 130, 0.9)",
      description: "Spiced chicken curry perfect for batch cooking",
      cookTime: "40 Min Cook",
      portions: 4,
      fridgeStable: "4 Days",
      calories: 600,
      protein: 50,
      carbs: 50,
      fats: 18,
      ingredients: "Chicken breast, Onion, Tomato, Ginger, Garlic, Spices, Quinoa",
      completed: false,
    },
    {
      id: 3,
      name: "Quinoa Pilaf",
      tag: "COMPLETE PROTEIN",
      tagColor: "rgba(103, 222, 130, 0.9)",
      description: "Nutritious grain base for weekly meals",
      cookTime: "25 Min Cook",
      portions: 6,
      fridgeStable: "5 Days",
      calories: 210,
      protein: 8,
      carbs: 38,
      fats: 4,
      ingredients: "Tri-color Quinoa, Vegetable broth, Onions, Celery",
      completed: false,
    },
  ]);

  const toggleRecipePrep = (id: number) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const incrementPortions = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setRecipes(recipes.map(r => r.id === id ? { ...r, portions: r.portions + 1 } : r));
  };

  const decrementPortions = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setRecipes(recipes.map(r => r.id === id ? { ...r, portions: Math.max(1, r.portions - 1) } : r));
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-48'} p-9`}>
        {/* Back Button */}
        <button 
          onClick={() => navigate("/meal-plan")}
          className="mb-6 flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.875rem', fontWeight: 600 }}>
            Back to Meal Plan
          </span>
        </button>

        {/* Header with Search */}
        <div className="flex items-start justify-between mb-9">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search curated recipes..."
              className="pl-10 pr-4 py-2.5 bg-surface-container-low rounded-md text-on-surface placeholder:text-on-surface-variant border-none outline-none focus:bg-surface-container transition-colors"
              style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.875rem', width: '280px' }}
            />
          </div>
        </div>

        {/* Top Info Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-9">
          {/* Week Info Card */}
          <div className="bg-surface-container-low p-6 rounded-xl flex items-center justify-center col-span-1">
             <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-on-surface block mb-1" style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.25rem', fontWeight: 600 }}>
                    {generateDateRange(activeDaysCount)}
                  </span>
                  <div className="px-3 py-1 bg-primary/20 rounded-full inline-block mt-2">
                    <span className="text-primary" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.875rem', fontWeight: 700 }}>
                      6.4kg Net Food Mass
                    </span>
                  </div>
                </div>
             </div>
          </div>

          {/* Tailor Your Intake Section */}
          <div className="bg-surface-container-low p-6 rounded-xl col-span-1 xl:col-span-2">
            <h3 className="text-on-surface mb-6" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
              Tailor Your Intake
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ingredient Swaps */}
              <div>
                <span className="text-on-surface-variant uppercase tracking-wider block mb-3" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.625rem', fontWeight: 600 }}>
                  INGREDIENT SWAPS
                </span>
                <div className="bg-surface-container p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-on-surface-variant text-xs block mb-1" style={{ fontFamily: 'var(--font-family-body)' }}>
                      Sample:
                    </span>
                    <span className="text-primary" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.875rem', fontWeight: 600 }}>
                      {swapOptions[swapIndex]}
                    </span>
                  </div>
                  <button onClick={() => setSwapIndex((prev) => (prev + 1) % swapOptions.length)} className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dietary Focus */}
              <div>
                <span className="text-on-surface-variant uppercase tracking-wider block mb-3" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.625rem', fontWeight: 600 }}>
                  DIETARY FOCUS
                </span>
                <select
                  value={selectedDietaryFocus}
                  onChange={(e) => setSelectedDietaryFocus(e.target.value)}
                  className="w-full bg-surface-container px-4 py-3 rounded-lg text-on-surface border-none outline-none cursor-pointer"
                  style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <option>Anti-inflammatory</option>
                  <option>High Protein</option>
                  <option>Low Carb</option>
                  <option>Keto</option>
                  <option>Paleo</option>
                </select>
              </div>

              {/* Active Meals */}
              <div>
                <span className="text-on-surface-variant uppercase tracking-wider block mb-3" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.625rem', fontWeight: 600 }}>
                  ACTIVE MEALS
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveDaysCount(index + 1)}
                      className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200"
                      style={{ 
                        background: index < activeDaysCount ? 'rgba(103, 222, 130, 0.3)' : 'var(--surface-container)',
                        color: index < activeDaysCount ? 'var(--primary)' : 'var(--on-surface-variant)'
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.875rem', fontWeight: 600 }}>
                        {daysOfWeek[index]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Recipe Cards */}
          <div className="col-span-2 space-y-6">
            <div className="flex flex-col gap-4">
              {recipes.map((recipe) => (
                <div 
                  key={recipe.id} 
                  className={`bg-surface-container-low rounded-xl p-5 flex items-center gap-6 transition-all hover:bg-surface-container cursor-pointer border-l-4 ${recipe.completed ? 'border-primary opacity-75' : 'border-transparent'}`}
                  onClick={() => toggleRecipePrep(recipe.id)}
                >
                  <button 
                    className="transition-opacity hover:opacity-80 focus:outline-none flex-shrink-0"
                  >
                    {recipe.completed ? (
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    ) : (
                      <Circle className="w-8 h-8 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors" />
                    )}
                  </button>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-on-surface font-semibold truncate" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem' }}>
                        {recipe.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider" style={{ backgroundColor: 'rgba(103, 222, 130, 0.15)', color: 'var(--primary)' }}>
                        {recipe.tag}
                      </span>
                    </div>
                    
                    <p className="text-on-surface-variant text-sm mb-2 truncate" style={{ fontFamily: 'var(--font-family-body)' }}>
                      {recipe.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                      <span className="font-semibold uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.cookTime}</span>
                      <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                      <span className="text-primary font-semibold">{recipe.calories} kcal</span>
                      <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                      <span>{recipe.protein}g P</span>
                      <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                      <span>{recipe.carbs}g C</span>
                      <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                      <span>{recipe.fats}g F</span>
                      <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
                      <span className="truncate max-w-[200px]" title={recipe.ingredients}>Incl: {recipe.ingredients}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-auto pl-4 border-l border-outline-variant/30">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider mb-1">Portions</span>
                      <div className="flex items-center bg-surface-container rounded-lg p-1">
                        <button 
                          onClick={(e) => decrementPortions(e, recipe.id)}
                          className="w-6 h-6 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-on-surface font-semibold text-sm">
                          {recipe.portions}
                        </span>
                        <button 
                          onClick={(e) => incrementPortions(e, recipe.id)}
                          className="w-6 h-6 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Market List & Tips */}
          <div className="space-y-6">
            {/* Market List */}
            <div className="bg-surface-container-low p-6 rounded-xl flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                  Market List
                </h3>
                {isGroceryListGenerated && (
                  <button className="text-primary hover:underline" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem', fontWeight: 600 }}>
                    SHARE LIST
                  </button>
                )}
              </div>

              {!isGroceryListGenerated ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-container rounded-xl border border-dashed border-outline-variant">
                  <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-on-surface mb-2" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem', fontWeight: 600 }}>
                    No List Generated
                  </h4>
                  <p className="text-on-surface-variant text-sm mb-6 max-w-[250px]" style={{ fontFamily: 'var(--font-family-body)' }}>
                    Sync your selected meals and dietary focus to create a customized shopping list.
                  </p>
                  <button 
                    onClick={() => setIsGroceryListGenerated(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-md w-full justify-center"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                      color: 'var(--primary-foreground)',
                      fontFamily: 'var(--font-family-body)' 
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Generate Grocery List
                  </button>
                </div>
              ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  {Object.entries(marketList).map(([category, items]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.625rem', fontWeight: 600 }}>
                          {category}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {items.map((item, index: number) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-surface-container transition-colors">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                className="w-4 h-4 rounded border-2 border-on-surface-variant checked:bg-primary checked:border-primary cursor-pointer"
                                readOnly
                              />
                              <span className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.875rem', textDecoration: item.checked ? 'line-through' : 'none', opacity: item.checked ? 0.5 : 1 }}>
                                {item.name}
                              </span>
                            </div>
                            <span className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '0.75rem' }}>
                              {item.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => navigate("/ai-chat")}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-xl shadow-[0_15px_45px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-200 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
          }}
        >
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
}