import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Minus, Droplet, Zap, Search } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useNutrition } from "../context/NutritionContext";
import { Sidebar } from "../components/Sidebar";

export function WaterIntake() {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const { waterIntake, logWater, dailyTargets } = useNutrition();
  const [intelligentPacing, setIntelligentPacing] = useState(true);
  const [nightModeSilence, setNightModeSilence] = useState(true);
  const waterGoal = dailyTargets.water_ml;

  const hydrationPercent = Math.min(100, Math.round((waterIntake / waterGoal) * 100)) || 0;
  const strokeOffset = 880 - (880 * hydrationPercent / 100);

  const todayLog = [
    { icon: Droplet, name: "Filtered Water", time: "08:15 AM", category: "Purified", amount: 500, color: "text-primary" },
    { icon: Droplet, name: "Filtered Water", time: "10:30 AM", category: "Purified", amount: 500, color: "text-primary" },
    { icon: Droplet, name: "Filtered Water", time: "01:45 PM", category: "Purified", amount: 500, color: "text-primary" },
  ];

  const weeklyData = [
    { day: "MON", value: 65 },
    { day: "TUE", value: 85 },
    { day: "WED", value: 72 },
    { day: "THU", value: 90 },
    { day: "FRI", value: 100 },
    { day: "SAT", value: 78 },
    { day: "SUN", value: 82 },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-48'}`}>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Hydration Circle & Log */}
            <div className="col-span-2 space-y-6">
              {/* Hydration Progress */}
              <div className="bg-surface-container-low p-12 rounded-xl flex items-center justify-between">
                <div className="flex-1">
                  {/* Progress Circle */}
                  <div className="relative w-80 h-80 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="160" 
                        cy="160" 
                        r="140" 
                        stroke="var(--surface-container-high)" 
                        strokeWidth="16" 
                        fill="none" 
                      />
                      <circle 
                        cx="160" 
                        cy="160" 
                        r="140" 
                        stroke="var(--primary)" 
                        strokeWidth="16" 
                        fill="none" 
                        strokeDasharray="880" 
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Droplet className="w-12 h-12 text-primary mb-4" />
                      <h2 className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '4rem', fontWeight: 700 }}>
                        {hydrationPercent}<span className="text-2xl">%</span>
                      </h2>
                      <p className="text-on-surface-variant uppercase tracking-wider text-sm" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                        HYDRATED
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center mt-8">
                    <button 
                      onClick={() => logWater(250)}
                      className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-on-surface rounded-md hover:bg-surface-container transition-colors" 
                      style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}
                    >
                      <Droplet className="w-4 h-4" />
                      <span>+ 250ml</span>
                    </button>
                    <button className="px-8 py-3 rounded-md transition-all duration-200 hover:opacity-90" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      Custom Log
                    </button>
                  </div>
                </div>
              </div>

              {/* Today's Log */}
              <div className="bg-surface-container-low p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 600 }}>
                    Today's Log
                  </h3>
                  <button className="text-primary text-sm hover:underline" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                    CLEAR ALL
                  </button>
                </div>

                <div className="space-y-3">
                  {todayLog.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-surface-container rounded-lg">
                      <div className="w-10 h-10 rounded-md bg-surface-container-high flex items-center justify-center">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-on-surface mb-1" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                          {item.name}
                        </h4>
                        <p className="text-on-surface-variant text-xs" style={{ fontFamily: 'var(--font-family-body)' }}>
                          {item.time} • {item.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`${item.color} text-lg`} style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700 }}>
                          {item.amount > 0 ? '+' : ''}{item.amount}ml
                        </span>
                        <p className="text-on-surface-variant text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)' }}>
                          {item.amount < 0 ? 'IMPACT' : item.category === 'Purified' ? 'RECOVERY' : 'HYDRATING'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Analysis */}
              <div className="bg-surface-container-low p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 600 }}>
                    Weekly Analysis
                  </h3>
                  <span className="text-on-surface-variant text-sm" style={{ fontFamily: 'var(--font-family-body)' }}>
                    May 12 — May 19
                  </span>
                </div>

                {/* Bar Chart */}
                <div className="flex items-end justify-between gap-2 h-64 mb-6">
                  {weeklyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-3">
                      <div className="w-full flex-1 flex items-end">
                        <div 
                          className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                          style={{ 
                            height: `${data.value}%`,
                            background: data.day === 'FRI' 
                              ? 'linear-gradient(180deg, var(--primary) 0%, var(--primary-container) 100%)'
                              : 'var(--surface-container-high)'
                          }}
                        ></div>
                      </div>
                      <span className="text-on-surface-variant text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                        {data.day}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <span className="text-on-surface-variant text-xs block mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      AVERAGE
                    </span>
                    <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', fontWeight: 700 }}>
                      2.8L
                    </h4>
                  </div>
                  <div className="text-center">
                    <span className="text-on-surface-variant text-xs block mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      CONSISTENCY
                    </span>
                    <h4 className="text-primary" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', fontWeight: 700 }}>
                      92%
                    </h4>
                  </div>
                  <div className="text-center">
                    <span className="text-on-surface-variant text-xs block mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                      TOP FLUID
                    </span>
                    <h4 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '2rem', fontWeight: 700 }}>
                      Water
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Reminders */}
            <div className="space-y-6">
              {/* Daily Goal */}
              <div className="bg-surface-container-low p-6 rounded-xl">
                <span className="text-xs text-primary uppercase tracking-wider block mb-4" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                  DAILY GOAL
                </span>
                <h2 className="text-on-surface mb-1" style={{ fontFamily: 'var(--font-family-display)', fontSize: '3rem', fontWeight: 700 }}>
                  {(waterIntake / 1000).toFixed(1)}
                </h2>
                <p className="text-on-surface-variant" style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.25rem' }}>
                  / {(waterGoal / 1000).toFixed(1)}L
                </p>
              </div>

              {/* Smart Reminders */}
              <div className="bg-surface-container-low p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.25rem', fontWeight: 600 }}>
                    Smart Reminders
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Intelligent Pacing */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-on-surface mb-1" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                        Intelligent Pacing
                      </h4>
                      <p className="text-on-surface-variant text-xs" style={{ fontFamily: 'var(--font-family-body)' }}>
                        Adjust frequency based on activity
                      </p>
                    </div>
                    <button
                      onClick={() => setIntelligentPacing(!intelligentPacing)}
                      className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
                        intelligentPacing ? 'bg-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                          intelligentPacing ? 'right-1' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Night Mode Silence */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-on-surface mb-1" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                        Night Mode Silence
                      </h4>
                      <p className="text-on-surface-variant text-xs" style={{ fontFamily: 'var(--font-family-body)' }}>
                        No alerts between 10PM - 7AM
                      </p>
                    </div>
                    <button
                      onClick={() => setNightModeSilence(!nightModeSilence)}
                      className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
                        nightModeSilence ? 'bg-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                          nightModeSilence ? 'right-1' : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Interval Frequency */}
                  <div className="pt-4" style={{ borderTop: '1px solid var(--outline-variant)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-on-surface-variant text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                        INTERVAL FREQUENCY
                      </span>
                      <span className="text-on-surface" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                        Every 45m
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '60%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-container) 100%)' }}></div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 py-3 px-4 bg-surface-container rounded-md text-on-surface text-sm hover:bg-surface-container-high transition-colors" style={{ fontFamily: 'var(--font-family-body)', fontWeight: 600 }}>
                  ⚙️ ADVANCED SETTINGS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}