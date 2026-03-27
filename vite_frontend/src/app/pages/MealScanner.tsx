import { useNavigate } from "react-router";
import { ArrowLeft, Camera } from "lucide-react";

export function MealScanner() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-surface-container-low rounded-md flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: '2.5rem' }}>
            <span className="text-primary">Plate Scanner</span>
          </h1>
        </div>
        <p className="text-on-surface-variant text-lg mb-8" style={{ fontFamily: 'var(--font-family-body)' }}>
          AI-powered meal analysis with nutritional breakdown.
        </p>
        <div className="bg-surface-container-low p-12 rounded-xl text-center">
          <Camera className="w-16 h-16 text-primary mx-auto mb-6" />
          <p className="text-on-surface mb-4" style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.25rem' }}>
            Meal scanning interface coming soon.
          </p>
          <button 
            className="py-3 px-8 rounded-md transition-all duration-200 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
              color: 'var(--primary-foreground)',
              fontFamily: 'var(--font-family-body)',
              fontWeight: 600,
            }}
          >
            Upload Photo
          </button>
        </div>
      </div>
    </div>
  );
}
