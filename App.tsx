import React, { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { RoadmapView } from './components/RoadmapView';
import { ReadinessTracker } from './components/ReadinessTracker';
import { MentorChat } from './components/MentorChat';
import { UserProfile, AIRoadmapResponse } from './types';
import { generateStudentRoadmap } from './services/geminiService';
import { LayoutDashboard, Map, TrendingUp, Menu, MessageSquareText } from 'lucide-react';

enum Tab {
  DASHBOARD = 'Dashboard',
  ROADMAP = 'Roadmap',
  CHAT = 'Mentor',
  READINESS = 'Readiness'
}

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmapData, setRoadmapData] = useState<AIRoadmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [error, setError] = useState<string | null>(null);

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateStudentRoadmap(userProfile);
      setRoadmapData(data);
    } catch (err: any) {
      console.error("Roadmap Generation Error:", err);
      // Show the actual error message from the service
      const errorMessage = err.message || "Unknown error occurred";
      
      if (errorMessage.includes("API Key is missing")) {
        setError("Error: API Key is missing. Please create a .env file with API_KEY=your_key");
      } else if (errorMessage.includes("401") || errorMessage.includes("key")) {
        setError("Error: Invalid API Key. Please check your .env file.");
      } else {
        setError(`Failed to generate: ${errorMessage}`);
      }
      
      setProfile(null); // Reset to allow retry
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile || !roadmapData) {
    return (
        <div className="relative">
             {error && (
                <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded-xl text-center z-50 shadow-lg border border-red-400 font-medium">
                    {error}
                </div>
            )}
            <Onboarding onComplete={handleOnboardingComplete} isLoading={isLoading} />
        </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
             E
           </div>
           <span className="font-bold text-lg tracking-tight">EngiPath</span>
        </div>
        <button className="p-2 text-slate-400 hover:text-white">
            <Menu size={24} />
        </button>
      </header>

      {/* Main Content - This is the scrollable area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        {activeTab === Tab.DASHBOARD && <Dashboard data={roadmapData} />}
        {activeTab === Tab.ROADMAP && <RoadmapView data={roadmapData} />}
        {activeTab === Tab.CHAT && <MentorChat profile={profile} />}
        {activeTab === Tab.READINESS && <ReadinessTracker data={roadmapData} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 pb-safe pt-2 px-2 z-50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab(Tab.DASHBOARD)}
            className={`flex flex-col items-center gap-1 transition-colors w-16 ${
              activeTab === Tab.DASHBOARD ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutDashboard size={24} strokeWidth={activeTab === Tab.DASHBOARD ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Dash</span>
          </button>

          <button
            onClick={() => setActiveTab(Tab.ROADMAP)}
            className={`flex flex-col items-center gap-1 transition-colors w-16 ${
              activeTab === Tab.ROADMAP ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Map size={24} strokeWidth={activeTab === Tab.ROADMAP ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Path</span>
          </button>

          <button
            onClick={() => setActiveTab(Tab.CHAT)}
            className={`flex flex-col items-center gap-1 transition-colors w-16 ${
              activeTab === Tab.CHAT ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <MessageSquareText size={24} strokeWidth={activeTab === Tab.CHAT ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Mentor</span>
          </button>

          <button
            onClick={() => setActiveTab(Tab.READINESS)}
            className={`flex flex-col items-center gap-1 transition-colors w-16 ${
              activeTab === Tab.READINESS ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <TrendingUp size={24} strokeWidth={activeTab === Tab.READINESS ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;