import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Trash2, Check, ShoppingBag, Search } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { Sidebar } from "../components/Sidebar";
import { fetchUserDataFromAPIs, getGroceryList } from "../utils/apiUtils";

interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  category: string;
}

export function GroceryList() {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [groceries, setGroceries] = useState<GroceryItem[]>(getGroceryList());
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch user data on component mount and update grocery list when localStorage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (userPhone) {
          await fetchUserDataFromAPIs(userPhone);
          setGroceries(getGroceryList());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchData();
    
    const handleStorageChange = () => {
      setGroceries(getGroceryList());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const categories = Array.from(new Set(groceries.map(item => item.category)));

  const toggleItem = (id: string) => {
    setGroceries(groceries.map((item: GroceryItem) => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setGroceries(groceries.filter((item: GroceryItem) => item.id !== id));
  };

  const clearChecked = () => {
    setGroceries(groceries.filter((item: GroceryItem) => !item.checked));
  };

  const filteredItems = groceries.filter((item: GroceryItem) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = groceries.length;
  const checkedItemsCount = groceries.filter((item: GroceryItem) => item.checked).length;
  const progressPercentage = totalItems === 0 ? 0 : Math.round((checkedItemsCount / totalItems) * 100);

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-48'}`}>
        {/* Header */}
        <div className="p-6 pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-surface-container rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </button>
            <div>
              <h1 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 700 }}>
                Grocery List
              </h1>
              <p className="text-on-surface-variant text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                Based on your 7-day meal plan
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface pl-12 pr-4 py-3 rounded-lg outline-none transition-all duration-200 placeholder:text-on-surface-variant/60"
                style={{ fontFamily: 'var(--font-family-body)' }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'var(--surface-container)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'var(--surface-container-low)';
                }}
              />
            </div>
            
            <button 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
              style={{ fontFamily: 'var(--font-family-body)' }}
            >
              <Plus className="w-5 h-5" />
              Add Custom Item
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress Section */}
            <div className="bg-surface-container-low p-6 rounded-xl mb-8">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-on-surface text-lg mb-1" style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}>
                    Shopping Progress
                  </h3>
                  <p className="text-on-surface-variant text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                    {checkedItemsCount} of {totalItems} items collected
                  </p>
                </div>
                <div className="text-primary text-2xl" style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700 }}>
                  {progressPercentage}%
                </div>
              </div>
              <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            {checkedItemsCount > 0 && (
              <div className="flex justify-end mb-4">
                <button 
                  onClick={clearChecked}
                  className="text-sm text-on-surface-variant hover:text-rose-400 transition-colors flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear checked items
                </button>
              </div>
            )}

            {/* Categories & Items List */}
            <div className="space-y-8">
              {categories.map(category => {
                const categoryItems = filteredItems.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category} className="space-y-4">
                    <h3 className="text-on-surface text-lg border-b border-outline-variant pb-2" style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}>
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryItems.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                            item.checked 
                              ? 'bg-surface-container opacity-60' 
                              : 'bg-surface-container-low hover:bg-surface-container'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${
                              item.checked 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : 'border-outline text-transparent'
                            }`}>
                              <Check className="w-4 h-4" />
                            </div>
                            <div className={item.checked ? 'line-through text-on-surface-variant' : 'text-on-surface'}>
                              <span style={{ fontFamily: 'var(--font-family-body)', fontWeight: 500, display: 'block' }}>
                                {item.name}
                              </span>
                              <span className="text-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                                {item.quantity}
                              </span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteItem(item.id);
                            }}
                            className="p-2 text-on-surface-variant hover:text-rose-400 hover:bg-surface transition-colors rounded-full opacity-0 group-hover:opacity-100 sm:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-on-surface-variant" />
                  </div>
                  <h3 className="text-on-surface text-lg mb-2" style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}>
                    No items found
                  </h3>
                  <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)' }}>
                    Try adjusting your search query.
                  </p>
                </div>
              )}
            </div>
            
            <div className="h-12"></div> {/* Bottom padding */}
          </div>
        </div>
      </div>
    </div>
  );
}