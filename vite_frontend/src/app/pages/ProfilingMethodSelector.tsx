import { useNavigate } from "react-router";
import { useState } from "react";
import { Logo } from "../components/Logo";
import { MessageSquare, Phone, FileText, ArrowRight, Timer } from "lucide-react";
import { AICallModal } from "../components/AICallModal";

export function ProfilingMethodSelector() {
  const navigate = useNavigate();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex justify-between items-center">
          <Logo />
          <button className="text-on-surface-variant hover:text-on-surface transition-colors" style={{ fontFamily: 'var(--font-family-body)' }}>
            Support
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Hero Text - Intentional Asymmetry */}
        <div className="mb-24 max-w-4xl">
          <h1 className="mb-8" style={{ fontFamily: 'var(--font-family-display)', fontSize: '3.5rem', lineHeight: '1.1' }}>
            Your path to <span className="text-primary">vitality</span><br />
            starts here.
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed" style={{ fontFamily: 'var(--font-family-body)', fontSize: '1.125rem' }}>
            Choose how you'd like to build your nutritional profile. From
            detailed manual entry to a simple phone conversation, we've
            designed a flow for every pace.
          </p>
        </div>

        {/* Method Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Set Up via AI Phone Call */}
          <div className="bg-surface-container-low rounded-xl p-8 hover:bg-surface-container transition-all duration-300">
            <div className="mb-6">
              <span 
                className="px-3 py-1.5 bg-surface-container-high text-primary rounded-full inline-block mb-8 text-xs tracking-wider"
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 600,
                }}
              >
                INCLUSIVE DESIGN
              </span>
              <h3 className="text-on-surface mb-4" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                Set Up via AI<br />Phone Call
              </h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-family-body)' }}>
                Prefer a real conversation? Simply pick up the phone. Talk through your goals, stats, and lifestyle with our voice-guided AI assistant. No screens, no typing, just a natural talk.
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setIsCallModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-md transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
                  color: 'var(--primary-foreground)',
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 600,
                  letterSpacing: '0.025em',
                }}
              >
                Schedule Call Now
              </button>
              
              <div className="flex items-center gap-2 text-on-surface-variant text-sm pt-2" style={{ fontFamily: 'var(--font-family-body)' }}>
                <Timer className="w-4 h-4" />
                <span>Takes ~5 minutes</span>
              </div>
            </div>
          </div>

          {/* Fill in Manually */}
          <div className="bg-surface-container-low rounded-xl p-8 hover:bg-surface-container transition-all duration-300">
            <div className="mb-6">
              <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center mb-8">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-on-surface mb-4" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                Fill in Manually
              </h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-family-body)' }}>
                For the meticulous curator. Complete every detail of your physical stats and dietary preferences yourself.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => navigate("/profile/step1")}
                className="w-full py-3.5 px-6 rounded-md transition-all duration-200 flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground"
                style={{
                  border: '2px solid var(--primary)',
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-family-body)',
                  fontWeight: 600,
                  letterSpacing: '0.025em',
                  backgroundColor: 'transparent',
                }}
              >
                DETAILED ENTRY
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-32 pt-8" style={{ borderTop: '1px solid var(--outline-variant)' }}>
          <div className="flex justify-between items-center text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <div className="flex gap-8" style={{ fontFamily: 'var(--font-family-body)' }}>
              <button className="hover:text-on-surface transition-colors">Privacy Policy</button>
              <button className="hover:text-on-surface transition-colors">Terms of Service</button>
              <button className="hover:text-on-surface transition-colors">Scientific Method</button>
              <button className="hover:text-on-surface transition-colors">Contact</button>
            </div>
            <div style={{ fontFamily: 'var(--font-family-body)' }}>© 2026 NutriPlan</div>
          </div>
        </div>
      </div>

      {/* AI Call Modal */}
      <AICallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
      <AICallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
    </div>
  );
}